# Lifecycle Hooks

## Pre-task repository validation
- Trigger: workflow start.
- Preconditions: repository readable; target auth boundary identified.
- Action: confirm `config/policy.yaml`, `scripts/token_gate.py`, tests, and expected auth configuration are present.
- Failure: block on missing required package files or unreadable policy.

## Post-edit token policy check
- Trigger: changes to authentication/authorization config or middleware.
- Action: `python scripts/token_gate.py --claims-file examples/valid-claims.json --policy config/policy.yaml`.
- Expected: exit 0.
- Failure: block merge-ready status.

## Negative-case verification
- Trigger: after successful positive gate.
- Action: `python scripts/token_gate.py --claims-file examples/wrong-audience-claims.json --policy config/policy.yaml`.
- Expected: exit 2 and `audience_mismatch`.
- Failure: block.

## Test hook
- Trigger: before final verification.
- Action: `python -m unittest discover -s tests -v`.
- Expected: all tests pass.
- Failure: block; preserve output.

## Final verification
- Trigger: workflow completion candidate.
- Action: independent verifier checks evidence, approval requirements, and signature-validation boundary.
- Failure: block completion.
