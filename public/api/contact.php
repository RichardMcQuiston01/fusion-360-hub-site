<?php
/**
 * Contact form emailer.
 *
 * Receives the POST from /contact/, checks it, and emails it to the address in
 * ../contact-config.php (see docs/contact-form.md). The config file holds the
 * SendGrid key and is never part of the repository.
 *
 * Always answers JSON: {"ok": bool, "message": string}. The page's script shows
 * the message to the visitor.
 */

declare(strict_types=1);

const CONFIG_PATH = __DIR__ . '/../contact-config.php';
const SUBJECTS = ['General Inquiry', 'Product Support', 'Other'];
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_VERSION_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 3600;

/** Ends the request with a JSON result the page can show. */
function respond(bool $ok, string $message, int $status): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

/** Removes line breaks and control characters so a value is safe in a header. */
function singleLine(string $value): string
{
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/', ' ', $value));
}

/** Reads one posted text field as a string (arrays and missing fields become ''). */
function field(string $name): string
{
    $value = $_POST[$name] ?? '';
    return is_string($value) ? trim($value) : '';
}

/** @return array<string, mixed> */
function loadConfig(): array
{
    if (!is_file(CONFIG_PATH)) {
        error_log('contact.php: config file missing at ' . CONFIG_PATH);
        respond(false, 'The contact form is not set up yet. Please email us directly.', 500);
    }
    $config = require CONFIG_PATH;
    if (!is_array($config) || !filter_var($config['to'] ?? '', FILTER_VALIDATE_EMAIL)
        || !filter_var($config['from'] ?? '', FILTER_VALIDATE_EMAIL)) {
        error_log('contact.php: config must return an array with valid "to" and "from" addresses');
        respond(false, 'The contact form is not set up correctly. Please email us directly.', 500);
    }
    return $config;
}

/** Allows only requests that come from this site's own pages. */
function checkOrigin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }
    $originHost = parse_url($origin, PHP_URL_HOST);
    $siteHost = parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST);
    if (!is_string($originHost) || !is_string($siteHost) || strcasecmp($originHost, $siteHost) !== 0) {
        respond(false, 'This request did not come from the contact page.', 403);
    }
}

/** Counts this visitor's recent submissions in a temp file; false when over the limit. */
function withinRateLimit(): bool
{
    $path = sys_get_temp_dir() . '/fusion360-contact-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown') . '.json';
    $now = time();
    $recent = [];
    if (is_file($path)) {
        $stored = json_decode((string) file_get_contents($path), true);
        if (is_array($stored)) {
            $recent = array_values(array_filter(
                $stored,
                static fn ($time): bool => is_int($time) && $time > $now - RATE_LIMIT_WINDOW_SECONDS
            ));
        }
    }
    if (count($recent) >= RATE_LIMIT_MAX) {
        return false;
    }
    $recent[] = $now;
    if (file_put_contents($path, json_encode($recent), LOCK_EX) === false) {
        error_log('contact.php: could not write rate-limit file ' . $path);
    }
    return true;
}

/**
 * Sends through SendGrid's v3 API.
 *
 * @param array<string, mixed> $config
 * @return string|null An error description, or null on success.
 */
function sendWithSendGrid(array $config, string $subject, string $body, string $replyTo, string $replyName): ?string
{
    $payload = [
        'personalizations' => [['to' => [['email' => $config['to']]]]],
        'from' => ['email' => $config['from'], 'name' => (string) ($config['from_name'] ?? 'Fusion 360 Generators')],
        'reply_to' => ['email' => $replyTo, 'name' => $replyName !== '' ? $replyName : $replyTo],
        'subject' => $subject,
        'content' => [['type' => 'text/plain', 'value' => $body]],
    ];
    $curl = curl_init('https://api.sendgrid.com/v3/mail/send');
    if ($curl === false) {
        return 'could not start a cURL request';
    }
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $config['sendgrid_api_key'],
            'Content-Type: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);
    if ($response === false) {
        return 'SendGrid request failed: ' . $curlError;
    }
    if ($status < 200 || $status >= 300) {
        return 'SendGrid answered HTTP ' . $status . ': ' . substr((string) $response, 0, 500);
    }
    return null;
}

/**
 * Sends with PHP's mail(), for hosts without a SendGrid key.
 *
 * @param array<string, mixed> $config
 * @return string|null An error description, or null on success.
 */
function sendWithMail(array $config, string $subject, string $body, string $replyTo): ?string
{
    $headers = [
        'From: ' . singleLine((string) ($config['from_name'] ?? 'Fusion 360 Generators')) . ' <' . $config['from'] . '>',
        'Reply-To: ' . $replyTo,
        'Content-Type: text/plain; charset=UTF-8',
    ];
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    if (!mail((string) $config['to'], $encodedSubject, $body, implode("\r\n", $headers))) {
        return 'mail() returned false';
    }
    return null;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 'Use the contact form to send a message.', 405);
}

checkOrigin();

// Hidden trap field: people never fill it in. Pretend it worked so bots move on.
if (field('website') !== '') {
    respond(true, 'Thank you. Your message has been sent.', 200);
}

$subject = field('subject');
$product = singleLine(field('product'));
$fusionVersion = singleLine(field('fusion_version'));
$name = singleLine(field('name'));
$email = singleLine(field('email'));
$message = field('message');

if (!in_array($subject, SUBJECTS, true)) {
    respond(false, 'Please choose a subject.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > MAX_EMAIL_LENGTH) {
    respond(false, 'Please enter a valid email address so we can reply.', 422);
}
if ($message === '') {
    respond(false, 'Please enter a message.', 422);
}
if (strlen($message) > MAX_MESSAGE_LENGTH || strlen($fusionVersion) > MAX_VERSION_LENGTH
    || strlen($product) > MAX_NAME_LENGTH || strlen($name) > MAX_NAME_LENGTH) {
    respond(false, 'One of the fields is too long. Please shorten it and try again.', 422);
}

$config = loadConfig();

if (!withinRateLimit()) {
    respond(false, 'Too many messages from your connection. Please try again later.', 429);
}

$subjectLine = '[Fusion 360 Generators] ' . $subject . ($product !== '' && $subject === 'Product Support' ? ': ' . $product : '');
$bodyLines = [
    'Subject: ' . $subject,
    'From: ' . ($name !== '' ? $name . ' <' . $email . '>' : $email),
];
if ($subject === 'Product Support' && $product !== '') {
    $bodyLines[] = 'Product: ' . $product;
}
if ($fusionVersion !== '') {
    $bodyLines[] = 'Fusion 360 version: ' . $fusionVersion;
}
$bodyLines[] = '';
$bodyLines[] = $message;
$body = implode("\n", $bodyLines);

$delivery = (string) ($config['delivery'] ?? 'sendgrid');
if ($delivery === 'sendgrid') {
    if (!is_string($config['sendgrid_api_key'] ?? null) || $config['sendgrid_api_key'] === '') {
        error_log('contact.php: delivery is "sendgrid" but sendgrid_api_key is empty');
        respond(false, 'The contact form is not set up correctly. Please email us directly.', 500);
    }
    $failure = sendWithSendGrid($config, $subjectLine, $body, $email, $name);
} elseif ($delivery === 'mail') {
    $failure = sendWithMail($config, $subjectLine, $body, $email);
} elseif ($delivery === 'log') {
    // For testing only: write the message to the PHP error log instead of sending it.
    error_log("contact.php (delivery=log)\n" . $subjectLine . "\n" . $body);
    $failure = null;
} else {
    error_log('contact.php: unknown delivery "' . $delivery . '" (use sendgrid, mail or log)');
    $failure = 'unknown delivery method';
}

if ($failure !== null) {
    error_log('contact.php: could not send message: ' . $failure);
    respond(false, 'Sorry, your message could not be sent. Please email us directly.', 502);
}

respond(true, 'Thank you. Your message has been sent.', 200);
