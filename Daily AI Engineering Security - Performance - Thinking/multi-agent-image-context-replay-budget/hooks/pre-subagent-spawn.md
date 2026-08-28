# Hook: Pre-Subagent Spawn Resource Gate
## Trigger
Immediately before spawning or retrying a child agent in an image-heavy task family.
## Preconditions
Current normalized task-family telemetry has been written to JSONL.
## Action
Run `python scripts/image_context_budget.py --input <metrics.jsonl> --policy config/policy.json`.
## Expected result
Exit 0 permits fan-out. Exit 3 means context must be narrowed before spawning. Exit 2 means telemetry/configuration is invalid.
## Failure behavior
Fail closed for additional fan-out; preserve the parent task and evidence. Do not delete context automatically.
## Blocking
Yes for new descendants; no for read-only diagnosis and safe parent completion.
