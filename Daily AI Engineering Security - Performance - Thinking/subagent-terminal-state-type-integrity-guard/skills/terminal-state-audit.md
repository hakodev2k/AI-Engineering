# Skill: Terminal-State Audit

## Purpose
Verify that a child-agent success claim is supported by observable terminal and deliverable evidence.

## Trigger
Run on child completion notifications, missing/partial output incidents, runtime upgrades, or before parent completion.

## Inputs
Normalized terminal JSONL, raw child transcript/status when available, dispatch identity, expected deliverable contract.

## Preconditions
Raw lifecycle data is preserved. The implementer does not rewrite evidence before review.

## Required context
Child ID, task ID, dispatch generation, declared status, terminal state/reason, required deliverable type, tool/descendant counts.

## Allowed tools
Read-only logs/transcripts, hashing/diffing, `scripts/subagent_status_guard.py`.

## Constraints
Use only observable fields. Do not request hidden chain-of-thought. Do not infer success from plausible prose alone. Do not auto-retry state-changing tasks.

## Procedure
1. Capture raw child terminal notification and transcript tail.
2. Establish baseline counts for success labels vs supported completions.
3. Normalize the event using the schema.
4. Run the deterministic validator.
5. Record Facts, Evidence, Assumptions, Hypotheses, Decision, Risks, Verification status.
6. If status is success, verify terminal state=`completed`, benign reason, deliverable evidence, zero unresolved tools and zero live descendants.
7. Verify task and dispatch generation match the current parent dispatch.
8. If contradictory, classify as incomplete/failed and diagnose the responsible adapter/runtime layer.
9. Retry normalization/reconciliation at most twice.
10. Require independent reviewer confirmation before the parent treats delegated work as complete.

## Decision points
Supported terminal completion → success eligible. Contradiction → incomplete. Explicit failure/cancel/limit → failed or incomplete per host semantics, never success. Missing evidence → incomplete.

## Expected output
Reproducible validator report and parent-safe classification with evidence references.

## Metrics
Unsupported success %, re-dispatch count, verification coverage, reconciliation time.

## Verification
A separate reviewer reproduces the classification from the same raw evidence.

## Failure handling
Parser/schema failure blocks success. Conflicting sources after two attempts escalate.

## Stop conditions
Verified completion, safe non-success classification, or retry exhaustion.