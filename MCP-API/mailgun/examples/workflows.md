# Mailgun connector examples

## Inspect sending domains
Tool: `mailgun.domain.list` — READ — no approval.
```json
{"limit":50}
```

## Check delivery logs
Tool: `mailgun.logs.query` — READ — no approval.
```json
{"start":"Sun, 30 Aug 2026 00:00:00 +0000","end":"Sun, 30 Aug 2026 06:00:00 +0000","limit":100}
```

## Review suppressions before a campaign
Use `mailgun.suppression.bounce.list` and `mailgun.suppression.complaint.list` with a verified sending domain. Both are READ tools.

## Prepare and send mail
Tool: `mailgun.message.send` — HIGH_RISK — explicit approval required.
```json
{"domain":"mg.example.com","from":"Ops <ops@mg.example.com>","to":["user@example.net"],"subject":"Service notice","text":"Message body","approval_token":"<payload-bound HMAC>"}
```
The connector does not retry a failed send automatically, avoiding duplicate external messages.
