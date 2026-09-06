# Incident Closure Rules

## Purpose
Close AI incidents only when service risk is understood, remediation is verified, and remaining work is explicitly owned.

## Scope
Applies to operational closure and transition from active response to follow-up.

## MUST
- Closure MUST confirm containment is no longer required or has been converted into an owned permanent control.
- Material remediation MUST have verification evidence or an explicitly accepted residual risk.
- User, data, safety, security, and external side effects MUST be reconciled or assigned to accountable follow-up owners.
- Remaining uncertainties and corrective actions MUST be documented.
- Temporary access, emergency credentials, debug logging, broad permissions, and incident-only configuration MUST be removed or intentionally retained with approval.
- Severe incidents MUST have a post-incident review scheduled or completed according to policy.

## MUST NOT
- Incidents MUST NOT be closed solely because alerts stopped firing.
- Known critical regressions MUST NOT be hidden in backlog items to satisfy closure metrics.
- Temporary unsafe workarounds MUST NOT silently become permanent architecture.

## SHOULD
- Confirm stakeholder communication is complete and operational ownership has returned to normal teams.
- Track corrective actions separately from active incident status when appropriate.

## Exceptions
An incident may close with unresolved noncritical work only when ownership, priority, risk, and completion criteria are explicit.

## Verification
Review closure checklist, remediation evidence, access/configuration cleanup, residual-risk records, communication status, and follow-up actions.