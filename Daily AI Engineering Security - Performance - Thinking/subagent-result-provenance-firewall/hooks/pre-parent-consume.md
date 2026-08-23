# Hook: Pre Parent Consume

## Trigger
Immediately after child completion and before the parent injects/acts on the child result.

## Preconditions
Transcript and result are written to immutable temporary paths.

## Action
Run: `python scripts/audit_subagent_result.py "$TRANSCRIPT" --result "$RESULT"`

## Expected result
Exit `0` permits normal evidence-aware consumption. Exit `2` marks the result quarantined and routes it to `subagents/result-verifier.md`. Exit `3` blocks consumption because input is invalid.

## Failure behavior
Fail closed for security-sensitive or side-effecting parent decisions. Preserve scanner output with the run ID.

## Blocks completion
Yes, when the parent would otherwise take a high-impact action from an unverified result.
