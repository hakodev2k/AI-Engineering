# Orchestration and Dependency Rules

## Purpose
Ensure warehouse pipelines execute in a controlled, observable, dependency-safe manner.

## Scope
Applies to schedulers, DAGs, dependencies, retries, backfills, triggers, and workflow state.

## MUST
- Pipeline dependencies MUST represent true data readiness requirements rather than incidental job ordering.
- Retries MUST be safe for repeated execution and MUST define bounded retry behavior.
- Backfills MUST declare scope, expected load, downstream impact, and completion checks.
- Critical workflows MUST expose ownership, timeout behavior, and failure escalation.

## MUST NOT
- MUST NOT use arbitrary sleep delays as a substitute for readiness checks.
- MUST NOT trigger destructive or expensive replay operations without validating scope.

## SHOULD
- Prefer event or state-based readiness over clock-based assumptions where practical.
- Orchestration SHOULD keep business transformation logic outside scheduler configuration.

## Exceptions
Manual sequencing requires documented reason, operator steps, and verification criteria.

## Verification
Inspect DAGs, retry policies, dependency definitions, backfill procedures, and execution history.