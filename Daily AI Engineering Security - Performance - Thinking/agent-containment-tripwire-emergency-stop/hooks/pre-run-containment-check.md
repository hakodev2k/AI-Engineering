# Hook: Pre-Run Containment Check

## Trigger
Immediately before agent execution.

## Preconditions
Policy and attestation JSON exist; active policy is read-only to the agent.

## Action
Run `python scripts/containment_guard.py preflight --policy config/containment-policy.json --attestation attestation.json`.

## Expected result
Exit 0 and JSON decision `allow`.

## Failure behavior
Block run. Fix configuration only if evidence shows a benign preflight defect; maximum two retries.

## Blocking
Yes. Missing monitor, kill path, sandbox, or network-policy attestation is a blocking failure.
