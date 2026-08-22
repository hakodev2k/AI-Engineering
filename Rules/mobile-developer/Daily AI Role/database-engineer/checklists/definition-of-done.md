# Definition of Done

A meaningful Database Engineer task is complete only when applicable items are true:

- [ ] Goal, scope, owner, priority, deadline, engine/topology, and affected objects are explicit.
- [ ] Facts, assumptions, evidence, decisions, and unknowns are distinguishable.
- [ ] Business/data invariants and ownership are preserved or intentionally changed with authority.
- [ ] Workload, size/cardinality, locking/concurrency, capacity, replication, and recovery implications were considered.
- [ ] Dependencies and parallel/sequential execution boundaries are explicit.
- [ ] High-risk or destructive actions received required human approval.
- [ ] Rollback or roll-forward is realistic for the observed state.
- [ ] Retries were bounded; ambiguous writes were not blindly repeated.
- [ ] Verification covers schema/data correctness plus application/workload health.
- [ ] Performance claims use comparable before/after evidence.
- [ ] Recovery claims use restore evidence when material.
- [ ] Independent verification occurred when required.
- [ ] Remaining risks, cleanup, handoff, owner, and due date are recorded.
- [ ] Failure learning, when applicable, follows Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention.
