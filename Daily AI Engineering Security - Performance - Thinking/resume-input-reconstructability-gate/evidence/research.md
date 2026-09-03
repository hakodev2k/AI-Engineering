# Research Evidence

## Topic
Resume Input Reconstructability Gate

## Category
Thinking

## Problem
Stateful AI workflows may mark a failed task as resumable even when part of the original task input was intentionally not checkpointed or cannot be reconstructed. Resume then executes a logically different task under the same workflow identity, creating silent divergence rather than an explicit recovery failure.

## Why it matters now
Recent LangGraph reports show this failure class in current agent workflows. Issue #8582 (Aug 10, 2026) demonstrates a failed dynamic `Send` task whose `UntrackedValue` runtime input disappears on checkpoint resume while the task remains resumable. Issue #2667 in LangGraph.js (Aug 6, 2026) shows completed `task()` work being re-executed on resume when the same graph is nested as a subgraph, despite reuse working in standalone mode. These are distinct implementations but share the same reliability problem: recovery semantics can diverge from the original execution when resume metadata is insufficient to reconstruct prior task state exactly.

## Affected users
Developers using durable agent graphs, dynamic fan-out, runtime-only clients/sessions/locks, nested subgraphs, human interrupts, and platform teams depending on crash/retry semantics.

## Current public evidence

### Observed evidence
1. `langchain-ai/langgraph#8582`, opened 2026-08-10, reports that a failed `Send` task depending on `UntrackedValue` resumes with that value missing; the task is still considered resumable and receives a structurally different input.
2. `langchain-ai/langgraphjs#2667`, opened 2026-08-06, reports that a completed `task()` is re-executed after resume only when the graph runs as a subgraph, while standalone execution restores the completed result.
3. `langchain-ai/langgraph#6818` asks for deterministic crash/resume guarantees and regression coverage comparing resumed with uninterrupted execution, indicating the broader contract remains an active reliability concern.

### Interpretation
A checkpoint should not imply resume eligibility by itself. The runtime needs an explicit reconstructability contract describing which task inputs are durable, which are runtime-only, whether completed side effects/results can be replayed safely, and whether the resumed invocation is semantically equivalent to the original one.

### Proposed solution
Before retry/resume, compute a deterministic resume contract from task metadata and state: durable input fields, runtime-only fields, completion/result evidence, side-effect classification, expected task fingerprint, and allowed fallback. Block automatic resume when required inputs are absent or when completed work would be re-executed without an idempotency/replay guarantee.

## Existing approaches
- Checkpoint state and resume from the latest runnable task.
- Mark runtime-only resources as untracked/non-serializable.
- Recreate clients/resources at process startup.
- Use idempotent tasks or durable task primitives where available.

## Remaining limitations
- Untracked fields can be legitimate during initial execution but unavailable during retry.
- Reconstructing a new resource of the same type does not prove semantic equivalence to the original resource/session.
- Completed task results can be recomputed unexpectedly under nested orchestration.
- Generic checkpoint success does not expose whether every required task input is durable.
- Application-level idempotency cannot compensate for missing decision inputs or changed runtime identity.

## Root-cause analysis
1. Resume eligibility is inferred from graph position instead of explicit input reconstructability.
2. Persistence metadata describes state durability but not per-task dependency durability.
3. Runtime-only values are excluded from checkpoints without a corresponding non-resumable marker.
4. Nested graph ownership can alter how completed task state is recovered.
5. Verification often checks that execution continues, not that resumed execution is equivalent to uninterrupted execution.

## Improvement opportunity
Add a reusable gate that fingerprints required task inputs, labels each dependency as durable/reconstructable/runtime-only, records completed result evidence, and rejects resume when the original invocation cannot be faithfully reconstructed. Pair it with uninterrupted-vs-resumed comparison tests and bounded recovery paths.

## Goal
Prevent silent semantic divergence after pause/crash/retry by ensuring resumed tasks are equivalent to the original logical invocation.

## Metrics
- Percentage of resumable tasks with complete dependency manifests.
- Number of blocked resumes caused by missing required runtime-only inputs.
- Uninterrupted-vs-resumed terminal state match rate.
- Duplicate completed-task execution count.
- Side-effect replay violations.
- Recovery escalation rate.

## Trigger
Use when adding checkpointing, dynamic fan-out, untracked/runtime-only values, nested subgraphs, durable tasks, or human interrupt/resume flows.

## Inputs
Checkpoint snapshot, task metadata, required input manifest, runtime resource descriptors, completion/result records, and side-effect classification.

## Outputs
Resume eligibility verdict, missing dependency list, task fingerprint comparison, recovery action, and verification record.

## Relevant sources
- LangGraph issue #8582, 2026-08-10: https://github.com/langchain-ai/langgraph/issues/8582
- LangGraph.js issue #2667, 2026-08-06: https://github.com/langchain-ai/langgraphjs/issues/2667
- LangGraph issue #6818, deterministic checkpoint resume contract: https://github.com/langchain-ai/langgraph/issues/6818
