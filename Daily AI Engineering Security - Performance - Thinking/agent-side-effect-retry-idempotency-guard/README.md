# Agent Side-Effect Retry Idempotency Guard

## Topic

Preventing duplicate state-changing tool execution when an AI agent retries after a timeout, lost response, provider fallback, reconnect, replay, or other ambiguous outcome.

## Category

**Security** — with reliability, cost, and performance implications.

## Problem

A state-changing tool can succeed even when the host never receives its response. If the runtime treats the missing response as a normal failure and retries, the same logical action may happen twice: duplicate issue creation, duplicate message sends, repeated deployments, repeated file writes, duplicate child-agent spawns, or other externally visible effects.

A retry limit alone does not solve this. One unsafe retry is enough.

The core failure is confusing **transport attempts** with a **logical user operation**. A safe runtime needs a stable operation identity, an explicit ambiguous-outcome state, and a deterministic gate before another write is dispatched.

## Evidence

Current public evidence is documented in [`evidence/research.md`](evidence/research.md). Key signals include:

- MCP SEP-3182, opened 2026-08-01, proposing `tools/call` request idempotency because current MCP cannot safely distinguish “never executed” from “executed but response lost”;
- its reference implementation demonstrating an unguarded retry double-executing a side effect;
- Claude Code issue #85402 (2026-08-09), reporting refusal/fallback replay that re-dispatches already-running background agents;
- Hermes Agent issue #57767 (2026-07-03), documenting missing idempotency protection for duplicate `delegate_task` dispatch;
- GitHub Agentic Workflows' MCP Scripts specification explicitly requiring retry safety to account for non-idempotent side effects.

The package separates observed evidence, interpretation, and the proposed engineering solution.

## Existing approach

Common approaches today include:

- generic bounded retry middleware;
- provider/tool-call IDs;
- downstream-specific idempotency keys;
- read-before-write checks;
- manual approval on retries;
- compensation/rollback;
- retry circuit breakers.

## Existing limitations

These mechanisms remain incomplete when used alone:

- bounded retries still allow one duplicate;
- a timeout does not prove the first call failed;
- a fresh transport ID can represent the same logical operation;
- downstream idempotency is not universal and may be dropped by adapters;
- completed-only deduplication does not prevent concurrent duplicate dispatch;
- read-before-write probes can be eventually consistent or inconclusive;
- local result persistence can fail after the external side effect already committed;
- retry circuit breakers stop repeated failure loops but do not resolve the first ambiguous retry.

## Proposed improvement

Use a host-side logical-operation ledger:

```text
Agent intent
  -> classify tool side effects
  -> canonical tool identity + canonical arguments + stable intent ID
  -> reserve logical operation before dispatch
  -> persist in_progress
  -> execute tool
       -> result received ........ completed
       -> proven pre-effect fail . known_failed
       -> response uncertain ..... outcome_unknown
  -> deterministic retry/replay gate
       -> replay completed result
       -> block duplicate in-progress
       -> reject key/argument conflict
       -> retry verified-safe failure
       -> probe/reconcile ambiguous write
       -> escalate unresolved ambiguity
```

The model may help plan recovery, but it is not the authority that decides whether an ambiguous state-changing call can execute again.

## Architecture

### Logical operation identity

[`scripts/idempotency_guard.py`](scripts/idempotency_guard.py) derives a stable fingerprint from:

- canonical server/tool identity;
- validated arguments;
- a stable intent ID.

The resulting logical key is stable across retries/fallbacks for one intended action.

### Durable reservation

The reference implementation writes a ledger record before dispatch. A production multi-worker host should replace the JSON store with an atomic durable database while retaining the same state machine.

### State machine

Supported states:

- `reserved`;
- `in_progress`;
- `completed`;
- `known_failed`;
- `outcome_unknown`;
- `cancelled`.

`outcome_unknown` is intentionally first-class. It must not be silently converted to failure.

### Retry gate

The retry decision accounts for:

- state;
- side-effect classification;
- attempt budget;
- verified downstream idempotency;
- side-effect probe result;
- explicit human approval.

### Side-effect reconciliation

[`scripts/side_effect_probe.py`](scripts/side_effect_probe.py) evaluates host-supplied read-only observations and emits `effect_present`, `effect_absent`, or `unknown`. It performs no external writes.

## Package structure

```text
agent-side-effect-retry-idempotency-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── idempotency-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── invocations.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── schemas/
│   └── invocation-record.schema.json
├── scripts/
│   ├── idempotency_guard.py
│   └── side_effect_probe.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_idempotency_guard.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation

Python 3.10+ is recommended. The scripts use only the Python standard library.

Copy the package into the host/runtime repository. For a minimal integration retain:

```text
config/idempotency-policy.json
scripts/idempotency_guard.py
scripts/side_effect_probe.py
schemas/invocation-record.schema.json
```

No secrets are required.

## Configuration

[`config/idempotency-policy.json`](config/idempotency-policy.json) defines:

- maximum attempts;
- behavior for read-only, idempotent-write, and non-idempotent-write tools;
- ambiguous-outcome policy;
- duplicate-in-progress handling;
- forced-retry human approval;
- operation record retention;
- result replay mode.

Default unknown tools to `non_idempotent_write` until reviewed.

## Usage

### 1. Reserve a logical operation

```bash
python scripts/idempotency_guard.py reserve \
  --ledger .agent/idempotency-ledger.json \
  --server github \
  --tool create_issue \
  --arguments-file issue-args.json \
  --intent-id incident-421-create-ticket \
  --classification non_idempotent_write
```

Only `reserved` permits a new dispatch.

### 2. Mark actual dispatch start

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state in_progress
```

### 3. Record success

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state completed \
  --result-reference "issue://1234"
```

### 4. Record an ambiguous failure

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state outcome_unknown \
  --failure-reason "response lost after dispatch"
```

### 5. Gate retry

```bash
python scripts/idempotency_guard.py retry-decision \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --policy config/idempotency-policy.json
```

Only a `retry` decision unlocks another dispatch. `replay`, `replay_or_reconcile`, and `block` must not re-run the write.

See [`guide-intergration.md`](guide-intergration.md) for production wiring, MCP capability handling, multi-worker storage, provider fallback, and rollout.

## Workflow

Primary workflow in [`workflows/workflows.md`](workflows/workflows.md):

**Classify → Canonicalize → Reserve → Dispatch → Capture Outcome → Deterministic Decision → Reconcile/Retry → Independent Verify**

Ambiguous-outcome recovery and retry/replay regression review are separate bounded workflows. There are no unlimited retry or probing loops.

## Skills

[`skills/core-skills.md`](skills/core-skills.md) provides executable procedures for:

- side-effect semantic classification;
- logical operation identity creation;
- ambiguous-outcome resolution;
- retry-safety regression verification.

Each skill defines trigger, inputs, preconditions, context, procedure, decisions, constraints, output, metrics, verification, failure handling, and stop conditions.

## Rules

[`rules/engineering-rules.md`](rules/engineering-rules.md) defines observable **MUST / MUST NOT / SHOULD** controls. Important invariants include:

- reserve before state-changing dispatch;
- same key + changed arguments is a conflict;
- timeout is not proof of failure;
- completed duplicate is replayed rather than re-executed;
- in-progress duplicate cannot run concurrently;
- ambiguous non-idempotent write cannot blind-retry;
- retry budgets remain bounded;
- safety is never weakened just to finish automation.

## Subagents

[`subagents/subagents.md`](subagents/subagents.md) defines:

- Retry Semantics Analyst;
- Guard Implementation Agent;
- Outcome Reconciliation Agent;
- Independent Verification Agent;
- Orchestrator.

The implementation agent is not the sole verifier for high-risk retry behavior.

## Hooks

[`hooks/hooks.md`](hooks/hooks.md) defines predictable runtime gates for:

- pre-dispatch reservation;
- dispatch-start persistence;
- post-success completion;
- ambiguous transport failure;
- side-effect probe;
- pre-retry decision;
- final regression verification.

## Metrics

Track at minimum:

- duplicate side-effect executions / 1,000 logical operations;
- percentage of state-changing calls with stable keys;
- ambiguous-outcome retries blocked;
- completed duplicates replayed;
- fingerprint conflicts rejected;
- concurrent duplicates suppressed;
- probe resolution rate;
- retry attempts per logical operation;
- human escalation rate;
- false-block rate;
- guard decision latency.

Do not claim improvement until these are compared against an integration baseline.

## Verification

Run:

```bash
python -m unittest tests/test_idempotency_guard.py
```

The regression suite covers duplicate reservation, argument conflict, completed replay, ambiguous non-idempotent blocking, probe-present/probe-absent paths, read-only retry, verified downstream idempotency, known failure retry, retry-budget exhaustion, and explicit human override.

[`verification/report.md`](verification/report.md) separates **Implemented**, **Measured**, and **Verified** status and documents known distributed-system limits.

## Safety

- The package never grants permissions or executes external tools itself.
- It never requires credentials.
- It preserves uncertainty instead of inventing success/failure.
- Non-idempotent ambiguous retries fail closed.
- Operation records should contain hashes/references rather than raw sensitive payloads.
- Dangerous or irreversible retry overrides require explicit human approval.
- Production stores must use atomic reservation semantics.

This guard complements authentication, authorization, sandboxing, DLP, approval boundaries, retry circuit breakers, and downstream-native idempotency; it does not replace them.

## Failure handling

### Reservation store unavailable

Block new state-changing dispatches. Do not execute first and “record later.”

### Lost response after dispatch

Persist `outcome_unknown`; use downstream idempotency or a deterministic read-only probe before deciding.

### Probe inconclusive

Preserve `outcome_unknown` and escalate. Maximum unknown-resolution probing is bounded by policy.

### Key conflict

Reject immediately and investigate changed arguments/intent reuse.

### Retry budget exhausted

Stop automatic retries and surface the operation record to an operator.

### Completed result cannot be reconstructed

Do not re-execute automatically. Reconcile from downstream read-only state or escalate.

## Definition of Done

A real integration is complete only when:

- current public evidence and local failure modes are documented;
- every state-changing tool has a reviewed classification;
- every write is reserved before dispatch;
- stable intent IDs survive retry/fallback/resume;
- operation storage is atomic for the deployment topology;
- changed-argument key reuse is rejected;
- completed duplicates do not execute again;
- concurrent duplicates are blocked;
- ambiguous non-idempotent outcomes cannot blind-retry;
- retry budgets are enforced;
- configured probes are deterministic and read-only;
- tests pass on the integrated host;
- a staging lost-response scenario is verified for high-risk tools;
- production metrics are collected;
- independent verification is complete for high-risk changes;
- no blocking safety issue remains.

## Customization

You can replace the JSON ledger with SQL/Redis, add signed operation records, bind user/tenant identity into the fingerprint, add OpenTelemetry spans, integrate downstream API idempotency keys, or define tool-specific side-effect probes.

Preserve four invariants:

1. **One logical intent, one stable key.**
2. **Reserve before write.**
3. **Unknown is not failure.**
4. **Retry only when evidence or an idempotency contract makes it safe.**