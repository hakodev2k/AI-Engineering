# Workflow: Diagnose and Fix Workspace Boundary

## Trigger
Outside-workspace access, symlink/path traversal report, or new file-access mechanism.

## Goal
Prove the boundary failure, identify the inconsistent enforcement layer, integrate a canonicalization-first gate, and measure the result.

## Inputs
Workspace roots, policy, operation type, access syntax, safe fixture paths, runtime version.

## Baseline
Record allow/block outcomes for inside-root, `../`, symlink escape, denied prefix, and nonexistent-target cases before any change.

## Context
Keep only path topology, policy and access-path evidence; never include real secret contents.

## Stages
1. **Observe:** capture the failing access path and decision.
2. **Measure baseline:** execute the fixture matrix.
3. **Diagnose:** map which layer normalizes and which layer authorizes.
4. **Hypothesize:** state one falsifiable root-cause hypothesis.
5. **Implement:** route the affected path through canonicalization-before-authorization.
6. **Measure again:** rerun the exact matrix.
7. **Improved?** If no, revise hypothesis up to 2 times; if yes, proceed.
8. **Verify:** independent Security Verifier repeats the regression suite.

## Responsible agent
Implementation engineer; Security Verifier owns final verification.

## Tools
`path_gate.py`, unit tests, temporary filesystem fixtures, read-only code search.

## Outputs
Baseline matrix, root-cause note, changed integration path, before/after results, verifier decision.

## Checkpoints
After baseline; before implementation; after first post-change run; before release.

## Metrics
Escape acceptance rate, fail-open resolution count, valid-operation false positives, access-path coverage.

## Retry policy
Maximum 2 hypothesis/implementation revisions.

## Stop conditions
Stop on confirmed privileged outside-root access, inability to canonicalize safely, or exhausted retries.

## Failure path
Disable the affected automatic access mode and require explicit human-controlled operation until fixed.

## Verification
All malicious fixtures blocked; valid internal access preserved; independent review complete.

## Definition of Done
Baseline captured, root cause evidenced, implementation integrated, metrics compared, tests pass, no blocking security issue remains.
