# Workflow: Measure → Diagnose → Cleanup → Verify

## Trigger
Budget warning/hard breach, repeated task resource growth, or cleanup postcondition failure.

## Goal
Return resource usage to a bounded steady state without terminating unrelated resources or weakening security.

## Inputs
Workload definition, task/session IDs, budget configuration, baseline and lifecycle ledger.

## Baseline
Capture process count, owned process count, browser tabs/pages, MCP clients, RSS/private bytes, CPU, handles, and machine responsiveness proxy before the task.

## Stages
1. **Observe** — capture baseline and ownership map.
2. **Measure** — run one bounded workload and sample start/peak/end resources.
3. **Diagnose** — identify expired leases, duplicate helpers, unreaped processes, abandoned pages, or replacement-without-retirement paths.
4. **Hypothesize** — state one lifecycle defect and predicted metric change.
5. **Implement** — modify ownership/lease/shutdown behavior.
6. **Measure again** — execute the same workload for three cycles.
7. **Failure-path check** — repeat with cancellation or controlled timeout.
8. **Independent verify** — Resource Leak Verifier returns PASS/BLOCK.

## Responsible agent
Lifecycle implementer performs changes; Resource Leak Verifier independently verifies.

## Tools
`scripts/resource_snapshot.py`, OS/browser/MCP inventory, workload runner, logs.

## Outputs
Before/after snapshots, ownership ledger, cleanup log, benchmark comparison, verification report.

## Checkpoints
- Baseline exists before optimization.
- Ownership is proven before destructive cleanup.
- New-resource creation stops at hard budget.
- Three-cycle plateau is measured before claiming improvement.

## Metrics
Peak memory/CPU, owned helpers, orphan count, pages/clients, cleanup latency, resource slope per completed task.

## Retry policy
Maximum two remediation cycles; each must test a different evidence-backed hypothesis.

## Stop conditions
Unknown ownership requiring destructive action, hard budget still violated after two cycles, no measurable improvement, or security boundary would need weakening.

## Failure path
Block new task work, preserve diagnostic evidence, perform only ownership-proven graceful cleanup, then escalate for operator review.

## Verification
PASS requires stable plateau and cleanup on normal + cancellation/timeout terminal paths.

## Definition of Done
Baseline captured, root cause documented, change implemented, three repeated cycles measured, cancellation/failure cleanup verified, no unrelated resource terminated, hard budgets respected, independent verifier PASS.