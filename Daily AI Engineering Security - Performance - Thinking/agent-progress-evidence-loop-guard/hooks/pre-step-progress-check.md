# Hook: Pre-Step Progress Check

## Trigger
Before scheduling the next agent step after at least two completed tool-using steps.

## Preconditions
A trace JSONL file and progress policy exist; current durable-state fingerprints have been recorded.

## Action
Run:
`python scripts/progress_guard.py --trace <trace.jsonl> --policy config/policy.json`

## Expected result
Exit code `0` means continue. Exit code `3` means the runtime must stop or enter the bounded recovery workflow. Exit code `2` means invalid/missing evidence and blocks autonomous continuation until the trace is repaired or a hard-budget fallback is applied.

## Failure behavior
Fail closed for autonomous continuation. Preserve the last verified checkpoint and diagnostic output.

## Blocking
Yes when exit code is non-zero.
