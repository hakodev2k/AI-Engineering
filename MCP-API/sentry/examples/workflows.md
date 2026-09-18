# Workflow examples

Read triage:
```json
{"tool":"sentry.issue.list","input":{"organization":"acme","query":"is:unresolved"},"expected_output":{"data":"Sentry issue array","untrusted_provider_content":true},"permission":"READ","approval":false}
```

Resolve after human review:
```json
{"tool":"sentry.issue.update","input":{"issueId":"12345","status":"resolved"},"expected_output":{"data":"updated Sentry issue","untrusted_provider_content":true},"permission":"WRITE","approval":true}
```
