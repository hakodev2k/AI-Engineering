# Hook: Pre-Resume Cache Check

## Trigger
Immediately before a persisted session is resumed by CLI, IDE, SDK, cron, or background worker.

## Preconditions
`previous` and `current` fingerprints are available and `estimated_context_tokens` is populated.

## Action
Run:

```bash
python3 scripts/cache_coherence_guard.py resume.json --policy config/policy.json
```

Interpret exit codes: `0` allow; `3` require controlled re-baseline; `4` block; `2` invalid input.

## Expected result
Matched runtimes are allowed. Material mismatches are made explicit before an expensive model request occurs.

## Failure behavior
Invalid/missing metadata blocks automatic resume for sessions above the configured threshold. A re-baseline decision requires the workflow's recorded reason.

## Blocks completion
Yes for exit 2 or 4. Exit 3 blocks automatic resume until the migration decision is recorded.
