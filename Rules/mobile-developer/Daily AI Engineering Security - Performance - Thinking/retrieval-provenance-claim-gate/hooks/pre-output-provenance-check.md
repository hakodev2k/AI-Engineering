# Hook — Pre-Output Provenance Check

## Trigger
Immediately before emitting a response containing a gated external-access completion claim.

## Preconditions
The response or structured claims and current evidence ledger are available.

## Action
1. Extract gated claim records from the response pipeline.
2. For structured pipelines, call:
   `python scripts/provenance_gate.py --claims claims.json --evidence evidence.json`
3. Require every `observation-complete` claim to match a successful evidence record with the same source ID and compatible action.
4. Return `allow` when all gated claims pass, otherwise return `rewrite-required` with failed claim IDs.

## Expected result
No completion-state external-access claim is emitted without observable source-matched success evidence.

## Failure behavior
Missing or malformed evidence MUST NOT default to success. Mark the affected claim unsupported and require truthful rewrite.

## Blocks completion
It blocks the original completion-state wording, not the whole user response. The response may proceed after rewriting the claim to an accurate attempt, inference, user-provided, unavailable, or unverified state.
