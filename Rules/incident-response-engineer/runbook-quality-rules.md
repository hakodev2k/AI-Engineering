# Runbook Quality Rules

## Purpose
Keep operational procedures safe, executable, and useful under incident pressure.

## Scope
Runbooks, playbooks, emergency procedures, diagnostic guides, and recovery instructions.

## MUST
- State prerequisites, scope, expected outcomes, safety checks, verification, rollback, and escalation points for consequential procedures.
- Validate commands and environment assumptions against supported system versions.
- Identify actions requiring elevated privileges or human approval.
- Update runbooks when incidents reveal incorrect, missing, or dangerous guidance.

## MUST NOT
- Include plaintext credentials, reusable secrets, or unbounded destructive commands.
- Present environment-specific commands as universally safe without target validation.

## SHOULD
- Automate deterministic, frequently repeated, low-ambiguity steps while preserving approval boundaries for dangerous actions.

## Exceptions
Temporary incident notes may precede formal runbook updates, but discovered operational knowledge MUST be captured before follow-up closure when materially reusable.

## Verification
Exercise runbooks in safe environments or game days, inspect commands and permissions, and compare procedures with current architecture and incident findings.