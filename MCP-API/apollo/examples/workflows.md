# Apollo workflow examples

## Prospect research
Tool: `apollo.people.search`  
Input: `{"query":"VP Engineering fintech"}`  
Permission: READ; approval: no.  
Output: Apollo search response wrapped as untrusted provider data.

## Enrichment
Tool: `apollo.people.enrich`  
Input: `{"email":"person@example.com"}`  
Permission: READ; approval: no. Enrichment can consume Apollo credits.

## Create CRM contact
Tool: `apollo.contact.create`  
Input: `{"firstName":"Jane","lastName":"Doe","email":"jane@example.com"}`  
Permission: WRITE; approval: required unless the deployment explicitly enables approved writes.

## Enroll in sequence
Tool: `apollo.sequence.enroll`  
Input: `{"sequenceId":"seq_id","contactIds":["contact_id"],"emailAccountId":"mailbox_id","approved":true}`  
Permission: HIGH_RISK; explicit approval: required. This can initiate external outreach.
