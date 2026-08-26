# Skill: Path Boundary Analysis

## Purpose
Determine whether every agent file-access path enforces the same canonical workspace boundary.

## Trigger
New file tool, attachment syntax, auto-edit mode, sandbox change, symlink-related bug, or outside-workspace access report.

## Inputs
Workspace roots, permission policy, access syntax, target paths, operation type, relevant runtime version, existing logs.

## Preconditions
Use a disposable test workspace. Do not use real secrets as probes.

## Required context
Only filesystem topology, policy and access-path behavior required to reproduce the boundary decision.

## Allowed tools
Read-only repository inspection, temporary directories, unit tests, `scripts/path_gate.py`.

## Constraints
MUST NOT weaken deny rules to reproduce a bug. MUST NOT probe production secrets. MUST canonicalize before authorization.

## Procedure
1. Enumerate all access paths: read/write/edit/create/attachment/patch/terminal wrapper.
2. Capture baseline decisions for inside-workspace, `../`, symlink, nonexistent target and denied-prefix fixtures.
3. Record lexical target and resolved target separately.
4. Identify the exact layer performing authorization for each syntax.
5. Form a hypothesis for any inconsistent decision.
6. Route all candidate accesses through the deterministic gate.
7. Re-run fixtures and compare baseline versus post-change outcomes.
8. Request independent verification for any high-risk write path.

## Decision points
Block when resolution fails, the resolved path escapes the root, a deny prefix matches, or an access path bypasses the shared gate.

## Expected output
Facts, Evidence, Access-path matrix, Root cause, Decision, Risks, Verification status.

## Metrics
Boundary bypass count, resolution-error fail-open count, fixture coverage, inconsistent-policy count.

## Verification
Independent reviewer reproduces all escape fixtures and confirms safe inside-workspace operations remain allowed.

## Failure handling
Maximum 2 fix/retest cycles. Fallback is disabling the affected access mode. Escalate any production-write or secret-read exposure.

## Stop conditions
Stop immediately on confirmed outside-workspace write/read in a privileged environment, or after 2 failed remediation cycles.
