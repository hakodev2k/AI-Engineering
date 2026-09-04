# Third-Party Supplier Rules

## Purpose
Manage security risk introduced by vendors, external maintainers, hosted build services, and software suppliers.

## Scope
Applies to commercial software vendors, SaaS build services, external development partners, managed registries, and other suppliers that influence production software.

## MUST
- Critical suppliers MUST be classified by the impact of compromise, outage, or unauthorized access.
- Security review MUST assess supplier access, update mechanisms, incident notification, vulnerability handling, and software provenance where relevant.
- Supplier integrations MUST use least privilege and revocable credentials.
- Contracts or operating agreements for critical suppliers MUST define security responsibilities and incident communication expectations where the organization controls contracting.
- Material supplier security changes MUST trigger reassessment when they alter trust boundaries.

## MUST NOT
- Supplier assurances MUST NOT substitute for technical validation where independent verification is practical.
- Persistent supplier access to production or signing systems MUST NOT be broader than necessary.

## SHOULD
- Critical supplier dependencies SHOULD have exit, replacement, or containment strategies.
- Supplier security evidence SHOULD be refreshed periodically based on risk.

## Exceptions
Exceptions require business justification, documented residual risk, compensating controls, expiry or review date, and accountable approval.

## Verification
Review supplier inventories, security assessments, access logs, credential scopes, contractual controls, incident procedures, and technical integration tests.