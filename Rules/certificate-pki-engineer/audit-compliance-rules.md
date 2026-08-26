# PKI Audit and Compliance Rules

## Purpose
Provide trustworthy evidence that PKI controls operate as designed.

## Scope
Policies, ceremonies, issuance, revocation, privileged access, configuration, and evidence retention.

## MUST
- Audit evidence MUST be attributable, time-correlated, access-controlled, and retained according to applicable policy.
- Control claims MUST be supported by configuration, logs, tests, or independently reviewable records.
- Material policy deviations MUST record scope, rationale, risk, approver, compensating controls, and expiry.
- Privileged PKI activity MUST be reviewable independently of the operator who performed it.

## MUST NOT
- MUST NOT treat undocumented operator knowledge as sufficient control evidence.
- MUST NOT alter audit records to make a control appear compliant.
- MUST NOT expose private key material or secrets in evidence packages.

## SHOULD
- Evidence collection SHOULD be automated where automation preserves integrity and context.

## Exceptions
Evidence gaps require explicit finding, risk assessment, owner, and remediation date.

## Verification
Sample records end-to-end, compare policy to effective configuration, review privileged logs, and validate evidence integrity.