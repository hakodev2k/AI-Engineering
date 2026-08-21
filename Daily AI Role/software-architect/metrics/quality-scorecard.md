# Architecture Quality Scorecard

Use the scorecard to expose gaps, not to replace professional judgment. Score each dimension 0–2: 0 = missing/blocking, 1 = partial, 2 = sufficient for the current decision stage.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Objective & scope | unclear | partly defined | explicit, owned, measurable |
| Requirement traceability | absent | partial | major decisions traceable |
| NFRs | adjectives/unknown | some targets | critical targets quantified |
| Boundaries & data | unclear | partial | ownership/flows explicit |
| Security | unreviewed | basic controls | trust/data risks reviewed |
| Reliability | failure ignored | partial | failure/recovery credible |
| Operability | no telemetry/owner | partial | observable and owned |
| Cost/performance | unsupported | assumptions only | workload/evidence bounded |
| Migration/rollback | missing | partial | staged and credible |
| Verification | “test later” | generic | measurable evidence plan |
| Decision rationale | undocumented | weak alternatives | ADR-quality trade-offs |
| Approval | authority unclear | pending | correct owner recorded |

## Gate
- Any 0 in Security, Reliability, Migration/Rollback, Verification, or Approval is blocking when that dimension is material.
- A major design should normally score at least 20/24 before `verified`; exceptions require explicit residual-risk acceptance.
- Record why a dimension is not applicable rather than silently awarding points.