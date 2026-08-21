# Agent Tool-Result Correlation Integrity Guard

## Topic

Protecting causal integrity between AI-agent tool invocations and tool results across retries, fallbacks, streaming, and multi-agent execution.

## Category

**Thinking**

## Problem

Agent reasoning depends on a simple but critical invariant: each tool result must belong to exactly one intended tool invocation. In real runtimes, tool-call IDs can be replayed, orphaned, duplicated, dropped, or reused across retry boundaries. A transcript can also be rolled back while a real background action continues executing.

When the host cannot prove which observation belongs to which action, the model may reason from stale or incorrect state, repeat work, duplicate side effects, or enter tool loops.

This package adds a deterministic host-side correlation ledger and continuation gate so the model never has to infer execution identity from prose or hidden reasoning.

## Evidence

Current public evidence is documented in [`evidence/research.md`](evidence/research.md). Strong recent signals include:

- Anthropic Claude Code issue #84272 (2026-08-05), reporting a large regression in orphaned `tool_use` events and silently dropped results;
- OpenAI Codex issue #27757, reporting repeated tool-call IDs and repeated resubmission of the same tool result across retries;
- Anthropic Claude Code issue #85402 (2026-08-09), reporting fallback retries that can duplicate already-executed background Agent dispatches;
- repeated identical-tool-call reports in Claude Code #59318 and Codex #27759.

## Existing approach

Common runtimes rely on provider tool-call IDs, transcript ordering, whole-turn retries, conversation reconstruction, side-effect idempotency, or repeated-call circuit breakers.

These mechanisms help, but none alone proves causal identity between an invocation and the accepted observation. Provider IDs may be scoped differently than the host assumes; transcript rollback does not undo real executions; and loop breakers usually detect damage after repeated calls have already occurred.

## Existing limitations

- Provider IDs may be duplicated or replayed across retry boundaries.
- Results can arrive after the parent generation is stale.
- Parallel agents create multiple concurrent tool-call namespaces.
- A dropped result may leave an invocation unresolved while the model proceeds.
- Conflicting duplicate results cannot safely use a "latest wins" policy.
- Prompt-only instructions cannot deterministically validate event identity.
- Idempotency protects some side effects but does not repair incorrect reasoning state for reads or inspections.

## Proposed improvement

Use a host-visible correlation contract:

```text
model turn
  -> assign generation
  -> register composite invocation identity
  -> execute tool
  -> append result event
  -> correlate exact identity
  -> hash payload
  -> reject orphan/conflict
  -> quarantine stale generation
  -> require all active calls resolved
  -> continuation gate
  -> model continues
```

Composite identity is:

```text
(session_id, generation, agent_id, tool_call_id)
```

A result is accepted at most once. Identical duplicate payloads can be ignored after deterministic comparison. Conflicting duplicates fail closed. Old-generation results are quarantined. Unknown side-effect replay requires idempotency proof or explicit human approval.

## Architecture

### Correlation ledger

The runtime persists invocation and result records outside model-generated conversation text. It stores identity, state, side-effect classification, and minimal observable metadata.

### Generation boundary

Retries, model fallback, regenerated responses, and reconstructed turns receive explicit generation identity. A transcript rollback therefore cannot make an older real-world execution disappear from host state.

### Deterministic reconciliation

[`scripts/correlation_guard.py`](scripts/correlation_guard.py) validates invocation uniqueness, result ownership, stale-generation handling, conflicting duplicates, unresolved active calls, and side-effect replay requirements.

### Continuation gate

The model is not sent tool results until the correlation state is valid. The default policy fails closed on unresolved active calls.

### Independent verification

High-risk runtime changes are verified separately from implementation using deterministic tests and telemetry.

## Package structure

```text
agent-tool-result-correlation-integrity-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── correlation-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── correlation_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_correlation_guard.py
└── workflows/
    └── workflows.md
```

## Installation

Requires Python 3.10+ for the deterministic guard and tests. The script uses only the standard library.

Copy this package into the agent runtime, orchestration service, or repository that owns tool dispatch. No secrets or network access are required by the guard itself.

## Configuration

Default policy is in [`config/correlation-policy.json`](config/correlation-policy.json).

Important defaults:

- partial continuation disabled;
- stale generations quarantined;
- conflicting duplicates rejected;
- identical duplicates ignored after payload comparison;
- side-effect replay requires idempotency proof;
- unknown side-effect replay requires human approval;
- reconciliation retries bounded to 2.

Do not weaken these rules simply to allow a stuck agent to continue.

## Usage

Create a runtime ledger and run:

```bash
python scripts/correlation_guard.py \
  --ledger runtime-ledger.json \
  --policy config/correlation-policy.json \
  --report correlation-report.json
```

Exit codes:

- `0`: correlation state is safe to continue;
- `2`: correlation or policy violation;
- `3`: invalid input;
- `4`: I/O failure.

Integrate the same check immediately before model continuation.

See [`guide-intergration.md`](guide-intergration.md) for the runtime integration sequence.

## Workflow

Primary workflow:

**Register → Execute → Observe → Correlate → Reconcile → Gate → Continue**

Retry/fallback workflow:

**Freeze old generation → classify live actions → quarantine late results → start new generation → prove replay safety → gate**

Incident workflow:

**Snapshot evidence → re-read authoritative state → reconcile → gate → bounded retry → independent verify or escalate**

Detailed workflows are defined in [`workflows/workflows.md`](workflows/workflows.md).

## Skills

[`skills/core-skills.md`](skills/core-skills.md) contains reusable procedures for:

- correlation baseline construction;
- exactly-once result reconciliation;
- retry/fallback generation boundaries.

Every skill defines trigger, inputs, context, procedure, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules

[`rules/engineering-rules.md`](rules/engineering-rules.md) defines enforceable **MUST / MUST NOT / SHOULD** rules. Core invariants include:

- exact composite identity for every invocation;
- no result accepted without an originating invocation;
- no conflicting duplicate result accepted;
- no silent side-effect replay;
- no assumption that transcript rollback reverses execution;
- no unlimited reconciliation loops.

## Subagents

[`subagents/subagents.md`](subagents/subagents.md) defines:

- Correlation Observer;
- Reconciliation Agent;
- Execution Orchestrator;
- Independent Verification Agent.

Responsibilities are separated so the component enforcing execution is not the sole final verifier for high-risk changes.

## Hooks

[`hooks/hooks.md`](hooks/hooks.md) defines predictable integration points for:

- pre-tool dispatch registration;
- post-result reconciliation;
- pre-model-continuation gating;
- retry/fallback generation rollover;
- post-recovery independent verification.

## Metrics

Measure before and after rollout:

- orphaned-result acceptance rate;
- conflicting duplicate-result acceptance rate;
- stale-generation result acceptance rate;
- unresolved calls at continuation boundary;
- duplicate side effects across retries;
- identical duplicate results safely ignored;
- reconciliation attempts per incident;
- manual recovery/rework caused by lost tool state;
- correlation-gate latency.

Target safety invariants are zero accepted orphan, conflicting, and stale results. Operational improvement claims require a measured baseline and comparison.

## Verification

Run:

```bash
python -m unittest tests/test_correlation_guard.py
```

The included tests cover:

- valid exact correlation;
- orphan result rejection;
- identical duplicate suppression;
- conflicting duplicate rejection;
- stale-generation quarantine;
- unresolved-call blocking;
- duplicate invocation identity rejection;
- side-effect replay without proof;
- replay allowed with idempotency proof.

For production rollout, add fixtures from the target provider/runtime covering stream reconnects, fallback, cancellation, parallel subagents, and background calls.

### Implemented

The package implements policy, deterministic validation, hooks, procedures, bounded workflows, and regression tests.

### Measured

The package defines metrics but does not claim runtime improvement until a target deployment captures before/after telemetry.

### Verified

The deterministic contract is verifiable with the included unit tests and runtime-specific integration fixtures.

## Safety

- The guard does not execute tools or commands supplied by the model.
- It requires no secrets.
- It can store payload hashes instead of sensitive raw outputs.
- It fails closed on conflicting causal state.
- It preserves negative evidence rather than hiding malformed events.
- It prevents automatic replay of unknown side effects.
- Dangerous or irreversible replay requires explicit human approval when idempotency cannot be proven.

## Failure handling

For a correlation violation:

1. pause model continuation;
2. preserve raw event metadata and current ledger;
3. classify the violation;
4. re-read authoritative host/runtime state;
5. reconcile only from observable evidence;
6. retry reconciliation at most twice;
7. if clean, resume with the repaired external state;
8. if ambiguity remains, stop and escalate.

Never resolve ambiguity by deleting a result, inventing a missing observation, choosing the newest conflicting payload, or replaying side effects blindly.

## Definition of Done

An integration is complete only when:

- every tool call has unique composite identity;
- every accepted result maps to exactly one active invocation;
- stale-generation results are quarantined;
- conflicting duplicates fail closed;
- unresolved active calls block continuation under default policy;
- retry/fallback creates a new generation boundary;
- side-effect replay requires idempotency proof or approval;
- reconciliation retries are bounded;
- included tests pass;
- target-runtime integration tests pass;
- baseline metrics have been captured;
- before/after comparison is available before claiming operational improvement;
- no blocking correlation ambiguity remains.

## Customization

Extend the ledger with provider request IDs, trace/span IDs, parent agent IDs, tool argument hashes, timestamps, cancellation tokens, idempotency keys, or signed execution receipts.

A production implementation may replace the JSON ledger with a transactional database or event stream. Preserve the same causal invariants: **unique action identity, exactly-once accepted observation, explicit retry generation, and deterministic continuation gating**.