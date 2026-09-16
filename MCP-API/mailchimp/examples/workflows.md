# Workflows

## Inspect an audience
Tool: `mailchimp.audience.list`  
Input: `{ "count": 20, "offset": 0 }`  
Permission: READ. Approval: no.  
Output: Marketing API audience collection.

## Upsert an opted-in contact
Tool: `mailchimp.contact.upsert`  
Input: `{ "listId": "audience-id", "email": "person@example.com", "statusIfNew": "pending", "approved": true }`  
Permission: WRITE. Approval: yes by default. Use `pending` when confirmation is appropriate.

## Tag a contact
Tool: `mailchimp.contact.tags.update`  
Input: `{ "listId": "audience-id", "email": "person@example.com", "tags": [{"name":"customer","status":"active"}], "approved": true }`  
Permission: WRITE. Approval: yes by default.
