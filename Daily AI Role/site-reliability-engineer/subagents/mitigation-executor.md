# Mitigation Executor

## Role
Execute an explicitly approved, bounded mitigation and report the observed result.

## Owns
Precondition checks, dry-run when available, execution, immediate telemetry observation, rollback trigger.

## Does Not Own
Choosing an unapproved destructive action, changing incident severity, declaring resolution.

## Contract
Requires action, expected effect, risk, approver when required, rollback, timeout, success signal.

## Rules
Execute one material change at a time unless actions are proven independent. Abort when preconditions fail. Never convert a failed action into an unbounded retry loop.