# Agent Session Turn Lease Fencing Guard

**Category:** Thinking  
**Run date:** 2026-09-04 (Vietnam time)

## Problem
Modern agent runtimes can accidentally run two mutation-capable turns against the same logical session after UI ownership races, resume/handoff, client timeouts, retries, or async delegation wakeups. The session can look interrupted while old server work is still active, allowing interleaved transcript state, duplicate work, or stale-owner mutations.

## Evidence
Current public evidence is documented in `evidence/research.md`. It includes independent 2026 reports from OpenAI Codex, Hermes Agent, and OpenWork showing concurrent-turn ownership races, missing per-session locking around retries, async completion lifecycle gaps, and exactly-once violations.

## Existing approach
Agent runtimes commonly use owner/follower UI state, session IDs, client timeouts, retries, completion queues, and transcript lifecycle flags.

## Existing limitations
These mechanisms can coordinate normal flows but do not necessarily fence a stale server worker. A client timeout does not cancel server execution, a session ID does not encode ownership generation, and a retry can become a second writer unless the runtime reconciles uncertain state first.

## Proposed improvement
Use a durable single-writer mutation lease with a monotonically increasing fencing epoch. Every mutation carries the current epoch plus a stable logical operation ID. Stale epochs and duplicate operations are rejected before mutation. Timeouts enter bounded reconciliation rather than blind retry.

## Architecture
```text
agent-session-turn-lease-fencing-guard/
├── README.md
├── config/
│   └── lease-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-turn-lease-check.md
├── rules/
│   └── single-writer-turn-policy.md
├── scripts/
│   └── turn_lease_guard.py
├── skills/
│   └── session-concurrency-diagnosis.md
├── subagents/
│   └── session-consistency-verifier.md
├── tests/
│   └── test_turn_lease_guard.py
└── workflows/
    ├── lease-fenced-turn-execution.md
    └── timeout-reconciliation.md
```

## Installation
Python 3.10+ only; the reference checker uses the standard library. Copy this directory intact.

## Configuration
Adjust `config/lease-policy.json` only to match runtime capabilities. Do not disable stale-epoch blocking or unique operation IDs merely to reduce failures.

## Usage
Prepare JSONL events where each line includes `type` and `session_id`. Lease grants include `actor_id` and integer `epoch`; mutations also include `operation_id`.

```bash
python scripts/turn_lease_guard.py check \
  --policy config/lease-policy.json \
  --events events.jsonl
```

Run deterministic tests:

```bash
python -m unittest tests/test_turn_lease_guard.py
```

## Workflow
Observe → capture baseline ownership → diagnose active/uncertain work → reconcile ambiguous execution → grant/advance lease epoch → execute fenced mutations → measure violations → independent verification → complete. Reconciliation retries are bounded to two by default.

## Metrics
- concurrent mutation lease violations / 1,000 sessions
- stale-epoch mutations blocked
- duplicate operation IDs blocked
- ambiguous timeout recoveries reconciled before takeover
- mean reconciliation time
- false-positive rate for legitimate read-only followers

## Verification
**Implemented:** deterministic event checker, policy, workflows, rules, tests, and independent verifier role exist.  
**Measured:** runtime adopters must capture a pre-rollout baseline and post-rollout event metrics.  
**Verified:** only after the unit tests and local race fixtures pass, all mutation paths including background wake are fenced, and a verifier independent from implementation reviews the event evidence.

## Safety
This package changes coordination semantics, not model reasoning. It does not request hidden chain-of-thought. Mutation must fail closed when ownership is ambiguous. Never infer server cancellation from a client timeout. Dangerous recovery or manual override requires explicit human/operator approval.

## Failure handling
**Detection:** stale epoch, overlapping lease, duplicate operation, mutation without lease, inconsistent terminal evidence.  
**Evidence:** preserve raw event sequence and durable runtime state.  
**Retry policy:** at most two reconciliation retries; no blind mutation retry.  
**Fallback:** read-only observation where enforceable; otherwise stop.  
**Escalation:** runtime owner/security-reliability reviewer.  
**Stop condition:** ownership remains unknown, old epoch cannot be fenced, or a stale mutation is observed.

## Definition of Done
- current evidence documented
- baseline ownership/incident metrics captured
- meaningful existing limitations identified
- single-writer lease and fencing integrated at every mutation path
- timeout/retry path reconciles before takeover
- deterministic tests pass
- known race fixtures are blocked
- legitimate read-only followers remain usable
- no secrets included
- risks documented
- independent verification complete
- no blocking issue remains

## Customization
Map the abstract events to database leases, Redis/etcd compare-and-swap, transactional session rows, or another durable primitive. Preserve the invariants: one mutation writer, monotonically increasing fencing epoch, stable operation identity, and bounded reconciliation.