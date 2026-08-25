# Security Posture Management

## Purpose
Continuously identify and prioritize unsafe cloud states.

## Scope
Cloud security posture findings, policy violations, exposure findings, asset context, and remediation workflows.

## MUST
- Posture coverage MUST include all in-scope cloud boundaries or explicitly identify gaps.
- Findings MUST be prioritized using exposure, privilege, asset criticality, exploitability, and control context.
- Critical recurring findings MUST trigger root-cause analysis rather than repeated manual cleanup.
- Material posture exceptions MUST have accountable owners and expiry.

## MUST NOT
- MUST NOT use aggregate posture scores as the sole basis for risk decisions.
- MUST NOT suppress findings globally when only a bounded exception is justified.
- MUST NOT claim remediation until effective configuration is verified.

## SHOULD
- Convert recurring high-confidence findings into preventive guardrails.
- Track mean age, recurrence, and exception debt.

## Exceptions
Require scope, reason, evidence, compensating controls, owner, expiry, and approval.

## Verification
Inspect inventory coverage, finding samples, effective configuration, exception records, remediation evidence, and trend metrics.