# Workflow: Inventory → Enforce → Verify

## Trigger
New tool surface, MCP server, nested agent, filesystem/process capability, or reported approval inconsistency.

## Goal
Ensure equivalent high-impact effects receive one consistent approval/authorization decision regardless of invocation route.

## Inputs
Tool registry, adapters, capability mappings, policy, delegation metadata, attack/bypass fixtures.

## Baseline
Inventory every surface and record existing decision for equivalent test actions.

## Stages
1. **Observe** — enumerate terminal, file, MCP, nested-agent, and custom surfaces.
2. **Measure baseline** — execute non-destructive policy fixtures and record inconsistencies.
3. **Diagnose** — identify missing mappings, local-only guards, or lost delegation provenance.
4. **Form hypothesis** — define the smallest central capability mapping/integration change.
5. **Implement** — route the surface through the central gate without changing unrelated permissions.
6. **Measure again** — rerun the same cross-surface fixtures.
7. **Verify** — independent review confirms high-impact equivalence, approval binding, and audit coverage.

## Checkpoints
- No real destructive action is used for validation.
- Unknown high-impact fixture denies by default.
- Argument-change fixture invalidates old approval.
- Delegated action retains provenance.
- Equivalent capabilities give equivalent decisions.

## Metrics
Uncovered high-impact surface count, consistency rate, bypass fixture pass rate, audit coverage.

## Retry policy
One recovery attempt for mapping/integration defects. No automatic retry for a policy bypass.

## Failure path
Block the affected capability/surface, retain evidence, and require security review. Never weaken another surface to make decisions consistent.

## Stop conditions
Any high-impact bypass remains, interception is impossible, provenance is unavailable where required, or retry budget is exhausted.

## Definition of Done
Capability inventory complete; mappings documented; policy gate integrated; cross-surface tests pass; approvals bind to exact request; high-impact actions are auditable; no bypass fixture remains.
