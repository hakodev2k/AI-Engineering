# Rules: Reviewer Arbitration

- The active acceptance contract MUST remain immutable during a remediation round.
- A reviewer finding MUST identify an approved `criterion_id` before it can block completion.
- A blocking finding MUST be present in or directly caused by the reviewed diff.
- A blocking finding MUST be reproducible under the declared production assumptions.
- A blocking finding MUST explain how leaving it unfixed causes the original acceptance criterion to fail.
- Reviewer severity MUST NOT by itself authorize implementation work or plan expansion.
- Unmapped, unreproducible, or non-blocking findings MUST be deferred from the active task.
- Deferred findings SHOULD be preserved for later triage; they MUST NOT silently mutate the current plan.
- Material scope expansion MUST require explicit scope-owner approval.
- The implementing agent MUST NOT be the only verifier of completion.
- Review/remediation loops MUST be bounded to at most three remediation rounds for one task slice.
- A round that produces no progress on an original acceptance criterion MUST trigger re-evaluation before another remediation round.
- Completion MUST distinguish `Implemented`, `Measured`, and `Verified`.
