# Workflow: Agent Failure Recovery

**Trigger:** timeout, loop stall, bad tool result, partial side effect, invalid state, repeated evaluator failure, or permission error.

**Goal:** restore safe progress without compounding the failure.

## Stages
1. Freeze new consequential actions.
2. Capture current state, trace, tool calls, operation ids, approvals, and external evidence.
3. Classify failure: transient, input/contract, tool, state, memory, orchestration, permission, external dependency, or design.
4. Reconcile external reality before retrying any uncertain write.
5. Choose recovery: retry with backoff, corrected input, alternate tool, re-plan from checkpoint, rollback/compensate with approval, or escalate.
6. Verify state consistency after recovery.
7. Run affected regression cases before resuming normal execution.

**Retry limit:** at most two materially similar retries; then escalate with evidence.

**Human approval:** required for destructive compensation, access changes, irreversible data repair, or policy bypass.

**Definition of done:** safe state restored, root failure class recorded, regression passes, and next execution step is unambiguous.