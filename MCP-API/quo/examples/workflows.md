# Workflows

## Review a conversation before messaging
1. `quo.phone_number.list` `{ "maxResults": 20 }` -> phone-number records. READ; no approval.
2. `quo.message.list` `{ "phoneNumberId": "PN_ID", "maxResults": 20 }` -> messages plus pagination metadata. READ; no approval.
3. `quo.message.send` `{ "from": "PN_ID", "to": "+14155550123", "content": "Confirmed for tomorrow.", "approved": true }` -> created message. HIGH_RISK; explicit human approval required.

## Maintain a contact
1. `quo.contact.list` `{ "maxResults": 20 }` -> contacts. READ.
2. `quo.contact.create` `{ "firstName": "Ada", "lastName": "Lovelace", "phoneNumbers": [{"value":"+14155550123"}], "approved": true }` -> contact. WRITE; approval required by default.
3. `quo.contact.update` `{ "id":"CONTACT_ID", "firstName":"Ada", "approved":true }` -> updated contact. WRITE.

Deletion additionally requires `QUO_ALLOW_DESTRUCTIVE=true` and `approved:true`; keep it disabled unless the operator deliberately enables destructive actions.
