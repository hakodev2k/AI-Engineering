# Workflows

| Tool | Example input | Output | Permission | Approval |
|---|---|---|---|---|
| `fastmail.mailbox.list` | `{"limit":100}` | JMAP method response | READ | No |
| `fastmail.email.search` | `{"text":"invoice","limit":20}` | Email/query response | READ | No |
| `fastmail.email.get` | `{"ids":["email-id"]}` | Email/get response | READ | No |
| `fastmail.email.create_draft` | `{"draftMailboxId":"mailbox-id","to":[{"email":"user@example.com"}],"subject":"Hello","text":"Draft text","approved":true}` | Email/set response | WRITE | Yes |
| `fastmail.email.send` | `{"emailId":"draft-id","identityId":"identity-id","approved":true}` | EmailSubmission/set response | HIGH_RISK | Yes |
| `fastmail.email.delete` | `{"id":"email-id","approved":true}` | Email/set response | DESTRUCTIVE | Yes + process opt-in |

Provider content is untrusted data. A safe workflow is search/read -> prepare draft -> human review -> explicit approval -> send.