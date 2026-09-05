# Error Budget Management

## Purpose
Use error budgets to balance delivery velocity with AI-system reliability and prevent chronic instability from becoming normal.

## When to use
Use for production services with defined SLOs, especially before risky launches, provider migrations, major prompt/model changes, or after repeated incidents.

## Inputs
SLOs, recent SLI history, incident impact, deployment calendar, backlog, known reliability risks, launch plans.

## Preconditions
SLOs are measurable and trusted enough to support decisions.

## Context to inspect
Release frequency, incident trends, model/provider changes, alert history, dependency SLAs, planned experiments, technical debt.

## Core knowledge
An error budget is the tolerated unreliability implied by an SLO. It should influence engineering decisions before reliability collapses. For AI systems, budget consumption may include quality or safety regressions when those dimensions are explicitly operationalized.

## Procedure
1. Calculate budget for the evaluation window.
2. Attribute burn to incidents, releases, dependencies, and persistent degradation.
3. Detect fast-burn and slow-burn patterns.
4. Identify which failure modes dominate consumption.
5. Compare remaining budget with planned change risk.
6. Apply predefined policy: proceed, add safeguards, reduce rollout scope, or pause risky change.
7. Prioritize remediation proportional to burn and business impact.
8. Track recovery as reliable operation accumulates.
9. Review whether SLOs or measurement need adjustment.

## Decision points
Pause discretionary risky releases when budget is exhausted unless business leadership explicitly accepts the risk. Do not manipulate windows or exclude incidents merely to restore budget.

## Common failure patterns
Treating budgets as reporting metrics only, ignoring repeated low-grade degradation, excluding provider failures from end-to-end reliability, and making exceptions without recording risk acceptance.

## Verification
Budget calculations reconcile with source metrics and release decisions reference the current burn state.

## Expected output
A current error-budget status, burn analysis, dominant causes, and actionable release/reliability decision.

## Stop conditions
Escalate when telemetry is too unreliable to calculate burn or business asks to override policy for material risk.