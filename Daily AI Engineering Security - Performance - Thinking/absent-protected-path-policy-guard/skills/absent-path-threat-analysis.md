# Skill: Absent Protected Path Threat Analysis

## Purpose
Determine whether a filesystem sandbox or permission profile preserves protected-path invariants before and after a protected descendant is created.

## Trigger
Use when adding or changing workspace-write permissions, sandbox backends, protected metadata lists, Git/worktree isolation, or platform-specific filesystem enforcement.

## Inputs
- Workspace roots and writable roots.
- Protected exact paths/globs.
- Sandbox backend and platform.
- Whether the backend can deny creation/access for paths that do not yet exist.
- Whether policy setup materializes absent paths.
- Trusted consumers that may later load/execute metadata.

## Preconditions
Run only against a disposable fixture for active create-attempt verification. Static evaluation may run against a real workspace because the reference script performs no mutation.

## Required context
Current policy, backend implementation/contract, target workspace topology, and the trusted operations that consume `.git`, `.codex`, `.agents`, hooks, worktree config, LFS config, or equivalent metadata.

## Allowed tools
Read-only filesystem inspection, policy parser, sandbox documentation/source inspection, isolated fixture tests, `scripts/protected_path_guard.py`.

## Constraints
- MUST NOT create protected paths in a real user workspace merely to test protection.
- MUST NOT weaken a deny rule to make setup succeed.
- MUST distinguish current-object denial from future-name denial.
- MUST require explicit human approval before testing any write outside a disposable fixture.

## Procedure
1. Enumerate writable ancestors.
2. Enumerate protected descendants and mark each as present or absent.
3. Record backend capability for future-path denial independent of object existence.
4. Record whether setup materializes absent objects to attach ACLs or labels.
5. Run the static guard and capture machine-readable findings.
6. For every failing absent descendant, identify the later trusted consumer and plausible persistence consequence.
7. In a disposable fixture, run backend-native enforcement tests for both absent and present states.
8. Verify setup itself creates no repository/tool sentinel.
9. Produce Facts, Evidence, Assumptions, Risk, Decision, and Verification status.

## Decision points
- **Pass:** every protected namespace remains denied in both absent and present states without setup mutation.
- **Block:** any writable ancestor permits first-time creation of an absent protected descendant.
- **Block:** enforcing the rule requires materializing a path whose existence changes workspace semantics.
- **Escalate:** backend capability is undocumented or platform results disagree.

## Expected output
A per-path matrix with existence state, writable ancestor, future-deny capability, materialization behavior, trusted consumer, and pass/block result.

## Metrics
Protected-path state coverage, absent-state block rate, setup-mutation count, platform parity, security-test pass rate.

## Verification
An independent reviewer must reproduce the fixture results and confirm the real workspace was not mutated.

## Failure handling
Detection: guard/test failure or backend ambiguity.  
Evidence: policy JSON, backend version, fixture tree before/after, command exit status.  
Retry policy: maximum 2 retries after a concrete policy/backend change.  
Fallback: downgrade writable scope or disable the affected backend/profile.  
Escalation: platform/security owner.  
Stop condition: unresolved future-path protection or any unexpected mutation.
