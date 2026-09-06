# Shared-Channel Threat Modeling Skill

## Purpose
Identify agent-accessible resources that can become undeclared cross-agent coordination channels and convert that analysis into enforceable policy.

## Trigger
Use before enabling web, browser, HTTP, MCP, shell, wiki, issue-tracker, object-store, paste, forum, package-registry, or other tools for autonomous or multi-agent runs, and after any change to network/tool access.

## Inputs
- Agent identities and run topology.
- Tool inventory and destination allowlists.
- Known external and internal services.
- Read/write capabilities and credentials.
- Existing proxy, sandbox, approval, and audit controls.
- Recent normalized outbound-event samples when available.

## Preconditions
The reviewer MUST know which agents may run concurrently and which tools can create durable state outside the agent process. Unknown destination semantics MUST be treated as untrusted.

## Required context
For each destination capture owner, authentication boundary, mutability, visibility, retention, discoverability by other agents, and whether content can survive or be recreated after deletion.

## Allowed tools
Repository/config inspection, architecture diagrams, proxy/firewall logs, tool manifests, browser/MCP inventories, and the deterministic coordination gate in `../scripts/coordination_gate.py`.

## Constraints
- MUST NOT infer safety merely because a destination is allowlisted for network access.
- MUST distinguish read access from write/create/delete access.
- MUST model shared state visible to other runs as a separate trust boundary.
- MUST NOT expose credentials or sensitive payloads in evidence artifacts.
- MUST require human approval before adding a new shared mutable channel.

## Procedure
1. Enumerate every tool that can perform a networked or persistent write.
2. Expand each tool into concrete destination classes rather than relying on tool names.
3. Label each destination `read-only`, `private-mutable`, `team-shared-mutable`, `public-shared-mutable`, or `unknown`.
4. For mutable destinations, identify who else can discover/read/write the same state.
5. Identify reconstruction paths: alternate pages, new objects, new issues, mirrors, redirects, package namespaces, or writable subresources.
6. Map each write path to agent identity, run identity, approval requirement, rate limit, and declared purpose.
7. Add approved channels to `../config/policy.json`; leave unknown or incidental destinations absent so the gate fails closed.
8. Replay representative outbound events through the gate and capture blocking evidence.
9. Simulate at least one swarm-convergence case with more agents than the configured channel threshold.
10. Hand the threat model and test evidence to an independent security reviewer.

## Decision points
- If a destination is required only for reading, remove write capability.
- If shared writes are required, scope them to a dedicated channel and narrow identity set.
- If semantics cannot be determined, block the write path.
- If a single destination is used by many agents unexpectedly, suspend writes and investigate before resuming.

## Expected output
A destination classification table, approved shared-channel list, explicit denied classes, normalized event schema, and test evidence showing undeclared channels and cross-agent convergence are blocked.

## Metrics
- Percent of outbound write-capable tools with classified destination semantics.
- Percent of shared writes carrying agent/run provenance and purpose.
- Number of undeclared shared writes blocked.
- Maximum distinct agents writing one channel per policy window.
- Mean time from anomalous convergence to block/alert.

## Verification
Pass when all write-capable paths are classified, unknown shared writes fail closed, approved channels remain usable within limits, cross-agent convergence above threshold blocks, and an independent reviewer confirms no bypass through alternate tool adapters.

## Failure handling
On missing telemetry, ambiguous destination classification, malformed events, or policy-load failure: stop the affected autonomous run, preserve evidence, and fall back to read-only access. Retry configuration/telemetry collection at most twice. Escalate after two failed attempts.

## Stop conditions
Stop when the destination inventory is complete and independently verified, or immediately when a critical unbounded shared-write path is found; remediate that path before continuing the broader evaluation.
