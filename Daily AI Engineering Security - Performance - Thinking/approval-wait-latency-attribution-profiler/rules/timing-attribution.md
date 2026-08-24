# Rules: Timing Attribution

1. Approval wait, tool execution, model continuation, and total wall-clock MUST be represented as separate metrics when an operation is approval-gated.
2. A tool-performance claim MUST use execution-only timing or an equivalent backend/server measurement.
3. Total wall-clock MAY be used for user-perceived latency, but MUST NOT be relabeled as tool execution latency.
4. Performance decisions MUST NOT be made from a trace whose lifecycle ordering is invalid or whose phase boundaries are missing.
5. Approval/security controls MUST NOT be weakened merely to improve execution benchmarks.
6. Progress messages SHOULD identify waiting-for-approval explicitly and SHOULD NOT invent a technical cause for elapsed time while execution has not started.
7. Every event used for attribution MUST carry a stable call identifier and compatible clock domain.
8. Baseline and post-change measurements MUST use comparable workload and approval policy.
9. Unattributed intervals SHOULD be reported rather than silently assigned to execution.
10. Any architectural or tool-choice change justified by latency SHOULD receive independent verification of the underlying timing evidence.
