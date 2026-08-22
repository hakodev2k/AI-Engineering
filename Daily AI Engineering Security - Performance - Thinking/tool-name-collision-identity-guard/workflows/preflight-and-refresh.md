# Workflow — Preflight and Refresh

## Trigger
Initial tool discovery or any effective tool-set change.

## Goal
Expose only a collision-free tool set whose model, dispatch, approval, and audit identities agree.

## Inputs
Tool inventory, previous identity map, policy.

## Baseline
Record initial collision count, exposed-name count, and approval-binding coverage before remediation.

## Stages
1. **Observe** — collect the complete effective tool set and generation.
2. **Measure baseline** — run `scripts/validate_tool_identities.py` without rewriting.
3. **Diagnose** — classify public-name collision, canonical-identity collision, approval mismatch, or unstable rename.
4. **Form hypothesis** — determine whether deterministic namespacing resolves the collision without changing callable identity.
5. **Implement improvement** — build the proposed model-visible map.
6. **Measure again** — rerun validation.
7. **Independent verification** — Tool Identity Reviewer checks mapping and negative fixtures.
8. **Publish** — expose refreshed tools only after verification.

## Responsible agent
Runtime/tool registry owner implements; Tool Identity Reviewer verifies.

## Tools
Validator script and host-native tool discovery.

## Outputs
Verified identity map, collision report, generation id, metrics.

## Checkpoints
Before model exposure; after each `tools/list_changed`; before approval persistence.

## Metrics
Unresolved collisions=0, ambiguous dispatches=0, approval coverage=100%, deterministic-map stability=100% on unchanged inventories.

## Retry policy
At most 2 rebuild attempts for a single generation. A retry must change the namespacing/identity hypothesis.

## Stop conditions
Stop success only when all invariants pass. Stop failure after 2 unsuccessful rebuilds or immediately on canonical identity corruption.

## Failure path
Keep new generation unavailable, preserve unrelated running calls on their pinned prior map, escalate with collision report.

## Verification
Run positive, duplicate-name, cross-server, duplicate-canonical-id, and refresh fixtures.

## Definition of Done
Implemented, measured, and independently verified with zero unresolved collisions and no weakened approval boundary.
