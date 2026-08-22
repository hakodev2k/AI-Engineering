# Research — Approval Request Correlation Guard

## Topic
Approval responses can become ambiguous or orphaned when multiple agent sessions, reconnects, interrupts, or remote clients share an approval control plane.

## Category
Security

## Problem
An approval UI may show a legitimate command but fail to prove that the response is bound to the exact session, turn, tool call, policy snapshot, and request instance that produced it. In concurrent or resumed agent environments this creates two dangerous classes: a response can be delivered to the wrong pending request, or an orphaned/stale request can remain active after the visible task has stopped.

## Why it matters now
Agent products increasingly support multiple simultaneous tasks, background execution, remote workspaces, reconnect/resume, and external approval clients. These features make request identity a security boundary rather than a UI detail.

## Affected users
Developers running multiple Codex/agent sessions, remote-workspace users, platform builders exposing approval APIs, external approval UI authors, and teams relying on human approval as a least-privilege boundary.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #30714 remains open and reports an interrupted Session A whose UI became stale while files continued changing; approvals made in Session B were temporally correlated with additional work associated with Session A. The reporter explicitly asks whether approvals are scoped to the exact session/task. Source: https://github.com/openai/codex/issues/30714
2. Codex issue #36392 documented three tasks stranded in `waitingOnApproval`: the approval card accepted interaction but no terminal resolution reached the pending request. Persisted rollouts ended with an in-progress file-change request and no matching result. The issue recommends rehydrating the exact approval after reconnect or cancelling orphaned requests after a bounded timeout. Source: https://github.com/openai/codex/issues/36392
3. Codex issue #21982 reports an approval/escalation visible in a transcript but not surfaced through app-server, leaving external clients unable to resolve it and the turn stalled until timeout. Source: https://github.com/openai/codex/issues/21982

### Interpretation
The reports do not prove a universal cross-session authorization vulnerability. They do show that approval identity, lifecycle, client rehydration, and terminal resolution are failure-prone boundaries. A robust integration should therefore make correlation explicit and fail closed when identity or lifecycle evidence is incomplete.

### Proposed solution
Represent every approval as a versioned correlation envelope containing `session_id`, `turn_id`, `request_id`, `tool_call_id`, normalized action digest, policy digest, creation epoch, expiry, and monotonic nonce. A response is accepted only when all binding fields match the live pending request and the request is still active. Reconnects rehydrate by request ID; cancellation/interrupt revokes pending envelopes. Duplicate or stale responses are idempotently rejected.

## Existing approaches
- UI-scoped approval prompts.
- Session-level "always allow" prefixes.
- App-server request IDs and pending-request replay.
- Client timeouts and task restart/reconnect.

## Remaining limitations
- Session-level grants can be broader than a single request.
- UI state can become stale while runtime state continues.
- Request replay without an action/policy digest does not prove semantic identity.
- Timeout alone does not guarantee revocation across every client.
- External approvers may race or reconnect with old pending state.

## Root-cause analysis
1. Approval is sometimes treated as presentation state rather than authorization state.
2. Identity fields are distributed across session, turn, tool, and UI layers.
3. Reconnect/resume creates multiple observers of one pending request.
4. Cancellation may stop the visible turn without revoking every outstanding authorization handle.
5. Broad "approve for session" caching can blur request-specific intent.

## Improvement opportunity
A small deterministic verifier can enforce request binding independently of model reasoning or UI correctness. This pattern is reusable across CLI, desktop, MCP hosts, CI agents, and remote approval services.

## Goal
Ensure an approval response can authorize only the exact live request that the user reviewed.

## Metrics
- mismatched-response rejection rate;
- stale/orphan response rejection rate;
- pending approvals surviving cancel/interrupt;
- approval requests without complete correlation fields;
- duplicate response idempotency failures;
- reconnect rehydration success rate;
- false authorization rate in cross-session tests (target 0).

## Trigger
Approval creation, response receipt, reconnect/resume, session interruption, policy change, or pending-request timeout.

## Inputs
Live request envelope, response envelope, current session/turn identity, action digest, policy digest, request lifecycle state, and current timestamp.

## Outputs
`accept`, `reject-mismatch`, `reject-stale`, `reject-revoked`, `reject-duplicate`, or `review` plus machine-readable evidence.

## Status
**Implemented:** correlation contract, deterministic verifier, rules, workflow, hook, tests, reviewer guidance.

**Measured:** after adopters capture approval lifecycle telemetry.

**Verified:** only when cross-session, reconnect, cancel, duplicate, and policy-change tests prove that no mismatched response is accepted.
