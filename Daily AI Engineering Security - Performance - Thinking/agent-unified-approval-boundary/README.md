# Agent Unified Approval Boundary

## Topic
Transport-independent authorization for side-effecting AI-agent tool calls.

## Category
Security.

## Problem
AI-agent approval controls are frequently attached to individual adapters such as terminal execution, MCP, browser automation, deployment tools, remote shells or delegated subagents. When equivalent capabilities travel through different routes, security behavior can diverge: one route may bypass the approval gate, while another can emit an approval request that nobody can answer and hang indefinitely.

## Evidence
Current public signals are documented in `evidence/research.md`. They include a Hermes Agent issue where MCP-wrapped subprocesses bypass a terminal-only approval implementation, a Codex issue where delegated MCP approvals wedge because the approval request has no responder, and a Claude Code issue showing approval-state disagreement across MCP/client layers. MCP guidance also states that tool annotations are hints rather than enforcement.

## Existing approach
Typical systems combine adapter-local permission checks, allow/deny lists, MCP annotations, interactive confirmation prompts and sandbox restrictions.

## Existing limitations
Adapter-local checks create route-specific policy. Tool annotations are untrusted metadata, interactive prompts do not automatically work in delegated/non-interactive flows, and approval state can be lost or over-broadened between actors and transports. Logging cannot prevent an effect once dispatch has occurred.

## Proposed improvement
Use one Unified Approval Boundary (UAB) immediately before every real effector. Each adapter converts its request into the same canonical form:

`actor + parent task + capability + target + canonical arguments`

The boundary classifies risk, evaluates deterministic policy, validates a narrowly scoped approval token if required, emits an audit decision, and only then allows dispatch. Unknown routes fail closed. Transport names and untrusted annotations cannot make an operation safer.

## Architecture

```text
Model / Parent Agent / Subagent
          |
          v
 Tool Adapter (terminal | MCP | browser | deploy | remote)
          |
          v
 Canonical Operation
          |
          v
+---------------------------+
| Unified Approval Boundary |
| classify -> policy        |
| token -> audit -> decision|
+---------------------------+
   | DENY       | REQUIRE_APPROVAL
   |            v
   |      Answerable human/guardian
   |            |
   |       scoped token
   |            |
   +--------> re-evaluate
                |
              ALLOW
                |
                v
             Effector
```

The approval layer belongs to the host/harness, not the LLM. Sandboxing remains defense in depth after authorization.

## Package structure

```text
agent-unified-approval-boundary/
├── README.md
├── guide-intergration.md
├── evidence/
│   └── research.md
├── config/
│   ├── policy.json
│   └── adapter-registry.example.json
├── examples/
│   └── request.example.json
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── approval_boundary.py
├── tests/
│   └── test_approval_boundary.py
└── verification/
    └── verification.md
```

## Installation
Requires Python 3.9+ and no third-party packages for the reference implementation.

```bash
cd agent-unified-approval-boundary
python scripts/approval_boundary.py inventory --registry config/adapter-registry.example.json
python scripts/approval_boundary.py decide --policy config/policy.json --request examples/request.example.json
python -m unittest tests/test_approval_boundary.py
```

## Configuration
`config/policy.json` contains conservative defaults:
- default decision = deny,
- finite approval timeout,
- high-risk classes require approval,
- unknown class denies,
- scoped approval token fields are explicit.

`config/adapter-registry.example.json` demonstrates how adapter-specific routes map onto transport-independent capabilities.

The reference script contains a development-only HMAC key so tests are self-contained. A production integration MUST replace it with protected runtime signing material or a dedicated capability-token service. Never commit production signing keys.

## Usage
### Inventory coverage

```bash
python scripts/approval_boundary.py inventory --registry config/adapter-registry.example.json
```

A side-effecting adapter without `mediated: true` returns a non-zero process status.

### Make a decision

```bash
python scripts/approval_boundary.py decide --policy config/policy.json --request examples/request.example.json
```

Expected for the destructive example: `REQUIRE_APPROVAL`.

### Mint a scoped approval token

```bash
python scripts/approval_boundary.py token --request examples/request.example.json --ttl 300
```

Attach the returned token as `approval_token` to the unchanged request and call `decide` again. Any change to actor, parent task, capability, target or canonical arguments invalidates reuse.

## Workflow
The primary rollout workflow is:

**Observe → Map capabilities → Identify route gaps → Insert UAB → Test with fake effectors → Measure → Independently verify → Release or block.**

Runtime execution is:

**Canonicalize → Classify → Policy → Approval if required → Re-evaluate → Audit → Dispatch exactly once.**

All retry loops are bounded; an unavailable responder is not treated as approval.

## Metrics
Track at minimum:
- percentage of side-effecting routes mediated by UAB,
- bypass count in fake-effector tests,
- route-equivalence decision rate,
- approval request / deny / timeout counts,
- p50 and p95 approval latency,
- stale or mismatched token rejection rate,
- audit coverage,
- unknown enabled route count.

Target release values: 100% mediation, zero bypasses, zero unknown enabled routes, zero unbounded approval waits, and 100% audit coverage for boundary decisions.

## Verification
`tests/test_approval_boundary.py` checks route equivalence, unknown fail-closed behavior, missing identity, lying/untrusted annotations, exact approval reuse, argument mutation, target mutation, expiry, read-only allow and production approval requirements.

`verification/verification.md` separates Implemented, Measured and Verified claims and lists the additional evidence required before claiming production verification.

## Safety
- Never weaken authorization because a call is routed through MCP, Docker, SSH, code execution or a subagent.
- Treat MCP annotations as hints unless their source is independently trusted; even then, deterministic host policy remains authoritative.
- Require explicit human approval for dangerous irreversible or production operations.
- Do not wait indefinitely for approval.
- Do not log raw secrets or sensitive arguments.
- Fail closed on policy, identity, token or boundary errors.

## Failure handling
Detection includes uncovered routes, boundary exceptions, token mismatch, responder absence, timeout and audit gaps. Preserve redacted evidence and stop dispatch. Retry implementation fixes at most twice; retry approval-channel delivery once. Fallback is disabling the mutable adapter or restoring the previous stricter gate, never bypassing the boundary. Escalate unresolved bypasses to the security/release owner.

## Definition of Done
- Current evidence and existing approaches documented.
- Capability vocabulary and adapter inventory complete.
- All side-effecting adapters are mediated before dispatch.
- Unknown routes deny or remain disabled.
- Route-equivalence tests pass.
- Fake-effector unauthorized side effects = 0.
- Approval waits are bounded.
- Token mutation and expiry tests pass.
- Audit coverage is complete.
- Independent verifier approves the high-risk change.
- Risks, rollback and production signing-key requirements are documented.
- No blocking issue remains.

## Customization
Extend the capability vocabulary rather than adding transport-specific security rules. Organizations can add risk tiers, environment sensitivity, resource ownership, data classification, network zones, rate limits and multi-party approval, but the core invariant should remain unchanged: **no side-effecting effector is reachable without a deterministic decision at one mandatory host-side boundary.**
