# Research — Subagent Lifecycle Join Barrier

## Problem

Multi-agent coding and review systems can allow the parent/coordinator to finish, report success, or move to a dependent stage while spawned subagents or background work are still running, stalled, orphaned, misrouted, or terminated without a usable handoff. The failure is especially damaging in headless CI because a parent process may exit successfully while required child work never produces an artifact.

## Category

**Thinking** — reliability of planning, delegation, execution, handoff, and verification. The package does not request or expose hidden chain-of-thought; it uses explicit lifecycle state, evidence, bounded waits, completion contracts, and independent verification.

## Why it matters now

Recent agent runtimes increasingly support background subagents and nested orchestration. Public reports in July–August 2026 show that lifecycle coordination remains fragile across more than one implementation.

## Current public signals

### Signal 1 — Claude Code headless success before subagents complete

On 2026-08-08, Claude Code issue #85066 reported a headless SDK session dispatching multi-agent review work and then terminating 6–15 seconds later with a success result while no review was produced. The GitHub Action therefore appeared successful although the delegated work had been orphaned.

Source: https://github.com/anthropics/claude-code/issues/85066

### Signal 2 — Claude Code subagents can terminate without partial handoff

On 2026-08-02, issue #83412 reported subagents dying when spend/usage limits were reached without returning partial work or a structured failure reason to the orchestrator. The coordinator could not distinguish a resource limit from other failures without inspecting raw output.

Source: https://github.com/anthropics/claude-code/issues/83412

### Signal 3 — Codex coordinator can call the wrong wait primitive

On 2026-08-05, OpenAI Codex issue #37113 reported a coordinator spawning an agent and then routing the required subagent wait to an unrelated wait function. This demonstrates that a prompt-level instruction to “wait for agents” is not a deterministic lifecycle guarantee.

Source: https://github.com/openai/codex/issues/37113

### Signal 4 — Codex stale running children can drive expensive polling

On 2026-08-06, Codex issue #37299 reported stale `running` subagents keeping wait/status orchestration active; repeated polling re-metered a very large cached context and consumed substantial weekly usage while little productive work occurred.

Source: https://github.com/openai/codex/issues/37299

### Signal 5 — Claude Code missing parent linkage can misroute findings

On 2026-08-05, Claude Code issue #84102 reported background sessions without durable parent linkage, leaving completed findings with no canonical route back to the commissioning session.

Source: https://github.com/anthropics/claude-code/issues/84102

### Signal 6 — nested/background notifications can be orphaned

Claude Code issue #76681 (2026-07-11) reports a background task completion notification being enqueued but never delivered after its owning subagent had already completed. Issue #75043 reports nested subagents whose completion notifications never reach their parent and ownership errors on stop/resume.

Sources:
- https://github.com/anthropics/claude-code/issues/76681
- https://github.com/anthropics/claude-code/issues/75043

## Observed evidence vs interpretation

### Observed evidence

- Parent/headless execution can return success while delegated work has not produced its required result.
- Child agents can terminate for resource limits without structured partial-result handoff.
- Waiting can be misrouted to the wrong primitive.
- Stale child status can keep polling loops alive and create large token/cost overhead.
- Parent/child linkage and completion notification delivery can be missing or inconsistent.

### Interpretation

The recurring design gap is that orchestration often treats delegation as a model conversation convention instead of a durable lifecycle protocol. “Spawned” and “requested” are mistaken for “joined” and “verified.” A parent can therefore make a completion decision without an authoritative ledger proving the terminal state and handoff status of every required child.

### Proposed engineering solution

Introduce an **Agent Subagent Lifecycle Join Barrier** at the harness/orchestrator boundary:

1. Every delegated unit receives a stable `task_id`, `parent_id`, required/optional flag, deadline, expected artifact contract, and owner.
2. State transitions are explicit and monotonic: `planned → dispatched → running → terminal` where terminal is one of `succeeded`, `failed`, `cancelled`, `timed_out`, `resource_exhausted`, `orphaned`.
3. Parent completion is blocked while any required descendant lacks a terminal state plus a valid handoff.
4. A deterministic join checker validates the ledger; the LLM cannot self-declare the barrier satisfied.
5. Waiting uses bounded backoff with a maximum wall-clock budget and stale-heartbeat detection rather than unbounded model-driven polling.
6. Resource exhaustion and other failures require structured partial-result handoff where available.
7. Completion artifacts are independently verified before they satisfy the join barrier.
8. Orphaned descendants are surfaced as blocking failures rather than silently converted to parent success.

## Existing approaches

### Prompt instructions such as “wait for all subagents”

Useful as intent, but issue #37113 shows the coordinator can still route to an incorrect waiting primitive. Prompt compliance is not an authoritative scheduler state.

### Background notifications

Notifications can provide useful async delivery, but issues #76681 and #75043 show delivery/ownership paths can fail. A notification queue alone is not a durable join ledger.

### Parent process exit status

A process exit code is convenient for CI, but issue #85066 demonstrates that a parent may exit success before delegated work exists. Exit status must be derived from the lifecycle ledger rather than treated as proof by itself.

### Repeated status polling

Polling can detect progress, but issue #37299 shows short model-driven polling intervals can waste large amounts of context/token budget when a child remains stale. Polling requires deterministic timers, stale-state rules, and model-free status checks when possible.

### Generic completion verification

Verification of final claims helps, but it is insufficient when the missing requirement is not “is this output correct?” but “did every required delegated computation actually terminate and hand off?” Lifecycle joins must precede final result verification.

## Observed limitations of current approaches

- No durable parent-child task graph.
- Missing distinction between required and optional descendants.
- Ambiguous terminal reason and no structured resource-exhaustion state.
- Missing partial-result contract.
- Parent can complete before child result delivery.
- Model-driven wait loops consume tokens while idle.
- Stale `running` state can persist indefinitely.
- Notification delivery can be decoupled from task terminal state.
- Implementing agent can be the only verifier of its own handoff.

## Root-cause hypotheses

1. **Lifecycle state is implicit.** Conversation turns and tool messages are used as a proxy for scheduler state.
2. **Spawn is not coupled to join.** The runtime records child creation but parent completion has no mandatory descendant barrier.
3. **Terminal state and result delivery are conflated.** A child may terminate without the parent receiving a valid artifact.
4. **No monotonic state machine.** Resume/background paths can re-create ambiguous or stale statuses.
5. **Wait strategy is model-mediated.** Every status check can consume another expensive model turn.
6. **No stale-heartbeat policy.** “Running” can remain indefinitely without evidence of liveness.
7. **No independent handoff verification.** A child’s success flag can be trusted without checking its required outputs.

## Improvement target

A reusable, provider-neutral join protocol that lets a parent complete only when all **required** descendants have terminal, attributable, and independently verified handoffs—or when a blocking failure is explicitly surfaced.

## Success metrics

- `required_unjoined_at_parent_success = 0`.
- `required_invalid_handoffs_at_parent_success = 0`.
- `orphaned_required_children_silently_ignored = 0`.
- `unbounded_wait_loops = 0`.
- `status_model_calls_per_wait_window` reduced toward zero when provider status can be checked deterministically.
- `time_to_detect_stale_child <= stale_timeout_seconds + poll_interval_seconds`.
- Resource-exhausted child has structured terminal reason and partial artifact reference when available.
- Independent verifier covers 100% of required successful child handoffs before parent success.

## Security and safety notes

The barrier must not “fix” a stuck child by granting additional permissions, bypassing approvals, weakening sandbox restrictions, or retrying destructive operations without idempotency protection. A blocked join is preferable to unsafe recovery.

## Sources

- Claude Code #85066, opened 2026-08-08: https://github.com/anthropics/claude-code/issues/85066
- Claude Code #83412, opened 2026-08-02: https://github.com/anthropics/claude-code/issues/83412
- OpenAI Codex #37113, opened 2026-08-05: https://github.com/openai/codex/issues/37113
- OpenAI Codex #37299, opened 2026-08-06: https://github.com/openai/codex/issues/37299
- Claude Code #84102, opened 2026-08-05: https://github.com/anthropics/claude-code/issues/84102
- Claude Code #76681, opened 2026-07-11: https://github.com/anthropics/claude-code/issues/76681
- Claude Code #75043, opened 2026-07-07: https://github.com/anthropics/claude-code/issues/75043
