# Enterprise Identity Testing Rules

## Purpose
Assess enterprise directory and identity attack paths while controlling account, domain, and operational risk.

## Scope
Covers directory services, enterprise SSO, service accounts, delegation, trust relationships, credential material, and privilege paths.

## MUST
- MUST map authorized domains, forests, tenants, trusts, privileged groups, and designated test accounts before active identity testing.
- MUST use low-impact enumeration and controlled principals to validate privilege paths.
- MUST assess lockout, replication, authentication, and service-account risks before credential-oriented techniques.
- MUST minimize collection of credential material and protect any obtained secrets with restricted access and prompt disposal.
- MUST document privilege transitions and restore temporary membership or delegation changes.

## MUST NOT
- MUST NOT conduct uncontrolled password spraying, ticket abuse, credential dumping, or domain-wide changes.
- MUST NOT modify privileged groups, trust settings, directory replication rights, or identity policies without explicit approval.
- MUST NOT retain hashes, tickets, keys, or tokens beyond engagement need.
- MUST NOT use unrelated real-user accounts as test subjects without authorization.

## SHOULD
- SHOULD prioritize graph-based attack paths that connect realistic initial access to material privilege.
- SHOULD validate defensive detections when included in objectives.

## Exceptions
Techniques with domain-wide or lockout risk require explicit human approval, monitoring, recovery procedures, and stop criteria.

## Verification
Review directory audit events, test-account inventory, privilege-path evidence, credential-handling records, group/policy diffs, and cleanup confirmation.