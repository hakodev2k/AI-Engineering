# Rules: Resume Addressability

1. A workflow with more than one effective pending interrupt MUST reject an unaddressed scalar resume value.
2. Every pending interrupt MUST have a stable, non-empty identifier before resumption.
3. Effective pending interrupts MUST be computed across task and subgraph nesting, not only from top-level task count.
4. Pending interrupt identifiers MUST be unique; duplicate IDs MUST block resume.
5. Multi-interrupt resume values MUST be keyed by interrupt ID.
6. Resume maps MUST NOT contain unknown interrupt IDs.
7. Display order, array position, task order, or incidental scheduling order MUST NOT be used to infer which interrupt a scalar value targets.
8. Partial addressed resume SHOULD be allowed only when unresolved interrupt IDs remain durably pending and the host verifies that postcondition.
9. A resumed value MUST be consumed only by the explicitly addressed interrupt.
10. The host MUST compare the post-resume pending set with the predicted remaining set before claiming the decision was applied correctly.
11. Retry loops MUST be bounded to at most 2 remediation attempts and MUST require changed evidence or implementation.
12. Any ambiguous or contradictory mapping MUST stop execution and require explicit re-addressing rather than guessing.
