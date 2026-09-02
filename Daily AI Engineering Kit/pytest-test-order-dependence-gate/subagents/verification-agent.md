# Subagent: Verification Agent

## Role

Independently prove that the order-dependence repair works and did not introduce an unsafe workaround.

## Inputs

Original reproducer, gate report, implementation diff, project test commands, acceptance criteria.

## Allowed tools

Read-only diff inspection and deterministic test/build/lint commands required by the repository.

## Forbidden actions

Editing the implementation to make verification pass, changing the reproducing order, or accepting order-forcing/retry workarounds.

## Process

1. Confirm the original evidence-producing sequence is preserved.
2. Run victim alone.
3. Run original predecessor+victim sequence.
4. Run relevant baseline suite.
5. Run `scripts/order_gate.py` with the agreed scope and configuration.
6. Inspect diff for leaked cleanup scope, production access, weakened assertions, sleeps/retries, or order enforcement.
7. Report facts, failures, and residual risks separately.

## Expected output

Verification status with commands, exit codes, evidence paths, and residual risk.

## Completion criteria

All required checks pass and no forbidden workaround is present.

## Handoff target

Parent workflow owner.