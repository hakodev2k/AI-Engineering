# Multi-Agent Trust Boundaries

## Purpose
Secure systems in which multiple agents delegate tasks, exchange messages, share memory, or invoke one another's tools.

## When to use
Use for supervisor-worker architectures, agent swarms, specialist agents, delegated subagents, or cross-service agent coordination.

## Inputs
Agent topology, message flows, identities, tool access, memory scopes, delegation rules, and tenant boundaries.

## Preconditions
Define each agent's authority independently; do not assume peer agents are equally trusted.

## Context to inspect
Inter-agent protocols, task queues, shared stores, tool brokers, credentials, message schemas, routing, and orchestration logic.

## Core knowledge
Delegation can amplify privilege. A low-privilege agent must not gain higher privilege merely by asking another agent to act. Inter-agent content remains untrusted unless authenticated and authorized for a specific purpose.

## Procedure
1. Inventory agents, identities, capabilities, and trust levels.
2. Map every delegation and message path.
3. Authenticate agent-to-agent communication.
4. Authorize delegated actions against the initiating principal and target capability.
5. Propagate provenance through multi-hop workflows.
6. Scope shared memory by tenant, task, and need-to-know.
7. Prevent workers from modifying orchestration policy.
8. Constrain delegation depth, fan-out, and resource budgets.
9. Detect cycles and runaway task creation.
10. Log delegation chains and tool effects.
11. Test privilege escalation through confused-deputy requests.
12. Test compromised-agent scenarios and containment.

## Decision points
Use central policy enforcement when many agents share tools; use local enforcement only when equivalent guarantees are maintained. Avoid shared credentials across agents with different privileges.

## Common failure patterns
Trusting internal agent messages implicitly, losing initiating-user context, shared global memory, unlimited delegation, and privilege inheritance from supervisor accounts.

## Verification
Demonstrate a lower-privilege agent cannot induce a higher-privilege peer to perform unauthorized actions and that audit logs reconstruct the full delegation chain.

## Expected output
A multi-agent trust model, delegation policy, provenance design, and privilege-escalation tests.

## Stop conditions
Escalate when the orchestration layer cannot preserve caller identity or enforce privilege boundaries across delegation.