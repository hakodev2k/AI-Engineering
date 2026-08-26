# Issuance Authorization Rules

## Purpose
Ensure certificate issuance occurs only within explicit authority.

## Scope
Manual and automated issuance paths, RA/CA integrations, templates, and service identities.

## MUST
- Issuance MUST enforce authenticated requester identity, authorized scope, approved profile, and validated identifiers.
- Privileged templates MUST restrict who may enroll and who may modify them.
- Issuance events MUST be logged with certificate serial, profile, requester, issuer, and decision evidence.

## MUST NOT
- MUST NOT permit arbitrary SANs or usages through client-controlled template fields.
- MUST NOT bypass authorization to resolve an operational outage without approved emergency procedure.
- MUST NOT grant broad enrollment rights by default.

## SHOULD
- Authorization SHOULD be policy-as-code where feasible.

## Exceptions
Emergency issuance requires bounded scope, human approval, audit evidence, and post-event review.

## Verification
Inspect enrollment ACLs, template permissions, issuance logs, negative tests, and policy evaluation results.