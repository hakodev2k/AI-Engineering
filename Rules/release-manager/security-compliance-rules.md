# Security and Compliance Release Rules

## Purpose
Ensure release speed never bypasses security, privacy, regulatory, or audit obligations.

## Scope
Applies to security findings, access changes, secrets, sensitive data, compliance controls, and regulated release requirements.

## MUST
- Security and compliance gates MUST be selected according to system classification, release scope, and applicable obligations.
- Unresolved material findings MUST identify severity, exploitability or impact, owner, treatment, residual risk, and approval status.
- High-risk access changes, secret rotation, security-control changes, and sensitive-data changes MUST receive required human approval before execution.
- Security claims MUST be supported by scans, tests, configuration inspection, threat analysis, or equivalent evidence.
- Required audit evidence MUST be retained according to governing policy.

## MUST NOT
- Security controls MUST NOT be weakened merely to unblock a release.
- A scanner being unavailable MUST NOT be recorded as a passed security gate.
- Sensitive findings or credentials MUST NOT be exposed in broadly distributed release communications.

## SHOULD
- Security review SHOULD occur early enough to remediate findings without release-window pressure.
- Compensating controls SHOULD be measurable and time-bounded.

## Exceptions
A security or compliance exception requires documented finding, business context, alternatives, residual risk, compensating controls, expiry/remediation, and approval from the authorized risk owner.

## Verification
Review security test results, dependency findings, configuration diffs, access/secret changes, exception records, approvals, and audit retention evidence.