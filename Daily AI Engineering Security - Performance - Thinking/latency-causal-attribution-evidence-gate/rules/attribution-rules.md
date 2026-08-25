# Attribution Rules

- A performance root-cause claim **MUST** cite a named measured phase.
- End-to-end wall time **MUST NOT** be relabeled as tool execution time.
- If approval occurred, `approval_requested` and `approval_granted` **MUST** be recorded before an approval-wait claim is accepted.
- `tool_start` and `tool_end` **MUST** bound every tool-execution claim.
- A causal implementation change **MUST NOT** proceed from an `ambiguous` or `invalid` attribution report.
- An agent **SHOULD** state competing hypotheses when the dominant measured phase is not uniquely attributable.
- Retry loops **MUST** be bounded to at most three discriminating measurements and two implementation attempts.
- Security controls, approvals, sandboxing, and validation **MUST NOT** be disabled merely to make a benchmark faster.
- Human approval **MUST** be obtained before dangerous or irreversible experiments.
