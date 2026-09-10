# Mailjet connector examples

## Inspect contacts
Tool: `mailjet.contact.list`
Input: `{ "limit": 50, "offset": 0 }`
Permission: READ. Approval: no.
Expected output: Mailjet response containing paginated `Data` contact records plus provider metadata.

## Add a contact
Tool: `mailjet.contact.create`
Input: `{ "email": "person@example.com", "name": "Example", "approved": true }`
Permission: WRITE. Approval: configurable; required by default.
Expected output: Mailjet contact creation response.

## Subscribe to a list
Tool: `mailjet.contactlist.add_contact`
Input: `{ "listId": "123", "email": "person@example.com", "approved": true }`
Permission: WRITE. Approval: configurable; required by default.
Expected output: Mailjet manage-contact response.

## Send transactional email
Tool: `mailjet.email.send`
Input: `{ "fromEmail":"verified@example.com", "to":[{"email":"recipient@example.com"}], "subject":"Status", "text":"Ready", "approved":true }`
Permission: HIGH_RISK. Approval: always required.
Expected output: Send API v3.1 response with message status and identifiers.
