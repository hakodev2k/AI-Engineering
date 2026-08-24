# Skill — Approval Lifecycle Diagnosis

## Purpose
Determine whether a tool/agent trace supports a causal conclusion about execution latency or HITL behavior.

## Trigger
Use after an approval-gated operation, on an apparent tool timeout/slowness anomaly, after an interrupt/reject bug, or before changing implementation based on measured latency.

## Inputs
Lifecycle JSONL, framework/runtime version, tool name, optional user-visible timestamps, and the proposed technical conclusion.

## Preconditions
Trace timestamps must be monotonic or convertible to a monotonic sequence. Call IDs must be available or reconstructed conservatively.

## Required context
Only observable lifecycle events, tool outputs, approval decisions, and runtime logs. Do not request hidden chain-of-thought.

## Allowed tools
Trace readers, `scripts/audit_approval_trace.py`, framework documentation, issue trackers, unit tests, and timing instrumentation.

## Constraints
Never infer execution duration from request-to-result wall time when approval is present. Never convert a rejection into retry permission. Never weaken an approval boundary to simplify measurement.

## Procedure
1. Identify the call and its immutable ID.
2. Extract ordered lifecycle states and timestamps.
3. Run the deterministic auditor.
4. Separate queue/preparation, approval wait, execution, and post-processing intervals.
5. Record facts and missing evidence.
6. Test the hypothesis: did the suspected latency occur during `executing`?
7. If not, reject the performance hypothesis and classify the dominant interval correctly.
8. Check for interrupt-as-error and rejected-then-executed violations.
9. Require an independent reviewer for any design change derived from the trace.

## Decision points
- Audit fails: stop; repair instrumentation/state propagation first.
- Execution timing missing: label performance conclusion unsupported.
- Approval dominates wall time: report approval latency separately; do not optimize the tool.
- Rejected call executes: treat as blocking integrity/security defect.

## Expected output
Facts, lifecycle timeline, interval breakdown, supported/unsupported hypotheses, decision, risks, and verification status.

## Metrics
Invalid transitions, timing attribution errors, execution-only duration coverage, and unsupported conclusion count.

## Verification
Re-run the same scenario with controlled approval delay (for example immediate versus delayed approval). Execution-only duration SHOULD remain stable within the workload's normal variance while end-to-end duration changes.

## Failure handling
Capture the smallest trace that preserves the defect. Maximum two instrumentation revisions before escalation.

## Stop conditions
Stop when the lifecycle audit passes and the claimed causal relationship is supported by execution-only evidence, or when required evidence cannot be obtained without weakening approval controls.
