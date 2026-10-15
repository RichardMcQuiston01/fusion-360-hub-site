<?php
/**
 * Settings for public/api/contact.php.
 *
 * Copy this file to contact-config.php in the site's root folder on the server
 * (the folder that holds index.html, next to the api folder) and fill it in.
 * Do this in Hostinger's File Manager, not through the deploy: the deploy never
 * touches this file, and it must never be committed. See docs/contact-form.md.
 */

declare(strict_types=1);

return [
    // 'sendgrid' (recommended), 'mail' (PHP mail()), or 'log' (testing only).
    'delivery' => 'sendgrid',

    // Where messages are delivered.
    'to' => 'fusion360@richardmcquiston.com',

    // The sender address. For SendGrid it must be a verified Single Sender or an
    // address on an authenticated domain. For 'mail' use an address on this domain.
    'from' => 'noreply@hiredhandhq.com',
    'from_name' => 'Fusion 360 Generators',

    // A SendGrid API key limited to "Mail Send". Only used when delivery is 'sendgrid'.
    'sendgrid_api_key' => '',
];
