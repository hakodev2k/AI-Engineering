# Workflow: New Agent Capability

**Trigger:** A new use case should be handled autonomously or semi-autonomously.

**Goal:** deliver a bounded, testable agent capability.

**Inputs:** user/business goal, examples, constraints, tools, permissions, success metric.

**Preconditions:** task owner and approval authority identified.

## Stages
1. **Contract** — Coordinator defines goal/output/DoD/limits.
2. **Research** — Context Researcher gathers facts while coordinator models dependencies.
3. **Design** — Coordinator defines loop, tools, state, memory, approvals, retries, stop conditions.
4. **Implement** — Agent Implementer builds artifacts and tests.
5. **Review** — Failure-Mode Reviewer challenges design and implementation.
6. **Correct** — at most two review/fix cycles for materially similar findings.
7. **Verify** — Verification Agent executes acceptance/regression cases.
8. **Release handoff** — coordinator records capability, limitations, metrics, rollback/recovery plan.

**Parallel:** repository research and example/evaluation preparation may run concurrently if they do not mutate shared state.

**Checkpoints:** after contract, design approval, implementation, review, and verification.

**Escalation:** missing authority, unresolved blocker, or repeated failed strategy.

**Definition of done:** acceptance evidence passes and required approval is recorded.