# Payment Incident Response Rules

## Purpose
Control financial risk during payment incidents while preserving evidence and recoverability.

## Scope
Provider outages, duplicate charges, incorrect refunds, reconciliation breaks, security events, and payment-processing degradation.

## MUST
- Payment incidents MUST establish a clear incident commander and financial-impact owner.
- Triage MUST distinguish customer experience impact from actual financial-state impact.
- Containment actions that can change money movement MUST require explicit authorization proportional to risk.
- Investigations MUST preserve transaction identifiers, provider evidence, logs, metrics, traces, reconciliation data, and timeline.
- Recovery MUST include verification that duplicate, missing, or incorrect financial effects are identified and corrected.

## MUST NOT
- MUST NOT perform destructive data edits to make payment state appear consistent.
- MUST NOT replay uncertain financial operations without idempotency and reconciliation evidence.
- MUST NOT declare resolution solely because error rate returned to normal.

## SHOULD
- Post-incident review SHOULD identify control gaps, detection gaps, and financial exposure.

## Exceptions
Emergency actions require recorded approver, reason, scope, and retrospective review.

## Verification
Inspect incident timelines, approvals, evidence sets, corrective postings, reconciliation closure, and follow-up actions.