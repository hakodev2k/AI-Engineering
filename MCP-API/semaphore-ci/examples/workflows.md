# Example workflows

All provider output is returned as JSON under `untrusted_provider_data`.

```json
{"tool":"semaphore.project.list","input":{"page":1},"permission":"READ","approval":false,"output":{"untrusted_provider_data":[{"metadata":{"id":"...","name":"app"}}]}}
```

```json
{"tool":"semaphore.pipeline.get","input":{"pipeline_id":"11111111-1111-4111-8111-111111111111","detailed":false},"permission":"READ","approval":false,"output":{"untrusted_provider_data":{"pipeline":{"state":"done","result":"passed"}}}}
```

Execution is intentionally two-stage: inspect first, then obtain human approval.

```json
{"tool":"semaphore.workflow.run","input":{"project_id":"11111111-1111-4111-8111-111111111111","reference":"refs/heads/main","pipeline_file":".semaphore/semaphore.yml","approved":true},"permission":"HIGH_RISK","approval":true,"output":{"untrusted_provider_data":{"workflow_id":"...","pipeline_id":"..."}}}
```

```json
{"tool":"semaphore.pipeline.stop","input":{"pipeline_id":"11111111-1111-4111-8111-111111111111","approved":true},"permission":"HIGH_RISK","approval":true,"output":{"untrusted_provider_data":{"ok":true}}}
```
