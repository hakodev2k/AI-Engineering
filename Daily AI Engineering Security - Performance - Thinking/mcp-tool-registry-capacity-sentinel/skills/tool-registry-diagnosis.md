# Skill: Tool Registry Diagnosis

## Purpose
Determine whether an agent's observed MCP capabilities match what servers advertise and what the current task requires.

## Trigger
Missing tool error; large connector catalog; connector refresh; scheduled automation; client upgrade; intermittent tool disappearance; newly added MCP servers.

## Inputs
`tools/list` inventories, client-visible registry, required tool names, connector health, permissions, tool-search/deferred-loading state, documented platform limits.

## Preconditions
Use read-only discovery. Do not enable or execute dangerous tools merely to satisfy coverage.

## Required context
Task acceptance criteria and exact tools/capabilities needed to meet them.

## Allowed tools
MCP `tools/list`, client registry inspection, logs, safe no-op/read probes, `tool_registry_sentinel.py`.

## Constraints
No hidden-chain-of-thought collection. No permission widening. No destructive probes.

## Procedure
1. Decompose the task into observable required capabilities.
2. Capture server-advertised tools for each connector.
3. Capture the client/model-visible registry at the same time.
4. Normalize names and run the sentinel.
5. Record Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
6. If required tools are missing, classify likely cause: capacity truncation, permission/filter, deferred loading, connector drift, or server enumeration.
7. Test one hypothesis at a time with a bounded recovery action.
8. Re-capture inventories and compare fingerprint/counts.
9. Perform safe probe of restored required tools where possible.
10. Hand evidence to Capability Verifier.

## Decision points
- Required coverage <100%: do not execute task.
- Advertised > visible with stable cutoff: investigate capacity/filtering.
- Connector healthy but required tools absent: capability state is degraded regardless of transport state.
- Tool becomes visible only after explicit search/load: record deferred-loading prerequisite.

## Expected output
Capability contract, inventory delta, root-cause classification, recovery evidence, final PASS/BLOCK.

## Metrics
Required coverage, retention ratio, count delta, fingerprint drift, recovery attempts, diagnosis latency.

## Verification
Required tools are both registered and safe-probed; an independent verifier reviews the evidence.

## Failure handling
Maximum 2 recovery attempts. Preserve a BLOCK state when evidence is incomplete.

## Stop conditions
Stop after two unsuccessful recovery attempts, on policy/permission conflicts, or when required capability cannot be safely verified.