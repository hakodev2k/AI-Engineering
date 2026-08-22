# Workflow: Bounded Fix → Verify

## Trigger
A coding task changes repository state or a verifier reports failure.

## Goal
Reach a defensible completion state with proportional verification and bounded rework.

## Inputs
Task requirements, changed files, verification contract, current tree, previous evidence.

## Baseline
Capture current tree SHA, existing failing checks, verification duration/cost, and known requirements before changes.

## Stages
1. **Observe** — collect facts and current failures.
2. **Plan** — classify risk and select required checks.
3. **Hypothesis** — state a concise testable cause/expected effect, not hidden reasoning.
4. **Implement** — make the smallest scoped change.
5. **Focused verify** — run contract-approved targeted checks and record evidence.
6. **Evaluate** — if failed, update facts/hypothesis; do not repeat an unchanged attempt.
7. **Final verify** — run all final checks required for the risk level on the current tree.
8. **Independent review** — Independent Verifier validates evidence.
9. **Complete or block** — only PASS permits completion language.

## Responsible agents
Implementation agent changes code; Independent Verifier owns final evidence decision.

## Tools
Repository tools, configured check commands, `scripts/verify_evidence.py`.

## Outputs
Evidence records, before/after verification metrics, final PASS/BLOCK status.

## Checkpoints
After scope change: reclassify risk. After each failed check: record evidence. Before final claim: validate tree SHA and evidence freshness.

## Metrics
Attempts/task, unsupported-claim count, required-check coverage, repeated unchanged-tree full-suite count, verification duration/cost, post-completion regression rate.

## Retry policy
Maximum `max_fix_attempts` from the contract, default 3. A retry must address new evidence.

## Stop conditions
PASS; maximum attempts reached; canonical environment unavailable; contradictory evidence; or approval-required action encountered.

## Failure path
Return BLOCKED with failed check, evidence path, current facts, attempted hypotheses, and the smallest next human action. Do not weaken the contract.

## Definition of Done
Requirements mapped to checks; current-tree evidence exists; all required checks pass; no bypass is present; independent verifier passes; metrics recorded; no unresolved blocking risk remains.