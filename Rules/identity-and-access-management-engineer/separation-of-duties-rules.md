# Separation of Duties Rules

## Purpose
Prevent a single identity from controlling incompatible steps in high-risk processes.

## Scope
Conflicting roles, privileged workflows, approvals, financial or operational controls, and toxic access combinations.

## MUST
- Material conflicts MUST be defined, documented, and mapped to effective permissions.
- High-risk access requests MUST be checked for toxic combinations before approval.
- Conflicts that cannot be removed MUST have explicit compensating controls and independent oversight.
- SoD policy changes MUST be reviewed by relevant security and business control owners.
- Conflict findings MUST be remediated or formally accepted with expiry.

## MUST NOT
- MUST NOT rely solely on role names when nested or inherited privileges can create a conflict.
- MUST NOT allow the requester to be the sole approver of a conflict exception.
- MUST NOT leave compensating controls undefined or unverifiable.

## SHOULD
- Automated preventive checks SHOULD block known toxic combinations before provisioning.
- Detective controls SHOULD monitor unavoidable conflicts for suspicious use.

## Exceptions
Require conflict description, business necessity, risk assessment, compensating controls, independent approval, and expiry.

## Verification
Inspect SoD matrices, effective-access analysis, blocked requests, exception records, monitoring evidence, and remediation closure.