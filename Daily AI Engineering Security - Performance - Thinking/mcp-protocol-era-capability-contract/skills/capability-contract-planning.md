# Skill: Capability-Contract Planning

## Purpose
Convert an observed MCP connection into an explicit capability contract before a capability-dependent plan executes.

## Trigger
Use after connection/negotiation and before a plan invokes era-dependent MCP methods or semantics.

## Inputs
Negotiated version, observed protocol era, effective capabilities, negotiation mode, fallback/probe result, plan requirements.

## Preconditions
Connection attempt has completed or failed with classified evidence. Capability names are defined by the consuming host rather than inferred from prose.

## Required context
Server identity, transport, SDK version, session/connection identifier, observed version and capabilities.

## Allowed tools
MCP client introspection, structured logs, this package checker, read-only protocol documentation.

## Constraints
Do not infer legacy era from authentication/network failure. Do not mark a capability present merely because the client library implements it. Do not request hidden chain-of-thought.

## Procedure
1. Connect using the host's configured negotiation policy.
2. Record observed negotiated version and era after successful connection.
3. Materialize `effective_capabilities` from runtime evidence.
4. Require the planner to emit only capability names needed by executable steps.
5. Run `scripts/check_capability_contract.py`.
6. If pass, freeze the snapshot identifier for the execution phase.
7. If mismatch, update planning context with missing capabilities and permit one replan.
8. Re-run the gate. On a second mismatch, stop and escalate.
9. If the connection is renegotiated/reconnected, invalidate the old snapshot and repeat.

## Decision points
Connection failure: stop rather than fabricate capabilities. First mismatch: one replan. Snapshot drift: invalidate and revalidate. Second mismatch: stop.

## Expected output
Facts, assumptions explicitly marked, capability snapshot, plan requirements, gate verdict, verification status.

## Metrics
Mismatch count, unsupported calls prevented, replan success rate, stale-snapshot invalidations.

## Verification
Known legacy and modern fixtures produce the expected pass/fail results, and a reconnect cannot reuse an old snapshot without explicit rebinding.

## Failure handling
Preserve observed errors and snapshot evidence. Never broaden the capability set to make the plan pass.

## Stop conditions
Valid contract; second mismatch; connection evidence unavailable; or security/authorization failure.
