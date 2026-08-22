# Protect and Verify Workflow

## Trigger
New/changed sandbox policy, agent-host upgrade, workspace initialization, or a protected-path enforcement incident.

## Goal
Establish an existence-independent protected-path boundary and verify it against representative runtime behavior.

## Inputs
Workspace, policy, native sandbox settings, protected control-path inventory.

## Baseline
Record current outcomes for allowed path, existing protected path, and absent protected path. Record native sandbox mode without changing it.

## Stages
1. **Observe** — collect desired policy and current effective behavior.
2. **Measure baseline** — run non-destructive/temporary fixtures.
3. **Diagnose** — identify existence-dependent gaps or semantic side effects from sentinel creation.
4. **Hypothesis** — a logical target-prefix gate closes the gap without creating filesystem objects.
5. **Implement** — integrate pre-tool hook and trusted policy.
6. **Measure again** — execute the test matrix.
7. **Independent verification** — Security Verifier reviews evidence.

## Responsible agent
Implementation agent integrates the hook; Security Verifier performs final verification.

## Tools
`protected_path_guard.py`, unit tests, host sandbox diagnostics.

## Outputs
Decision logs, test results, documented policy/runtime mismatches, verification status.

## Checkpoints
Before integration; after deny fixtures; after allow fixtures; before completion.

## Metrics
Deny coverage 100%; allow false positives 0%; missing-path coverage 100%.

## Retry policy
At most 2 implementation iterations. A failed security fixture requires diagnosis before retry; never relax the protected list automatically.

## Stop conditions
Any bypass, sandbox-disabled state, unresolved canonicalization error, or uncontrolled mutation stops completion.

## Failure path
Capture exact path/operation/decision, revert integration if it breaks allowed operations, escalate platform-specific sandbox defects.

## Verification
Independent verifier reruns tests from a clean temporary workspace.

## Definition of Done
Implemented, measured, and independently verified with native security boundary preserved.
