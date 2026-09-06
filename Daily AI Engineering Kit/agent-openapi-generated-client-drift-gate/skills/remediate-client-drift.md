# Skill: Remediate Generated Client Drift

## Purpose
Restore synchronization between the authoritative OpenAPI contract and checked-in generated clients with the smallest safe change.

## When to use
After the generation contract is known and deterministic regeneration proves drift.

## Inputs
Generation contract, drift diff, repository requirements, relevant tests, approval state.

## Preconditions
Authoritative spec and exact generation command are known; generator version is fixed or explicitly approved.

## Allowed tools
Repository editing outside generated roots, generator execution, formatter, compiler/build, tests, Git diff inspection.

## Constraints
Generated files are changed through regeneration, not hand editing, unless repository policy explicitly allows manual edits.

## Process
1. Classify drift: stale checked-in output, changed generator/config, changed spec, nondeterministic generator output, or post-processing mismatch.
2. Validate one hypothesis at a time using repository evidence.
3. Prefer restoring the documented generator command/configuration before changing API semantics.
4. Apply the smallest source/config/tooling correction required.
5. Regenerate from a clean worktree.
6. Inspect all generated changes and reject unrelated output.
7. Run compile/build and focused tests consuming the client.
8. Reset to the candidate state and regenerate again to prove deterministic output where repository tooling permits.
9. Maximum remediation cycles: 3. Preserve evidence after each cycle.

## Expected output
A minimal source/config/generated diff plus verification evidence and remaining risks.

## Verification
Success requires no unexpected generated diff on a clean regeneration, relevant build/tests passing, and independent verification.

## Failure handling
Transient generator/network failures may be retried twice. Deterministic drift is not blind-retried. After three remediation cycles, stop and escalate with evidence.

## Stop conditions
Stop before breaking API changes, large dependency/generator upgrades, secret changes, production changes, or security-control weakening without approval.
