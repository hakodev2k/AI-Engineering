# Research — Stale Resume Work Quarantine Gate

## Topic
Preventing stale autonomous work from being silently reactivated after restart/resume

## Category
Thinking

## Problem
Persistent agent runtimes can reconstruct session state after restart or upgrade and mistakenly classify old work as recent/resumable. Stale pending completions, refreshed metadata timestamps, or synthetic resume turns can cause an agent to continue historical tasks and reach tool side effects without a fresh decision that the work is still intended.

## Why it matters now
August 2026 reports show concrete restart/resume paths that revive week-old or multi-week-old agent work. Persistence is valuable, but "durable" is not equivalent to "still authorized/current." Long-lived agents therefore need a freshness and intent boundary before resumed state is allowed to drive new model/tool execution.

## Affected users
Long-running agent users, coding-agent operators, platform builders with persistent sessions/delegations, teams deploying upgrades/restarts, and systems with automatic recovery.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #79199, opened 2026-08-05, reports week-old `delivery_state='pending'` delegation completions restored after a container upgrade; the restored events caused agents to resume historical workflows, make model calls, read files, attempt a patch, and request code execution. https://github.com/NousResearch/hermes-agent/issues/79199
2. Hermes Agent issue #85709, opened 2026-08-14, reports session repointing refreshing `updated_at`, causing a 21-day-old session to pass a 120-second freshness gate, be marked `resume_pending`, and receive a synthetic message that could retry unfinished work. https://github.com/NousResearch/hermes-agent/issues/85709
3. Hermes Agent issue #80921, opened 2026-08-07, references the August 2026 "Resume Means Resume" conformance work and reports deterministic crash/resume violations across multiple agent frameworks, including re-execution of effect-bearing work and consume-once failures under concurrent resume. https://github.com/NousResearch/hermes-agent/issues/80921

## Interpretation
The shared problem is provenance confusion between storage maintenance time, transport delivery state, last real user/activity time, and current authorization to resume. Restart logic often has enough information to reconstruct a task but not enough evidence to prove the task is still current and safe to continue autonomously.

## Existing approaches
- Durable checkpoints and pending-event restoration.
- Recent-activity windows for auto-resume.
- Idempotency keys/consume-once semantics for side effects.
- Manual operator inspection after suspicious restarts.
- Session `updated_at` timestamps and generic "resume pending" flags.

## Remaining limitations
- Generic `updated_at` can be mutated by maintenance/reconciliation and is not proof of user activity.
- Pending delivery can outlive the intent that created it.
- Idempotency prevents duplicate effects but does not decide whether old work should run at all.
- Automatic recovery can inject synthetic turns that look like fresh work to the model.
- Age, provenance, prior terminal state, approvals, and side-effect risk are rarely evaluated together before model/tool execution resumes.

## Root-cause analysis
1. Freshness is derived from mutable storage metadata instead of immutable activity provenance.
2. Restore logic conflates "undelivered" with "still actionable."
3. Synthetic resume messages do not carry explicit stale/reference-only semantics enforceable by the runtime.
4. Side-effect authorization is inherited across restart without revalidation against elapsed time and state drift.
5. Recovery is optimized for liveness before correctness of intent.

## Improvement opportunity
Introduce a deterministic pre-resume quarantine decision. Build a resume envelope from immutable timestamps and provenance, classify age and prior terminal state, compare workspace/external state where required, and require explicit re-authorization for stale or side-effect-capable work. Reference-only historical completions may be surfaced to the user/context but MUST NOT become an autonomous active turn.

## Proposed solution
This package provides a resume-freshness procedure, enforceable quarantine rules, an independent resume verifier, a bounded recovery workflow, a pre-resume hook, and a dependency-free Python checker that evaluates resume envelopes without executing model/tool actions.

## Goal
Allow legitimate crash recovery while preventing stale historical work from silently becoming current autonomous execution.

## Metrics
- stale resume attempts blocked
- auto-resumes permitted within freshness window
- side-effect-capable resumes requiring re-approval
- false-positive quarantine rate
- duplicate/resurrected task count
- time-to-safe-recovery
- resume decisions with complete provenance

## Trigger
Process restart, upgrade, host migration, session recovery, delivery restoration, explicit resume, or any synthetic turn created from persisted work.

## Inputs
Resume envelope containing session/task id, last real activity timestamp, persistence/update timestamp, completion/delivery timestamp, current time, prior terminal state, side-effect capability, authorization age, and provenance source.

## Outputs
`allow`, `quarantine`, or `deny` decision; reason codes; required revalidation/approval; immutable decision evidence.

## Verification
Verified only when stale fixtures are quarantined, genuinely recent interrupted work can pass under policy, maintenance-only timestamp refresh cannot make old work fresh, and quarantine itself performs no model/tool side effects.
