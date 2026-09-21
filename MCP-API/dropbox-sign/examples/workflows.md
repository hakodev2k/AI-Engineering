# Workflows

## Inspect a request
Tool: `dropbox_sign.signature_request.get`
Input: `{ "signature_request_id": "..." }`
Permission: READ. Approval: no.
Output: Dropbox Sign signature-request metadata JSON.

## Send from a template
Tool: `dropbox_sign.signature_request.send_with_template`
Input: `{ "template_ids": ["..."], "subject": "NDA", "signer_email": "person@example.com", "signer_name": "Example Person", "test_mode": true }`
Permission: WRITE/HIGH_RISK. Approval: yes.
Output: created signature-request JSON.

## Remind a signer
Tool: `dropbox_sign.signature_request.remind`
Input: `{ "signature_request_id": "...", "email_address": "person@example.com" }`
Permission: WRITE. Approval: yes.

## Cancel an incomplete request
Tool: `dropbox_sign.signature_request.cancel`
Input: `{ "signature_request_id": "..." }`
Permission: DESTRUCTIVE. Approval: yes.
