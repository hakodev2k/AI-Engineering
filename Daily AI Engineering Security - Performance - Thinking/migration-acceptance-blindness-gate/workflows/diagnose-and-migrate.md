# Workflow: Diagnose and Migrate

## Trigger
A long-horizon repository migration is assigned to an agent.

## Goal
Complete the requested structural transformation without regressing behavior.

## Inputs
Migration contract, repository, test commands, acceptance policy.

## Baseline
Record legacy markers, new-marker absence/presence, full relevant test results, and migration scope.

## Context
Keep Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.

## Stages
1. Observe repository architecture and migration target.
2. Measure baseline tests and legacy residues.
3. Diagnose migration dependencies and blockers.
4. Form a migration hypothesis and decomposition.
5. Implement the smallest coherent migration slice.
6. Measure structural and behavioral evidence.
7. If rejected, re-evaluate at most twice.
8. Hand off to independent verification.

## Responsible agent
Implementation agent; independent verifier only at final verification.

## Tools
Repository search, build/test tools, acceptance guard.

## Outputs
Migration diff, migration report, test results, gate result.

## Checkpoints
After baseline, after each coherent migration slice, before final verification.

## Metrics
Legacy residues, new-marker coverage, tests passed, repair rounds, gate decision.

## Retry policy
Maximum 2 repair rounds.

## Stop conditions
Stop on destructive ambiguity, impossible acceptance invariant, or exhausted repairs.

## Failure path
Return rejected evidence and unresolved causes; do not weaken acceptance.

## Verification
Independent migration verifier must pass.

## Definition of Done
Structural audit passes, tests pass, independent verification passes, and gate returns `accept`.
