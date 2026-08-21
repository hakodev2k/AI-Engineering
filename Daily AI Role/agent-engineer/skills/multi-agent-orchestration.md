# Skill: Multi-Agent Orchestration

**Purpose:** Coordinate specialized agents without duplicated ownership or contradictory side effects.

**Trigger:** Work contains independent research, implementation, review, verification, or domain-specialized streams.

**Inputs:** task graph, shared context, dependencies, agent capabilities, tools, deadlines, risk.

## Procedure
1. Build a DAG of tasks and mark blocking dependencies.
2. Assign one owner per task and one final accountable coordinator.
3. Parallelize independent read/research tasks first.
4. For shared resources, define serialization, locking, branch/workspace isolation, or merge ownership.
5. Define subagent output contract: findings, evidence, assumptions, changes, unresolved questions, recommended next action.
6. Synchronize only at dependency boundaries or material discoveries.
7. Resolve conflicts using evidence and task authority, not majority vote.
8. Run independent review/verification before consolidation for high-risk outputs.

**Constraints:** bounded delegation depth; no circular task ownership; no agent self-approval for high-risk work.

**Output:** orchestration graph, owners, synchronization points, merge strategy, final review path.

**Failure:** if agents disagree, freeze shared mutation and route evidence to coordinator.

**Stop:** all critical-path tasks are complete or explicitly blocked, consolidated, and verified.