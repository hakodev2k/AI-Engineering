# Agent Turn-State Freshness Contract

## Topic
Prevent stale cross-turn state from prematurely ending or incorrectly finalizing a newer agent request.

## Category
**Thinking** — this package improves agent decision/finalization quality through explicit state ownership, evidence correlation, bounded retry, and deterministic verification. It does not expose or require hidden chain-of-thought.

## Problem
Stateful agents preserve thread/checkpoint data across requests. If terminal fields such as `structured_response`, `final_response`, completion flags, decisions, approvals, or verification results survive into a new turn without ownership metadata, routing logic can treat an old value as current. A new request may even trigger correct tool work and still end with a stale previous response.

## Evidence
Current public reports show the failure class in multiple agent stacks:

- LangChain issue #36957: checkpoint-restored `structured_response` can make the next turn exit with the previous turn's result.
- OpenAI Codex issue #30767: a newer request can perform correct tool work while the final visible response still belongs to prior-turn workflow state.
- OpenAI Codex issue #16255: interrupted streaming can omit a completed tool output from persisted history, while retry may reuse stale history.
- LangGraph issue #8358: replayed historical events after thread hydration may lack a sufficient current-run boundary for consumers.

See `evidence/research.md` for source links, observed limitations, interpretations, and root-cause hypotheses.

## Existing approach
Common runtimes use checkpointed threads, structured-output state, run/response IDs, history normalization, and retry/replay. LangGraph documents checkpoints organized by `thread_id`; LangChain returns structured agent output in a `structured_response` state key; provider APIs expose response/run correlation identifiers.

## Existing limitations
Those primitives do not universally enforce **turn-level ownership**. A thread ID identifies the conversation, not necessarily the current user request. Presence-based exit conditions, append-only turn initialization, cached retry snapshots, and ambiguous replay/live events can let historical state remain authoritative.

## Proposed improvement
Adopt a **Turn-State Freshness Contract**:

1. create a unique `turn_id` before mutable current-turn work;
2. preserve useful conversation memory but invalidate turn-scoped terminal fields;
3. wrap terminal/evidence values with `owner_turn_id` and optionally durable revision;
4. require current-turn ownership before routing to END or returning a final response;
5. rebuild retries from the latest durable state after reconciling completed tool work;
6. separate historical replay events from current-run authoritative events;
7. fail closed on missing/foreign ownership with bounded refresh/retry.

## Architecture

```text
Persistent Thread
   |
   v
Turn Admission
  - load latest revision
  - generate turn_id
  - invalidate terminal fields
   |
   v
Model / Tools / Tests / Approvals
  - stamp owner_turn_id
   |
   v
Terminal Candidate
   |
   v
Freshness Gate ----------------------+
  owner == active turn?              |
  evidence belongs to active turn?   |
   | yes                             | no
   v                                 v
Persist + Finalize              Refresh latest state once
                                      |
                               retry once or fail closed
```

## Package structure

```text
agent-turn-state-freshness-contract/
├── README.md
├── guide-intergration.md
├── config/
│   └── turn-state-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── state-examples.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── turn_state_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_turn_state_guard.py
├── verification/
│   └── verification-report.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ for the deterministic helper/tests; runtime integration itself is framework-agnostic and can be implemented in any language.

No third-party Python dependency is required.

## Configuration
Edit `config/turn-state-policy.json` to declare:

- required identity fields;
- terminal fields that must be turn-owned;
- evidence fields that must be turn-owned at finalization;
- invalidation behavior;
- replay/run correlation policy;
- bounded refresh/retry limits.

Do not mark durable conversation memory as terminal state unless it truly should be invalidated every turn.

## Usage
Initialize a new turn:

```bash
python scripts/turn_state_guard.py init \
  --state state-before.json \
  --policy config/turn-state-policy.json \
  --turn-id turn-20260820-001 \
  --output state-after.json
```

Stamp a result:

```bash
python scripts/turn_state_guard.py stamp \
  --turn-id turn-20260820-001 \
  --revision 41 \
  --value '{"status":"pass"}'
```

Validate before finalization:

```bash
python scripts/turn_state_guard.py validate-state \
  --state final-state.json \
  --policy config/turn-state-policy.json
```

Run regression tests:

```bash
python -m unittest tests/test_turn_state_guard.py -v
```

## Workflow
Use `workflows/workflows.md` for three reusable flows:

- Audit → Contract → Verify;
- Runtime Turn Admission & Finalization;
- Interrupted Stream / Retry Recovery.

Every retry loop is bounded. The package never recommends returning an older terminal value as fallback.

## Skills
`skills/core-skills.md` provides executable procedures for:

- baseline/ownership audit;
- freshness contract implementation;
- retry/replay freshness verification.

## Rules
`rules/engineering-rules.md` defines observable MUST / MUST NOT / SHOULD controls. The most important invariant is:

> A persisted terminal value is authoritative only when its `owner_turn_id` equals the active turn.

## Subagents
The package separates:

- State Ownership Analyst;
- Freshness Contract Implementer;
- Independent Turn-Safety Verifier.

The implementer is not the sole verifier for high-impact routing/finalization changes.

## Hooks
`hooks/hooks.md` defines hooks for:

- pre-turn admission;
- post-tool evidence stamping;
- pre-finalization freshness validation;
- retry snapshot refresh;
- event replay correlation;
- CI regression gating.

## Metrics
Recommended production metrics:

- stale terminal finalizations blocked;
- foreign-turn evidence blocked;
- missing-owner violations;
- stale retry snapshots detected;
- state refresh recoveries/exhaustions;
- finalization success rate;
- stale final responses per 1,000 multi-turn regression runs.

Target for stale finalization escapes is **0**.

## Verification
`verification/verification-report.md` separates **Implemented**, **Measured**, and **Verified** claims. A production runtime should not be marked verified until the fault-injection scenarios pass, including a stream interruption after tool completion and a deliberately injected prior-turn terminal value.

## Safety
- no hidden chain-of-thought is captured;
- no secrets or raw prompts/tool payloads are required in freshness logs;
- conversation memory is preserved unless explicitly configured as turn-scoped terminal state;
- missing ownership fails closed;
- historical evidence remains available for audit but cannot silently impersonate current-turn verification;
- no irreversible operation is introduced.

## Failure handling
On stale/missing ownership:

1. block finalization;
2. record metadata-only violation evidence;
3. reload latest durable state once;
4. re-evaluate and retry execution at most once;
5. if still invalid, stop with an explicit freshness/state identity error and escalate.

Never weaken ownership checks to hide a failure.

## Definition of Done
An integration is complete only when:

- current evidence and existing limitations are documented;
- ownership matrix is complete;
- unique turn identity is established before work;
- turn-scoped terminal fields are invalidated/versioned;
- all finalization paths enforce freshness;
- retry reconstructs from latest durable state;
- replay/live event correlation is enforced where applicable;
- tests and target-runtime fault injection pass;
- metrics are collected;
- independent verification is complete for high-impact agents;
- no blocking stale-state path remains.

## Customization
For frameworks whose internal state cannot be modified, maintain an external ownership ledger keyed by `(thread_id, field_name)` and validate it at the finalization boundary. For intentionally reusable approvals/evidence, define explicit reusable scope and expiry rather than treating all historical state as current.

See `guide-intergration.md` for framework adaptation and rollout guidance.
