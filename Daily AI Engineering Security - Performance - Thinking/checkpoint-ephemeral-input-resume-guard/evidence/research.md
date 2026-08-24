# Research — Checkpoint Ephemeral Input Resume Guard

## Topic
Checkpoint/resume integrity when an agent task depends on non-checkpointed or ephemeral dispatch input.

## Category
Thinking

## Problem
Fault-tolerant agent runtimes can resume a failed task from a checkpoint while silently losing task-specific input that was never persisted with durable state. The resumed task then executes with incomplete evidence while the orchestration layer still treats it as a valid retry.

## Why it matters now
On 2026-08-10, LangGraph issue #8582 reported a reproducible case where a failed `Send` task using `UntrackedValue` loses that input when resumed from a checkpoint. LangGraph's official persistence documentation simultaneously promises fault-tolerant restart from the last successful step and explains that checkpoints persist graph state at super-step boundaries. Together, these signals expose a practical boundary: retry correctness depends on every task-critical input being recoverable, not merely on the existence of a checkpoint.

## Affected users
Agent-framework developers, workflow platform builders, long-running coding/research agents, and teams relying on checkpoint/retry for fault tolerance.

## Current public evidence
### Observed evidence
1. LangGraph issue #8582 (opened 2026-08-10) demonstrates that a failed `Send` task can lose `UntrackedValue` input when resumed from a checkpoint: https://github.com/langchain-ai/langgraph/issues/8582
2. LangGraph persistence docs state that checkpoints provide fault tolerance and recovery and that pending writes preserve successful node outputs, but checkpoints contain persisted graph state rather than arbitrary ephemeral values: https://docs.langchain.com/oss/python/langgraph/persistence

### Interpretation
A checkpoint is not sufficient evidence that a task is safely replayable. Hosts need an explicit recoverability contract for the exact inputs required by every resumable task.

## Existing approaches
- Framework-managed checkpoints and pending writes.
- Durable graph state channels.
- Idempotent node design.
- Manual retry handlers and application-specific reconstruction.

## Remaining limitations
- Ephemeral/non-tracked values can be semantically required while absent from durable state.
- Retry paths often validate checkpoint existence, not input completeness.
- Lost input can produce plausible but wrong resumed behavior instead of a hard failure.
- Framework abstractions make it difficult for operators to see which task inputs are replay-critical.

## Root-cause analysis
1. Dispatch-time data and checkpointed state have different durability semantics.
2. Retry eligibility is inferred from checkpoint availability instead of a recoverability proof.
3. Task inputs lack stable fingerprints that can be compared across dispatch/failure/resume.
4. Recovery logic does not fail closed when a required input cannot be reconstructed.

## Improvement opportunity
Attach a replay contract to each resumable task: required input fields, durability source, digest at dispatch, reconstruction method, and resume-time digest. Block resume if required input is absent or differs unexpectedly.

## Goal
Make resume correctness observable and fail closed before model/tool execution when replay-critical inputs are missing or changed.

## Metrics
`resume_attempts`, `resume_contract_failures`, `missing_replay_inputs`, `digest_mismatches`, `unsafe_resumes_blocked`, successful deterministic replays, and recovery time.

## Trigger
Any task failure, process restart, worker migration, checkpoint replay, or manual resume.

## Inputs
Task ID, dispatch input, replay contract, checkpoint metadata, reconstructed input.

## Outputs
PASS/BLOCK decision, field-level evidence, input digests, and escalation reason.

## Proposed solution
This package provides a replay-contract skill, enforceable rules, an independent recovery verifier, a bounded recovery workflow, a deterministic JSON validator, and tests.

## Verification
Verified only when missing or changed replay-critical input is blocked, matching reconstructed input passes, retries are bounded, and no validator path executes agent tools or external side effects.
