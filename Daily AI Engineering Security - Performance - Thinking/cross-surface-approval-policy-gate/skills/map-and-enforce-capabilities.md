# Skill: Map and Enforce Cross-Surface Capabilities

## Purpose
Normalize high-impact actions from heterogeneous tool surfaces into a common capability model and enforce one approval policy immediately before side effects.

## Trigger
Use when agents can perform equivalent actions through terminal, file APIs, MCP, nested agents, plugins, or custom tools.

## Inputs
Tool request, arguments, actor/session, delegation chain, tool metadata, capability mapping, approval evidence, policy.

## Preconditions
All executable tool adapters must expose a pre-side-effect interception point. High-impact capability mappings must be reviewable.

## Required context
Requested effect, target class, identity, provenance, delegation origin, approval status, argument hash, and whether the operation is read-only or mutating.

## Allowed tools
Repository inspection, policy/config readers, deterministic validation scripts, test harnesses, audit logs.

## Constraints
- MUST evaluate normalized capability rather than trusting tool name alone.
- MUST fail closed for unknown high-impact capabilities.
- MUST NOT inherit approval merely because a parent agent or adjacent tool was approved.
- MUST bind approval to capability, target, actor/session, and argument hash.
- MUST preserve the stricter rule when multiple surfaces map to the same effect.

## Procedure
1. Inventory all execution surfaces and map each operation to a normalized capability.
2. Identify equivalent effects reachable through different tools.
3. Classify impact and target sensitivity.
4. Run `scripts/policy_gate.py` on representative requests.
5. Add approval requirements for high-impact capabilities and explicit allow rules only for safe reads.
6. Propagate delegation provenance through nested agents/tools.
7. Execute cross-surface bypass fixtures.
8. Independently review denied/approval-required/allowed decisions.

## Decision points
- Unknown capability + high impact: deny.
- Known high-impact capability without bound approval: approval required.
- Approval argument hash mismatch: deny and require fresh approval.
- Delegated request without provenance when required: deny.
- Safe read explicitly allowlisted: allow and audit according to policy.

## Expected output
Capability map, policy decision, approval binding, audit evidence, failing fixtures, and verification status.

## Metrics
Cross-surface consistency rate, uncovered high-impact surfaces, approval bypass fixture pass rate, audited high-impact rate.

## Verification
Equivalent high-impact fixtures across different surfaces must produce the same decision and required approval scope.

## Failure handling
Do not auto-relax policy. Correct mappings or integration points, rerun once, then escalate unresolved gaps.

## Stop conditions
Any unexplained allow for a high-impact fixture; missing interception point; missing provenance required by policy; or one failed recovery attempt.
