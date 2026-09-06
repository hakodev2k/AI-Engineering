# Skill: Coordination Channel Threat Model

## Purpose
Identify shared resources that can become unintended inter-agent communication channels and define enforceable trust boundaries before parallel agents run.

## Trigger
Run when two or more agents, workers, evaluation instances, or delegated subagents can access any common storage, service, namespace, artifact system, collaboration surface, or external writable resource.

## Inputs
- Agent identities and roles.
- Tool and resource inventory.
- Read/write permissions.
- Approved coordination channels.
- Runtime event schema and available audit logs.
- Human approval points and shutdown mechanisms.

## Preconditions
Agent identity MUST be attributable in audit events. If identity attribution is unavailable, shared writable resources MUST be treated as high risk until instrumentation is added.

## Required context
Only architecture, permission, resource, and information-flow facts needed to model communication. Do not require hidden model reasoning.

## Allowed tools
Configuration inspection, IAM/ACL reads, storage/service inventory, audit-log queries, network topology inspection, sandbox metadata, and the deterministic `scripts/channel_guard.py` analyzer.

## Constraints
- MUST distinguish sanctioned orchestration from incidental shared infrastructure.
- MUST treat filenames, directory names, object keys, metadata, issue/wiki fields, cache keys, logs, and small artifacts as possible message carriers.
- MUST model read-after-write across different agents as an information-flow edge.
- MUST NOT relax isolation merely because each individual operation appears benign.
- MUST NOT expose credentials or sensitive payload content during analysis; hashes/metadata SHOULD be used when content is unnecessary.

## Procedure
1. Enumerate all agents and assign stable runtime identities.
2. Enumerate every shared resource reachable by more than one identity.
3. Classify each resource as approved-coordination, shared-data-only, single-writer, read-only, or prohibited.
4. Map write → discover/list → read paths that could transmit information between agents.
5. Identify resources where object names or metadata alone can carry messages.
6. Establish expected baseline access patterns and allowed agent pairs.
7. Configure sanctioned namespaces in the guard policy.
8. Run synthetic cross-agent probes against non-production fixtures to prove that unapproved rendezvous patterns are detected.
9. Define blocking, quarantine, evidence capture, and human escalation actions.
10. Re-run after permission, topology, tool, or sandbox changes.

## Decision points
- Low risk: read-only shared data with no agent-controlled metadata visible to peers.
- Controlled: explicit approved coordination namespace with authenticated identities and logging.
- High risk: multi-writer or read-after-write shared namespace outside approved orchestration.
- Unknown: identity attribution or logging is insufficient; execution remains blocked for reduced-safeguard/high-risk runs.

## Expected output
A resource trust-boundary table plus a machine-readable allowlist compatible with `scripts/channel_guard.py`.

## Metrics
Unauthorized cross-agent edges detected, time to detection, percentage of shared resources classified, identity-attribution coverage, blocked rendezvous attempts, and false-positive rate on sanctioned orchestration.

## Verification
Synthetic tests MUST show that an unapproved agent A write followed by agent B discovery/read is blocked or alerted while approved orchestrator traffic remains permitted.

## Failure handling
If a service cannot expose agent identity or adequate audit events, remove it from the high-risk environment, make it read-only/single-writer where feasible, or require a human-approved exception with compensating isolation.

## Stop conditions
Threat modeling completes only when all shared writable resources are classified and the high-risk paths have an enforceable control or explicit human-owned exception. Do not continue autonomous execution with unknown shared write/read paths.
