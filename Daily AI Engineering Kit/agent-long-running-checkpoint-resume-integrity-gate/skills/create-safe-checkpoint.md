# Skill: Create Safe Checkpoint

## Purpose
Persist enough evidence for a later agent process to decide whether resumption is still valid.

## When to use
Before planned pause, approval wait, worker migration, context-window handoff, or recoverable interruption.

## Inputs
Task ID, repository, normalized edit scope, current stage, single next action, approvals, evidence paths, optional environment fingerprint.

## Preconditions
Repository state is readable and the next action is bounded.

## Process
1. Record exact task ID and normalized scope.
2. Capture Git HEAD, clean/dirty state, and tracked diff hash.
3. Record current stage and exactly one next action.
4. Record approval action, approver, and expiration for each approval relied upon.
5. Record evidence paths needed to reconstruct decisions.
6. Timestamp checkpoint in UTC.
7. Validate fields against checkpoint schema expectations.
8. Do not store secrets, access tokens, raw credentials, or private keys.
9. Persist checkpoint atomically where possible.
10. Stop work only after checkpoint is readable back.

## Expected output
A self-contained checkpoint JSON whose claims can be compared with fresh state.

## Verification
Re-read the checkpoint and verify hashes/HEAD against the repository before declaring checkpoint creation complete.

## Failure handling
If state capture fails, retry at most twice only for transient Git/tool errors. Never fabricate missing values.

## Stop conditions
Unknown task identity, ambiguous next action, inaccessible repository, or approval metadata unavailable for approval-dependent work.
