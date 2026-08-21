# Research — Approval Arbitration Guard

## Topic
External approval hooks can serialize or steal human approval decisions unless the control plane exposes reviewer identity, defer semantics, cancellation, and bounded timeouts.

## Category
Security

## Problem
Approval is a security boundary. If a `PermissionRequest` hook runs before the native approval path and waits on a remote approver, a local user can be unable to answer. Conversely, an external approval UI can intercept requests that native auto-review or guardian logic should handle. The result is either denial-of-service on the approval path or incorrect reviewer routing.

## Why it matters now
OpenAI Codex issue #39447 (2026-08-19) documents that `PermissionRequest` hooks are awaited before the native prompt; a long-lived hook can leave the terminal user with no actionable prompt. Issue #23465 independently documents that hook consumers cannot reliably see the effective reviewer or explicitly defer to the native path, creating duplicate/preemptive approval UIs.

## Affected users
Developers using Codex hooks, teams building mobile/remote approval UIs, platform engineers integrating MCP/tool approvals, and security teams enforcing human approval for privileged actions.

## Current public evidence
### Observed evidence
1. `openai/codex#39447`: hook execution is serial with the native approval path; remote-human hooks must choose between short timeouts that rarely work and long timeouts that lock out the local user. Source: https://github.com/openai/codex/issues/39447
2. `openai/codex#23465`: external approval consumers cannot reliably determine the effective reviewer (`user`, `auto_review`, guardian-like paths) or explicitly defer, so they can steal or duplicate approvals. Source: https://github.com/openai/codex/issues/23465
3. The app-server already demonstrates a first-answer-wins request model according to #39447, showing that concurrent arbitration is feasible but not available through the declarative hook contract.

### Interpretation
The missing primitive is not “another approval rule”; it is a control-plane arbitration contract. Reviewer routing, decision ownership, timeout, cancellation, and terminal outcome need explicit states. Without them, security depends on implicit hook timing.

### Proposed solution
A reusable guard that validates each approval request against an explicit arbitration policy before an external approver is allowed to block or decide. It supports `observe`, `defer`, `claim`, `allow`, `deny`, and `cancelled` states; requires bounded leases for claimed requests; prevents duplicate final decisions; and blocks external interception when reviewer identity is unknown unless policy explicitly allows it.

## Existing approaches
- Blocking `PermissionRequest` hooks.
- Native user prompt / auto-review path.
- App-server external approval integrations.
- Ad-hoc timeouts and external approval daemons.

## Remaining limitations
- Hook contracts may not expose every reviewer field today.
- Concurrency semantics differ across clients.
- External approval systems can become unavailable or deliver late decisions.
- A first-answer-wins model still needs idempotency and cancellation to avoid stale approvals.

## Root causes
1. Approval ownership is implicit.
2. Hook execution order doubles as routing policy.
3. Missing explicit defer/no-decision state.
4. Missing bounded claim lease and cancellation acknowledgement.
5. Duplicate or late decisions are not always rejected deterministically.

## Goal
Preserve least privilege and human control while allowing external approval integrations without blocking the native path indefinitely or stealing requests from the intended reviewer.

## Metrics
- approval latency p50/p95;
- requests blocked by expired external leases;
- duplicate/late decisions rejected;
- requests correctly deferred to native reviewer;
- local-user lockout duration;
- reviewer-routing mismatches;
- percentage of privileged actions with exactly one terminal approval decision.

## Trigger
Before dispatching any privileged tool/MCP/shell/network request to an external approval hook or approval daemon.

## Inputs
Request ID, action class, risk level, effective reviewer if known, source, external approver availability, lease duration, current request state.

## Outputs
`observe`, `defer`, `claim`, `allow`, `deny`, or `reject-late` plus decision owner, expiry, reason, and audit fields.

## Status
**Implemented:** policy, deterministic state validator, workflow, hook, tests, verifier instructions.

**Measured:** after integration captures routing/latency telemetry.

**Verified:** only after deterministic tests plus a real approval-path exercise prove no request can have two terminal decisions and an unavailable external approver cannot indefinitely suppress native approval.
