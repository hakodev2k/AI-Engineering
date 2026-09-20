# Workflows

- `tally.form.list` — `{"page":1,"limit":25}` — READ, no approval.
- `tally.form.get` — `{"formId":"abc123"}` — READ, no approval; returns complete form structure as untrusted provider data.
- `tally.submission.list` — `{"formId":"abc123","page":1,"limit":50}` — READ, no approval.
- `tally.form.create` — `{"status":"DRAFT","blocks":[{"uuid":"...","type":"FORM_TITLE","payload":{"title":"Intake"}}],"approved":true}` — WRITE, approval required.
- `tally.form.update` — supply the full current blocks array with intended changes and `approved:true`; WRITE, approval required.
