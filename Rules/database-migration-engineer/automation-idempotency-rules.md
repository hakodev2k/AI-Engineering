# Automation and Idempotency

## Purpose
Make migration execution repeatable, controlled, and safe under retries.

## Scope
Covers scripts, migration frameworks, orchestration, checkpoints, and operator tooling.

## MUST
- Automation MUST detect current state before applying state-sensitive actions.
- Retryable steps MUST be idempotent or explicitly guard against duplicate effects.
- Scripts MUST fail visibly on unexpected states and preserve diagnostic evidence.

## MUST NOT
- MUST NOT silently swallow failed statements or continue after violated safety preconditions.
- MUST NOT embed environment-specific credentials or destructive defaults in reusable scripts.

## SHOULD
- Support dry-run or plan output for consequential changes where technically feasible.
- Separate preparation, validation, execution, and cleanup stages so approval boundaries remain clear.

## Exceptions
One-shot manual commands require peer review, captured command text, bounded scope, and equivalent validation.

## Verification
Run scripts repeatedly in test environments, inspect exit behavior, checkpoints, state guards, diffs, and failure-path tests.