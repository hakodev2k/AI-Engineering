# Workflow — Inventory, Implement, Reverify

## Trigger
A task depends on exhaustive repository scope or current durable project state.

## Goal
Prevent work from starting or finishing on a partial, stale, or inherited evidence set.

## Inputs
Task, acceptance criteria, repository roots, inventory config, checkpoint/handover records.

## Baseline
Before mutation, record required evidence classes, inventory counts, manifest hash, authoritative-state claims, and exhaustive denominator.

## Stages
1. **Observe** — parse deliverable and identify scope-sensitive words/claims.
2. **Measure baseline** — run deterministic inventory and read current authoritative artifacts.
3. **Diagnose gaps** — list unresolved evidence classes and checkpoint conflicts.
4. **Form hypothesis** — if scope is incomplete, state where missing evidence is likely and why.
5. **Expand search** — at most two evidence-driven expansions.
6. **Implement** — only when material required classes are resolved.
7. **Measure again** — regenerate inventory after mutation.
8. **Classify deltas** — separate implementation outputs from newly discovered missed inputs.
9. **Independent verification** — Scope Evidence Verifier checks scope and claims.
10. **Complete** — only with verified evidence coverage and acceptance criteria.

## Responsible agent
Planning/implementation owner for stages 1–8; `scope-evidence-verifier` for stage 9.

## Tools
Repository search/read, Git, `scripts/check_inventory.py`, manifest comparison, test/build tools appropriate to the project.

## Outputs
Baseline manifest, gap analysis, implementation evidence, final manifest, delta classification, independent verdict.

## Checkpoints
- No mutation before baseline for scope-sensitive tasks.
- Exhaustive denominator exists before progress/completion claims.
- Search expansions are justified by new evidence.
- Current artifacts override stale checkpoint prose.
- Final inventory is compared to baseline.

## Metrics
Required evidence coverage, denominator established rate, newly discovered missed-input count, unsupported claim count, rework rate.

## Retry policy
Maximum two search expansions before implementation and maximum one implementation rework cycle for newly discovered missed inputs.

## Stop conditions
Success: all required classes resolved, final delta explained, independent verification passes. Failure: two search expansions fail, authority remains contradictory, or one rework cycle still leaves missed inputs.

## Failure path
Do not weaken scope or mark missing evidence absent. Persist the manifest/gaps, report blocked status, and escalate to a human for repository-boundary clarification or authoritative-state resolution.

## Verification
Independent rerun of inventory plus direct reads of material source-of-truth artifacts.

## Definition of Done
Implemented: requested repository changes exist. Measured: baseline/final inventories and acceptance evidence exist. Verified: no unexplained missed inputs, required evidence coverage is complete, durable-state claims are supported, tests/verification pass, and no blocking issue remains.