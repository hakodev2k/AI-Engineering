# Remediation Management Rules

## Purpose
Ensure compliance findings are corrected according to risk and verified before closure.

## Scope
Applies to audit findings, control failures, policy violations, monitoring alerts, exceptions nearing expiry, and assessment gaps.

## MUST
- Every material finding MUST have severity, owner, target resolution date, and defined closure evidence.
- Remediation priority MUST reflect impact, likelihood, exposure duration, and dependency on other controls.
- Closure MUST require verification that the underlying condition is corrected or an approved risk decision exists.
- Repeated findings MUST trigger root-cause analysis or broader control review.

## MUST NOT
- MUST NOT close findings based solely on stated intent or ticket status.
- MUST NOT repeatedly defer high-risk remediation without escalation and renewed approval.

## SHOULD
- Track aging, recurrence, and overdue remediation trends across control domains.

## Exceptions
Deferred remediation requires documented residual risk, compensating controls, revised date, owner, and approval.

## Verification
Inspect finding records, due dates, closure evidence, validation results, escalation history, and recurrence metrics.