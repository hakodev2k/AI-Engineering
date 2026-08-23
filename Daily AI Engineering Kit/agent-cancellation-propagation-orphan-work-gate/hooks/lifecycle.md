# Lifecycle Hooks

## Pre-task repository validation
Trigger: before investigation. Action: confirm repository root and config exist. Command: `python scripts/verify_package.py`. Expected: exit 0. Failure blocks execution.

## Post-edit static gate
Trigger: after code edits affecting async/I/O paths. Action: `python scripts/cancellation_gate.py --root . --config config/cancellation-policy.yaml --out cancellation-report.json`. Expected: exit 0 for no blocking finding. Failure blocks verification.

## Test hook
Trigger: after static gate. Action: run repository build/tests plus `python -m unittest discover -s tests -p "test_*.py"`. Expected: all pass. Failure allows at most two evidence-driven repair cycles.

## Final verification
Trigger: before completion. Action: independent verifier checks report, runtime cancellation evidence, diff scope, and approvals. Expected: `verified`. Any other status blocks success.