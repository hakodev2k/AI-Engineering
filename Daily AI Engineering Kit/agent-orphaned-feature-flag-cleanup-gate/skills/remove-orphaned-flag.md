# Skill: Remove Orphaned Flag

## Purpose
Remove a retired feature flag while preserving the explicitly selected permanent behavior.

## When to use
Only after lifecycle discovery establishes `state=retired`, a non-ambiguous `expected_behavior`, and a complete reference map.

## Inputs
Lifecycle finding, repository tests, flag registry, policy, approval record when required.

## Preconditions
No blocking lifecycle conflict remains. Required approvals for dangerous side effects are present.

## Allowed tools
Repository editing, formatter/linter, unit/integration/E2E tests, deterministic scanner, Git diff.

## Constraints
Keep changes scoped to one flag. Do not mutate remote flag-provider configuration or production systems.

## Process
1. Select the permanent branch from registry-backed evidence.
2. Replace the runtime decision with the permanent behavior using the smallest control-flow change.
3. Remove only code that becomes unreachable because of that replacement.
4. Preserve shared validation, authorization, telemetry, and error handling unless evidence proves they are flag-only.
5. Update tests to assert the permanent behavior without the flag toggle.
6. Remove obsolete local configuration bindings/adapters only when no other flag depends on them.
7. Update the local registry state/tombstone if required by project convention; preserve owner, retired date, and expected behavior.
8. Run repository-native formatter, build, and targeted tests.
9. Run `flag_cleanup_gate.py scan`; investigate every remaining non-allowlisted reference.
10. Inspect `git diff` for unrelated changes.
11. Hand off to an independent verifier.

## Expected output
Minimal diff, tests/results, updated scan evidence, and remaining-risk list.

## Verification
Implementation is not complete until targeted tests pass, zero non-allowlisted references remain, and the independent verification status is `verified`.

## Failure handling
Implementation/test-fix cycles are capped at 3. Transient tool failures may be retried at most 2 times with evidence preserved. Repeated deterministic failure stops and escalates.

## Stop conditions
Stop if cleanup requires breaking API behavior, deleting production state/data, weakening security controls, changing secrets/infrastructure, or broad dependency upgrades without approval.
