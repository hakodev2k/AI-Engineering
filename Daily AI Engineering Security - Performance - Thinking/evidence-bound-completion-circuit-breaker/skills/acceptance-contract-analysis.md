# Skill: Acceptance Contract Analysis

## Purpose
Convert a task's observable done-condition into verifiable readiness transitions without exposing hidden reasoning.

## Trigger
Before a long/tool-heavy task, after user correction, after compaction/handoff, or before any completion claim.

## Inputs
User goal; target environment/artifact; required readiness; available tests/probes; risk constraints; current evidence ledger.

## Preconditions
Acceptance must be observable. High-risk probes need approval.

## Required context
Facts, assumptions, evidence IDs, unresolved blockers, current readiness, target identity.

## Allowed tools
Read-only state inspection, tests, approved deployment probes, repository tools, deterministic readiness guard.

## Constraints
Evidence MUST be from the declared target and MUST carry timestamp/outcome. Do not substitute a component proxy unless contract explicitly permits it.

## Procedure
1. State target artifact/environment and requested readiness.
2. Decompose acceptance into machine-checkable criteria.
3. Mark assumptions separately from facts.
4. Map each criterion to evidence source and freshness window.
5. Capture baseline evidence and missing criteria.
6. Implement changes only after contract exists.
7. Refresh evidence after material changes/user correction.
8. Run guard before any readiness claim.
9. Hand final ledger to independent reviewer.

## Decision points
Missing target evidence -> BLOCK. Stale evidence -> refresh. Repeated unchanged evidence over budget -> replan/stop. Target validated but release not observed -> do not claim released.

## Expected output
Contract, evidence ledger, readiness state, blockers, verification status.

## Metrics
Evidence coverage %, freshness %, unsupported claims, calls/time without evidence advance, rework after completion.

## Verification
Independent reviewer reproduces required evidence and guard decision.

## Failure handling
Refresh once; replan once; then stop/escalate with concrete blockers.

## Stop conditions
Acceptance achieved and independently verified, or circuit breaker exhausted.