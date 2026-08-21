# Workflow: Error Budget Release Control

## Goal
Use reliability performance to adjust release risk rationally.

## Inputs
Current SLO window, error-budget remaining, burn rates, active incidents, proposed release risk, rollback maturity.

## Procedure
1. Validate SLI freshness and SLO calculation.
2. Determine budget state: healthy, watch, critical, exhausted.
3. Evaluate release blast radius, reversibility, necessity, and reliability benefit.
4. For healthy budget, continue normal gate.
5. For watch state, require stronger staged rollout/verification.
6. For critical/exhausted state, pause discretionary high-risk changes; allow emergency fixes or reliability improvements with explicit approval.
7. Record decision and re-evaluation condition.

## Parallelism
Release risk review and SLO evidence validation may run concurrently; final decision waits for both.

## Stop
Decision documented with evidence, owner, and next review condition.