# Hook: Pre-Evaluation Egress Gate

## Trigger
Immediately before the evaluation runner starts a model/agent phase.

## Preconditions
A policy file and a non-empty network-event JSONL observation are available.

## Action
Run the attestation script and require exit code 0.

## Script/command
`python scripts/attest_egress.py --policy config/egress-policy.example.json --events "$EGRESS_EVENTS" --out "$EGRESS_ATTESTATION"`

## Expected result
Exit 0 and an attestation with `status: PASS`, zero unknown destinations and zero forbidden destinations.

## Failure behavior
Exit non-zero blocks the evaluation. Preserve the attestation and sanitized telemetry for review. Do not auto-expand the allowlist.

## Blocks completion
Yes.
