# Workflow: Tool Policy Regression Verification

## Trigger
After a tool-policy/runtime fix, dependency upgrade, provider adapter change, or tool-registry refactor.

## Goal
Detect reintroduction of fail-open tool exposure before release.

## Inputs
Known tool set, affected modes, representative policies, current build.

## Baseline
The expected effective set for each fixture is derived from explicit policy semantics, not current runtime behavior.

## Stages
1. Build fixtures for missing allowlist, explicit empty, restricted allowlist, deny-only, and mode/subagent variants.
2. Capture provider-visible and runtime-executable sets for every fixture.
3. Run the deterministic gate for every fixture.
4. Run `python -m unittest tests/test_tool_policy_gate.py`.
5. Compare current effective sets with the approved baseline.
6. If any fixture broadens capability, block completion and investigate. Maximum one rerun after a concrete fix.

## Responsible agent
Security Verifier.

## Tools
Test runner, safe capability introspection, policy gate, source diff.

## Outputs
Fixture matrix and pass/block verdict.

## Checkpoints
No fixture is skipped because it resolves to zero tools. Mode-specific results must be explicitly recorded.

## Metrics
Fixture coverage, forbidden-tool count, provider/runtime mismatch count, high-impact exposure count.

## Retry policy
One rerun after remediation; no blind retries.

## Stop conditions
Pass only when all required fixtures pass. Otherwise block release and escalate with evidence.

## Failure path
Keep the most restrictive safe policy active; do not disable the gate.

## Verification
A forbidden tool is neither offered to the model nor dispatchable through any tested path.

## Definition of Done
All deterministic tests pass, affected integration modes pass, and the verification report contains no unresolved capability broadening.
