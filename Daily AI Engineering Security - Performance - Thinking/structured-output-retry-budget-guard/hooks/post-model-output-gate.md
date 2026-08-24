# Hook: Post-Model Output Gate

## Trigger
After a model/subagent returns a terminal candidate and before that candidate is published as a completed structured result or handed to a downstream workflow.

## Preconditions
The raw output is preserved, the declared schema/version is known, local validation has run, and the terminal-attempt event log is writable.

## Action
Append the validation result to the event log and run the deterministic retry-budget guard before allowing another repair or completion publication.

## Command
```bash
python scripts/structured_output_guard.py --events "$STRUCTURED_OUTPUT_EVENTS" --policy config/retry-policy.json
```

## Expected result
Exit 0 with either `status=pass` for a valid latest output or `status=repair_allowed` for one further policy-compliant narrow repair.

## Failure behavior
Exit 2 returns `status=stop` and blocks additional terminal-output retries. Exit 1 indicates malformed events/policy and blocks completion until configuration is corrected.

## Blocking
Yes. A candidate MUST NOT be published as verified structured output when this hook or local schema validation fails.