# Skill: Effective Tool Policy Audit

## Purpose
Verify that declared agent capability intent matches the tools actually visible to the model and executable by runtime dispatch.

## Trigger
Run at agent/session initialization, subagent creation, execution-mode changes, tool-registry refresh, policy hot reload, sandbox creation, and before enabling high-impact tools.

## Inputs
- Whether an allowlist field is absent or explicitly present.
- Allowlist and denylist values.
- Registered/known tool universe.
- Provider-visible tool names.
- Runtime-executable tool names.
- Execution mode and policy revision.

## Preconditions
Collect observed tool sets from the same initialized session. Do not infer runtime capabilities from documentation alone.

## Required context
Configuration precedence, tool registry, provider tool schema, dispatch middleware, sandbox helpers, and execution mode.

## Allowed tools
Read-only configuration inspection, provider/request tracing, runtime capability introspection, unit/integration tests, and `scripts/tool_policy_gate.py`.

## Constraints
- Never broaden a restriction to keep a task working.
- Treat absent and explicit-empty policy states separately.
- Do not use prompt instructions as evidence of authorization enforcement.
- Do not execute destructive tools merely to prove exposure; introspection or safe canaries are preferred.

## Procedure
1. Record the policy source and whether each field was present.
2. Resolve configuration precedence without collapsing explicit-empty to missing.
3. Enumerate known tools after registration completes.
4. Capture provider-visible tools for the active mode.
5. Capture tools the dispatcher would authorize for the same agent/session.
6. Run `python scripts/tool_policy_gate.py snapshot.json --config config/policy.json`.
7. If blocked, identify the first layer where the effective set exceeds the normalized allowed set.
8. Repair policy parsing, intersection, mode routing, or fallback logic without weakening the declared policy.
9. Repeat the gate and run regression tests.
10. Hand verification to an independent reviewer for high-impact capability changes.

## Decision points
- Explicit allowlist present: effective tools MUST be a subset of it after deny rules.
- Explicit empty allowlist: effective tools MUST be empty under this package policy.
- Missing allowlist: use the documented configured default, then apply deny rules.
- Unknown policy/tool state: fail closed and escalate rather than restore capabilities.

## Expected output
Normalized allowed set, observed provider/runtime sets, violations, root-cause layer, remediation evidence, and verification status.

## Metrics
Policy violation count, forbidden visible tools, forbidden executable tools, mode parity, and percentage of required boundaries checked.

## Verification
The deterministic gate passes; explicit-empty and ignored-policy regression tests pass; high-impact tools excluded by policy are unavailable both in provider schema and dispatch path.

## Failure handling
Capture the unresolved state, block high-impact execution, retain evidence, and escalate to the policy/runtime owner. Maximum remediation attempts per defect: 2 before escalation.

## Stop conditions
Stop when the gate passes and independent verification succeeds, or when policy semantics cannot be resolved safely without product-owner/security-owner input.
