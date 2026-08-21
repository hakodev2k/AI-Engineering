# Workflow — Pre-Decline Discovery

## Trigger
Agent is about to decline, ask the user because a capability appears absent, or route around a missing/blocked capability.

## Goal
Prove whether a relevant deferred capability exists before making a terminal decision.

## Inputs
Task summary, planned decision, loaded tools, registry, prior discovery results.

## Baseline
Measure current false-capability-claim rate and user-prompt/workaround rate on a fixed evaluation set before enabling the gate.

## Stages
1. **Observe** — capture the planned terminal decision and observable reason.
2. **Match** — run `scripts/discovery_gate.py` against the compact registry.
3. **Discover** — when required, issue one targeted tool-discovery query.
4. **Record** — classify candidates as available, unavailable, failed, or irrelevant.
5. **Re-evaluate** — rerun the deterministic gate using new evidence.
6. **Review** — ambiguous outcomes go to `subagents/capability-verifier.md`.
7. **Act** — use a discovered capability through normal authorization, or permit the limitation claim with evidence.
8. **Verify** — capture decision coverage and outcome metrics.

## Responsible agent
Parent agent owns stages 1–5 and 7. Capability Verifier owns stage 6 when needed.

## Tools
Registry file, `scripts/discovery_gate.py`, environment ToolSearch/discovery, read-only tool metadata.

## Outputs
Gate result, discovery evidence, final capability decision, metrics event.

## Checkpoints
- Before discovery: matched capability IDs are explicit.
- After discovery: outcomes are recorded.
- Before terminal claim: gate status is `allow`, not unresolved `discover`.

## Metrics
Discovery coverage, acquisition rate, false limitation claims, unnecessary user prompts, latency, tokens, false-positive blocks.

## Retry policy
Maximum two discovery passes. A second pass requires a materially refined query or independent verifier request.

## Stop conditions
Stop when capability availability is proven, limitation is supported by completed bounded discovery, or discovery infrastructure is unreliable and the decision is escalated.

## Failure path
Registry/tool-discovery failure -> retry once -> independent review -> block unsupported terminal claim if still unknown.

## Verification
Run unit tests plus an A/B evaluation with equivalent loaded-tool and deferred-tool task arms.

## Definition of Done
The terminal decision has observable discovery evidence; loops are bounded; authorization remains separate; metrics are captured; no unsupported capability claim remains.