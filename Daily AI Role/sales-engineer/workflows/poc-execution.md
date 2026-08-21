# Workflow: POC Execution

**Trigger:** A material technical uncertainty blocks a customer decision.
**Goal:** Produce bounded evidence against predeclared success criteria.

## Stages
1. Define decision question, hypothesis, baseline, scope, success thresholds, owners, approvals, and stop conditions.
2. Freeze environment/test-data contract.
3. Prepare test harness and observability.
4. Execute independent test dimensions in parallel only when they do not mutate shared state.
5. Consolidate evidence at each checkpoint.
6. Review failures; retry at most twice only for understood transient/setup causes.
7. Conclude pass/fail/inconclusive/blocked without moving thresholds retrospectively.
8. Produce decision record and cleanup environment.

**Failure path:** Escalate when dependency, authority, data, security, or product gap prevents valid testing.
**DoD:** Evidence is reproducible enough for the decision owner; cleanup complete; next decision explicit.