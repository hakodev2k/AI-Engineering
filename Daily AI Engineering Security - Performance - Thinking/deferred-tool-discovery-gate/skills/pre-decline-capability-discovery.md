# Skill — Pre-Decline Capability Discovery

## Purpose
Prevent an agent from making a terminal capability claim or workaround before checking whether a relevant deferred tool exists.

## Trigger
Use immediately before any of these decisions:
- claim that required information/capability is unavailable;
- ask the user for information because no local capability appears available;
- invent a workaround for an operation blocked by missing capability/permission;
- fall back to a weaker/manual path because a tool appears absent.

## Inputs
- task/goal summary;
- intended decision class (`decline`, `ask-user`, `workaround`, `fallback`);
- loaded tool names/capabilities;
- compact deferred-capability registry;
- discovery attempts already performed in the current decision epoch;
- optional session/compaction epoch.

## Preconditions
- Registry is available and represents only capabilities the environment can potentially expose.
- Registry entries contain stable capability IDs, short intent tags, and discovery queries; they do not need full schemas.
- Discovery tool itself is allowed for the task.

## Required context
Facts necessary to distinguish a true capability gap from a merely deferred capability. Do not request hidden chain-of-thought.

## Allowed tools
Capability-registry lookup, ToolSearch/tool discovery, read-only environment inspection, and the deterministic script in `scripts/discovery_gate.py`.

## Constraints
- MUST NOT execute a newly discovered high-impact tool merely because it exists.
- MUST preserve normal authorization/approval checks after discovery.
- MUST perform at most two discovery passes for one decision unless new evidence materially changes the query.
- MUST NOT eagerly load every tool schema as a workaround.

## Procedure
1. Classify the pending decision.
2. Run the gate against task text, loaded tools, prior discovery evidence, and registry.
3. If result is `allow`, record why discovery is not required and continue.
4. If result is `discover`, run one targeted discovery query using the matched capability IDs/tags.
5. Record each candidate as `available`, `unavailable`, `failed`, or `not-relevant`.
6. If a relevant capability becomes available, return to the normal tool-use/authorization flow.
7. If no relevant capability is available, rerun the gate with discovery evidence.
8. If the second result is `review`, hand off to `subagents/capability-verifier.md`.
9. Stop after two passes or a verified capability outcome.

## Decision points
- Relevant deferred capability matched but never searched -> `discover`.
- Relevant capability searched and unavailable/failed with sufficient evidence -> `allow` terminal decision, but preserve the failure evidence.
- Ambiguous registry match or conflicting discovery result -> `review`.
- Relevant tool is loaded already -> do not search solely because it is deferred elsewhere; use normal feasibility/permission checks.

## Expected output
A compact decision record:
```json
{
  "decision": "allow|discover|review",
  "matched_capabilities": ["capability-id"],
  "discovery_attempts": 0,
  "evidence": ["..."],
  "reason": "..."
}
```

## Metrics
Discovery coverage, capability acquisition rate, prevented false limitation claims, unnecessary user prompts, false-positive blocks, additional latency/tokens.

## Verification
Run the unit tests and an A/B task battery where one arm has the required tool already loaded and the other exposes it only through discovery.

## Failure handling
If registry lookup fails, do not claim the capability does not exist. Retry deterministic lookup once; then mark discovery status unknown and require review before a terminal capability claim.

## Stop conditions
Stop when a relevant capability is confirmed and handed to normal execution, or when two bounded discovery passes plus verification establish that no usable capability is available.