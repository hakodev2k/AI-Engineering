# Research — Checkpoint Resume Semantic Integrity Gate

**Topic:** Verify that long-running agent workflows resume from the intended semantic state  
**Category:** Thinking  
**Research date:** 2026-08-28 (UTC+7)

## Problem
A workflow can report that it restored a checkpoint while semantically resuming from the wrong place: restarting the entry executor, losing checkpoint ancestry, re-emitting already-answered requests, losing serialized approval types, or rebuilding with incompatible executor identities. These failures cause duplicated work, skipped work, incorrect approvals, misleading audit trails and unreliable long-running agents.

## Why it matters now
Agent frameworks increasingly advertise durable, checkpointed workflows for long-running tasks. Microsoft Agent Framework documentation updated in August 2026 explicitly defines checkpoint capture, resume, rehydration and stable executor-identity requirements. Recent 2026 issues show concrete restore failures across process/compute recreation and checkpoint lineage.

## Affected users
Developers building long-running AI workflows, human-in-the-loop approval flows, multi-agent systems, hosted agent runtimes, and platform teams that rely on durable resume after failures or deployment changes.

## Current public evidence
### Observed evidence
1. Microsoft Agent Framework issue #7137 (July 16, 2026) reports that a hosted Python `WorkflowAgent` resumes while compute remains active, but after session compute recreation the pending checkpoint is not restored and execution restarts from the initial executor. Source: https://github.com/microsoft/agent-framework/issues/7137
2. Microsoft Agent Framework issue #4588 (March 10, 2026) reports that resumed workflows could lose deterministic checkpoint ancestry after process restart because newly created checkpoints did not link back to the restored checkpoint. Source: https://github.com/microsoft/agent-framework/issues/4588
3. Microsoft Agent Framework checkpoint documentation (updated August 2026) states that checkpoints capture executor states, pending messages, requests/responses and shared state, and that rehydrated workflows must preserve topology and executor identities. Source: https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints
4. Microsoft Agent Framework issue #5350 (April 19, 2026) reports a checkpoint round-trip where a tool approval request lost its concrete tool-call type, breaking approval resume semantics. Source: https://github.com/microsoft/agent-framework/issues/5350

### Interpretation
The recurring failure class is semantic integrity, not merely storage availability. A durable system needs proof that the restored graph, identity set, pending requests, ancestry and state correspond to the checkpoint the operator intended to resume.

## Existing approaches
- Framework-provided checkpoint storage and resume APIs.
- Stable executor/agent IDs.
- Persisted workflow state callbacks.
- Human-in-the-loop request/response persistence.
- Logs and replay artifacts.

## Remaining limitations
- Successful deserialization does not prove correct resume position.
- A workflow can restart or duplicate work without an explicit invariant violation being surfaced.
- Checkpoint ancestry can become non-auditable even when execution appears to continue.
- Topology/identity drift may only fail after a long-running session is resumed.
- Approval/request state can be replayed or lost after serialization changes.

## Root-cause analysis
1. Restore correctness is inferred from API success instead of verified from state invariants.
2. Workflow topology and executor identities are not always versioned with checkpoints.
3. Parent checkpoint lineage is not independently validated.
4. Pending/answered request sets lack deterministic reconciliation checks.
5. Resume regression tests often cover happy-path continuity but not process recreation or schema/type evolution.

## Improvement opportunity
Add a portable semantic-integrity gate around checkpoint artifacts. Validate ancestry, workflow signature, executor identity set, iteration monotonicity, pending-vs-answered request consistency, and the first checkpoint created after resume. Require a resume acceptance record before long-running work proceeds.

## Goal
Detect incorrect or ambiguous resume before duplicate/unsafe work is allowed to continue.

## Metrics
- resume integrity pass rate
- ancestry continuity failures
- topology/executor identity mismatches
- duplicate answered-request replays
- iteration rollback/restart detections
- recovery time from a rejected resume
- verified-resume coverage for long-running workflows

## Trigger
Process restart, hosted compute recreation, deployment/version change, manual checkpoint restore, human-approval continuation, or checkpoint schema migration.

## Inputs
Checkpoint JSONL export plus expected workflow signature/executor identities when available.

## Outputs
Machine-readable integrity report, blocking exit code and evidence suitable for independent review.

## Proposed solution
A deterministic checker plus rules, investigation skill, resume-verification workflow, independent reviewer and pre-resume hook. It does not inspect or expose hidden model reasoning; it checks observable workflow state and evidence.

## Relevant sources
- Issue #7137: https://github.com/microsoft/agent-framework/issues/7137
- Issue #4588: https://github.com/microsoft/agent-framework/issues/4588
- Checkpoint docs: https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints
- Issue #5350: https://github.com/microsoft/agent-framework/issues/5350
