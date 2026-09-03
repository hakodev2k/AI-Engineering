# Registry Governance Rules

## Purpose
Keep authoritative contract registries trustworthy and operationally safe.

## Scope
Applies to schema registries, contract catalogs, metadata stores, and other systems used to publish governed contract definitions.

## MUST
- The authoritative registry for each contract class MUST be explicitly identified.
- Published contract artifacts MUST be immutable or versioned so historical consumer behavior can be reconstructed.
- Registry write permissions MUST follow least privilege and be auditable for critical contracts.
- Promotion between environments MUST preserve contract identity and version relationships.

## MUST NOT
- Competing registries MUST NOT both claim authority for the same contract without a documented precedence rule.
- Production contract definitions MUST NOT be edited manually outside the approved change path when automated governance exists.
- Registry availability MUST NOT be treated as proof of contract correctness.

## SHOULD
- Registry metadata SHOULD include owner, lifecycle state, compatibility policy, and documentation references.
- CI SHOULD publish or validate contracts through controlled automation.

## Exceptions
Exceptions require documented authority, bounded duration, audit trail, and remediation plan.

## Verification
Inspect registry permissions, version history, publication workflows, environment promotion records, and authoritative-source documentation.