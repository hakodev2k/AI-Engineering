# Hook: Post-Attempt Verification

## Trigger
After every repair attempt and before another model retry or final completion.

## Preconditions
`contract.json`, `run-result.json`, and `config/policy.json` exist. The attempt fingerprint and observed tool/test events have been recorded.

## Action
Evaluate acceptance predicates, required-call coverage, duplicate fingerprints, and retry budget using the deterministic verifier.

## Script / command
```bash
python scripts/repair_verifier.py \
  --contract contract.json \
  --run-result run-result.json \
  --policy config/policy.json
```

## Expected result
Exit `0` with `verified` only when every required acceptance predicate and required call is evidenced. Exit `3` means a bounded repair is permitted. Exit `4` blocks more autonomous retries or completion. Invalid input exits `2`.

## Failure behavior
On `repair`, provide the verifier's structured failed IDs, observations, and missing calls to the repair workflow. On `stop`, preserve evidence and exit autonomous execution. Never convert a blocking result into success.

## Blocks completion
Yes. Final success MUST NOT be emitted when this hook fails.