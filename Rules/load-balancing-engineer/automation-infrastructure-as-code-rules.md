# Automation and Infrastructure-as-Code Rules

## Purpose
Make traffic infrastructure repeatable, reviewable, and resistant to configuration drift.

## Scope
IaC, configuration generators, deployment automation, controllers, and reconciliation loops.

## MUST
- Production traffic infrastructure MUST have an authoritative declarative or otherwise reproducible source where platform capabilities allow it.
- Automation MUST validate inputs and fail safely on incomplete, ambiguous, or unauthorized configuration.
- Reconciliation loops MUST have bounded rate, clear ownership, and protection against mass destructive changes.
- Automation credentials MUST use least privilege and approved secret handling.
- High-blast-radius automated changes MUST include policy gates or human approval appropriate to risk.

## MUST NOT
- MUST NOT embed secrets in IaC source or generated artifacts.
- MUST NOT allow automation to delete or reroute broad production scope from an unreviewed input change.
- MUST NOT ignore drift indefinitely when runtime state differs from authoritative configuration.

## SHOULD
- Use plan/diff previews and policy-as-code.
- Make automation idempotent and observable.

## Exceptions
Manual emergency changes require later reconciliation and documented reason.

## Verification
Review plans, diffs, IAM, secret references, reconciliation logs, drift reports, policy checks, and destructive-change safeguards.