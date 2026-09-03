# Skill: Containment Threat Model

## Purpose
Turn intended agent isolation into observable security invariants.

## Trigger
Before a new agent/evaluation environment, tool class, network path, or privilege change.

## Inputs
Runtime architecture, tool inventory, identities, credentials, network paths, writable paths, sandbox model, monitoring topology.

## Preconditions
Architecture and effective deployment state are available; reviewer is independent of the implementing agent.

## Procedure
1. Enumerate trust boundaries: model/agent, host/orchestrator, tool adapters, subprocess sandbox, network proxy, credential store, monitor, audit sink, kill path.
2. Enumerate escape paths for network, filesystem, credentials, process creation, tool indirection, policy mutation, and fallback execution.
3. Convert each boundary into a deterministic attestation or event type.
4. Mark controls that are agent-writable or share the same privilege domain as insufficient for independent containment.
5. Define fail-closed behavior and emergency-stop ownership.
6. Produce fixtures for at least one allowed and one violating event per critical boundary.

## Decision points
If a boundary cannot be independently observed, do not claim it verified. If the monitor shares agent write privileges, escalate for architecture change.

## Expected output
Threat model, boundary table, required attestations, tripwire event classes, recovery owner.

## Metrics
Boundary coverage, fixture coverage, independently observed control percentage.

## Verification
Independent reviewer maps every critical escape path to an attestation or tripwire and confirms no agent-self-approval path.

## Failure handling
At most two architecture/preflight correction cycles. Confirmed security violations stop immediately.

## Stop conditions
Stop when all critical boundaries are covered or when an uncovered high-risk boundary requires human escalation.
