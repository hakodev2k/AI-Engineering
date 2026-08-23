# Implement Circuit Breaker Fix

## Purpose
Apply the smallest safe correction after investigation confirms a defect.

## Inputs
Verified finding, acceptance criteria, affected files/tests, current policy.

## Preconditions
Root cause supported by evidence; worktree baseline known; approval obtained if production policy/security/contracts are affected.

## Process
1. Define the invariant that currently fails.
2. Add or update a failing test reproducing the confirmed behavior.
3. Change only the breaker classification, transition, probe, or instrumentation logic needed for the invariant.
4. Preserve public contracts unless explicitly required.
5. Run focused tests, then relevant project tests.
6. Run `python scripts/validate-circuit.py <evidence.json>` when evidence is available.
7. Inspect changed files for unrelated edits, secrets, disabled safety checks, and widened permissions.
8. Hand off to the independent verifier.

## Expected output
Minimal diff, tests, commands/results, residual risks.

## Verification
The reproduction fails before the change and passes after it; no unrelated regression is introduced.

## Failure handling
One implementation retry is allowed after a test failure if new evidence identifies a concrete correction. A second failure stops for re-investigation.

## Stop conditions
Unconfirmed root cause; destructive/production action without approval; required tests unavailable; requested fix requires unrelated redesign.
