# Workflow: Secure Hook Change

## Trigger
Agent proposes a change to hook/custom-agent configuration.

## Goal
Prevent prompt-influenced file edits from becoming unapproved deferred shell execution.

## Inputs
Diff, target path, workspace root, provenance, policy, approval artifact.

## Baseline
Record current hook files, registered commands, and whether hooks are enabled.

## Stages
1. Observe changed path and provenance.
2. Measure current executable-hook baseline.
3. Diagnose whether the proposed file is executable configuration.
4. Form one explicit hypothesis describing the new execution capability.
5. Run `scripts/hook_policy_guard.py` without approval.
6. If `require_approval`, obtain explicit approval for the exact change.
7. Rerun with approval; unsafe patterns MUST still block.
8. Independent Security Verifier reviews the result.
9. Activate only after pass.

## Tools
Read-only diff, validator, unit tests.

## Outputs
Validator result, approval record, independent verification result.

## Checkpoints
Before approval, before activation, after tests.

## Metrics
Unsafe changes blocked; approval coverage; verification coverage.

## Retry policy
Maximum 2 correction cycles.

## Stop conditions
Secret exposure, workspace escape, ambiguous command indirection, or exhausted retries.

## Failure path
Leave hooks disabled or retain previous known-good configuration.

## Verification
Unit tests plus independent review.

## Definition of Done
Known-good baseline preserved or intentionally changed; approval is specific; validator passes; tests pass; independent verifier passes.
