# Hook: Post Model Response
## Trigger
Immediately after each model response, before the agent decides to retry.
## Preconditions
Finish reason and usage counters are available.
## Action
Serialize observable telemetry to an event file and run: `python scripts/retry_budget_guard.py --event <event.json> --policy config/policy.json`
## Expected result
Exit `0`: accept usable output. Exit `4`: one policy-permitted retry/continuation. Exit `3`: stop retrying and surface the remediation/failure reason. Exit `2`: malformed telemetry.
## Failure behavior
Malformed or unclassified telemetry blocks autonomous retries.
## Blocking
Yes for retries. The hook does not block delivery of already-usable visible output.
