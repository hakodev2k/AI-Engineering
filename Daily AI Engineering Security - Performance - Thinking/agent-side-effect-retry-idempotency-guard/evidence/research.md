# Research — Agent Side-Effect Retry Idempotency Guard

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Security

## Problem

Agent runtimes regularly retry tool calls after timeouts, dropped responses, provider fallbacks, transport reconnects, or ambiguous execution failures. For read-only operations this is usually tolerable. For state-changing operations—creating issues, sending messages, charging accounts, writing files, deploying, spawning agents, approving changes—the runtime may not know whether the first request never arrived or arrived, executed, and only its response was lost.

A blind retry can therefore execute the same logical side effect twice.

This package focuses on the **ambiguous-outcome retry boundary**. It is intentionally distinct from generic retry-loop protection: a bounded retry policy can still duplicate a destructive action on the very first retry.

## Why it matters now

The MCP ecosystem moved to a stateless core in the 2026-07-28 specification, which improves routing and scalability but makes request-level correctness contracts even more important. As of 2026-08-20, a general request-idempotency mechanism for `tools/call` is still being proposed rather than universally available.

Multiple current signals show the gap is not theoretical:

- MCP SEP-3182, opened 2026-08-01, proposes an optional `idempotencyKey` specifically because MCP cannot currently distinguish a safe retry from a request whose side effect already executed but whose response was lost.
- The SEP reference implementation demonstrates an unguarded lost-response retry double-executing a side effect, while a guarded retry is deduplicated.
- Claude Code issue #85402 (opened 2026-08-09) reports a refusal/fallback retry re-dispatching already-executed background Agent calls, producing duplicate subagents—including code-writing agents sharing one worktree.
- Hermes Agent issue #57767 (opened 2026-07-03) reports that `delegate_task` has no idempotency key protecting duplicate child-agent spawns when the same logical call is dispatched more than once.
- GitHub Agentic Workflows' MCP Scripts specification explicitly warns that retries of state-changing tools require idempotency safeguards or explicit side-effect checks and mandates bounded retry behavior.

## Current public signals

### Signal 1 — MCP request idempotency is an active standards gap

SEP-3182 proposes a standard `idempotencyKey` on `tools/call`, capability negotiation, duplicate-result replay, conflict detection when one key is reused with different arguments, and explicit handling for concurrent duplicates.

Observed limitation: the proposal is still open, so hosts cannot assume ecosystem-wide support. The proposal also notes SDK/framework preservation concerns and deliberately excludes some MRTR continuation semantics from its current scope.

Sources:
- https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3182
- https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3182/files

### Signal 2 — fallback retry can duplicate already-executed agent dispatches

Claude Code issue #85402 reports that when a turn containing background `Agent` dispatches is interrupted by a model-refusal fallback, already-spawned agents can remain alive while the retried turn loses visibility into those side effects and dispatches replacements.

Source:
- https://github.com/anthropics/claude-code/issues/85402

### Signal 3 — delegation APIs can lack duplicate-dispatch protection

Hermes Agent issue #57767 documents that `delegate_task` does not thread an idempotency key through its dispatch path, leaving no protection if the same logical invocation is driven twice.

Source:
- https://github.com/NousResearch/hermes-agent/issues/57767

### Signal 4 — current workflow specifications recommend explicit idempotency safeguards

GitHub Agentic Workflows' MCP Scripts specification states that callers retrying state-changing invocations should use stable idempotency keys or perform side-effect checks before re-execution. It also requires retry budgets and fresh invocation attempts rather than carrying partially initialized state forward.

Source:
- https://github.github.com/gh-aw/specs/mcp-scripts-specification/

### Signal 5 — MCP 2026-07-28 is stateless at the protocol core

The MCP 2026-07-28 release removes session-level protocol state and makes each request self-describing. This improves horizontal scalability but does not itself provide exactly-once side-effect execution.

Sources:
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
- https://modelcontextprotocol.io/specification/2026-07-28

## Existing approaches

1. **Blind retry with bounded count.** Prevents infinite loops but not duplicate side effects.
2. **Tool-specific idempotency keys.** Strong when the downstream service persists and enforces them, but support is inconsistent.
3. **Provider/tool-call IDs.** Useful correlation identifiers, but not every runtime preserves them across fallback/replay and they may represent transport attempts rather than the logical user operation.
4. **Read-before-write side-effect checks.** Useful when the external system exposes a reliable queryable marker, but subject to race conditions and eventual consistency.
5. **Human confirmation on every retry.** Safer but expensive, difficult to scale, and still ambiguous if the user cannot tell whether the first attempt succeeded.
6. **Compensation/rollback.** Important for some workflows, but not every side effect is reversible and compensation itself can fail.
7. **MCP SEP-3182-style request idempotency.** Promising, but not yet safe to assume across all clients, servers, SDKs, or non-MCP tools.

## Observed limitations

- Retry budgets answer “how many attempts?” but not “is another execution safe?”
- A timeout is an ambiguous result, not proof that no side effect happened.
- Local deduplication that is written only after execution has a crash window: the side effect may occur before the completion record is persisted.
- Idempotency keys without canonical argument fingerprints can be accidentally reused for different operations.
- Downstream systems may expire deduplication records too early for delayed retries.
- Concurrent duplicate requests need a reservation/in-progress state; a completed-only cache is insufficient.
- Side-effect probes may be unavailable, stale, non-atomic, or too expensive.
- Automatically weakening safety after retry failure converts uncertainty into duplicate risk.

## Root-cause hypotheses

1. **Attempt identity is confused with logical operation identity.** A new transport request gets a new ID even though it represents the same intended action.
2. **Retry policy is separated from side-effect semantics.** Generic retry middleware does not know whether the tool mutates state.
3. **No durable reservation exists before dispatch.** Concurrent duplicates can both pass the gate.
4. **Ambiguous outcomes are treated as ordinary failures.** A lost response is often classified the same way as a validated pre-execution failure.
5. **Idempotency metadata is not end-to-end.** Keys may be dropped by adapters, wrappers, SDKs, or downstream APIs.
6. **Verification is model-only.** The model is asked whether retrying seems safe rather than using a deterministic operation ledger.

## Improvement target

Introduce a host-side guard with the following contract:

1. Classify each tool as `read_only`, `idempotent_write`, or `non_idempotent_write`.
2. Build a stable **logical operation key** from run intent, canonical tool identity, canonical arguments, and an explicit operation nonce/intent ID.
3. Reserve the operation in a durable ledger **before** dispatch.
4. Bind each key to a canonical argument fingerprint; the same key with different arguments is a hard conflict.
5. Persist states: `reserved`, `in_progress`, `completed`, `known_failed`, `outcome_unknown`, `cancelled`.
6. On duplicate `completed`, return/reuse the recorded result reference rather than executing again.
7. On duplicate `in_progress`, do not run concurrently; wait/poll outside the model loop or fail closed according to policy.
8. On `outcome_unknown` for state-changing tools, block blind retry. Require a deterministic side-effect probe, downstream idempotency support, compensation plan, or explicit human approval.
9. Retry only when failure is known to have happened before side-effect execution or when the downstream idempotency contract guarantees deduplication.
10. Bound retries independently from idempotency checks.

## Threat / failure model

### Protected assets

- external resources created or modified by tools;
- repository and filesystem state;
- messages/emails/notifications;
- deployments and release operations;
- financial or quota-bearing operations;
- child-agent/task spawns;
- approval and audit integrity.

### Failure paths

- response lost after success;
- proxy timeout after downstream commit;
- model/provider fallback replays a logical action;
- host reconnect/resume duplicates a pending call;
- concurrent workers race on the same operation;
- idempotency key reused with changed arguments;
- stale deduplication record expires before delayed retry;
- result persistence fails after side effect commits.

## Success metrics

- duplicate side-effect executions per 1,000 logical operations;
- percentage of state-changing calls with an operation key;
- ambiguous-outcome retries blocked;
- duplicate completed calls replayed without re-execution;
- key/argument conflicts rejected;
- concurrent duplicate dispatches suppressed;
- side-effect probe resolution rate;
- human escalations caused by unresolved ambiguity;
- false-block rate for genuinely safe retries;
- retry latency overhead.

## Verification target

The supplied tests must prove at minimum:

- same key + same fingerprint cannot execute twice;
- same key + different fingerprint is rejected;
- completed duplicate returns a replay decision;
- in-progress duplicate is blocked;
- non-idempotent ambiguous outcome is blocked;
- known pre-execution failure may be retried within budget;
- read-only operations can use a less restrictive policy;
- retry count is bounded even when retry-safe;
- no policy path silently converts `outcome_unknown` into `known_failed`.

## Observed evidence vs interpretation vs proposal

### Observed evidence

Current standards work, workflow specifications, and recent agent-runtime issues all document duplicate/retry side-effect concerns.

### Interpretation

Retry correctness requires a logical-operation identity and explicit ambiguous-outcome state. Counting attempts alone is insufficient.

### Proposed engineering solution

This package adds a deterministic side-effect retry guard and an operation ledger that can sit in front of MCP tools, coding-agent tools, queue workers, or custom orchestration runtimes. It does not claim true exactly-once execution in every distributed failure mode; where exactly-once cannot be guaranteed, it fails closed and makes uncertainty visible.