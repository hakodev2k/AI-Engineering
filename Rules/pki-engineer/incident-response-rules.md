# PKI Incident Response

## Purpose
Contain and recover from key compromise, misissuance, trust-anchor exposure, and certificate-service failures.

## Scope
Applies to suspected or confirmed compromise of CA keys, subscriber keys, signing systems, issuance controls, revocation services, and trust distribution.

## MUST
- PKI incidents MUST preserve evidence, identify affected keys and certificates, bound the trust impact, and establish an incident authority.
- Suspected key compromise MUST trigger immediate assessment of revocation, replacement, trust removal, and dependent identities.
- CA compromise response MUST distinguish containment of the signer from remediation of certificates already issued.
- Recovery actions that alter production trust, revoke high-impact certificates, rotate CA keys, or remove trust anchors MUST require authorized human approval unless an approved emergency runbook explicitly delegates execution.

## MUST NOT
- MUST NOT destroy cryptographic evidence before forensic needs are assessed.
- MUST NOT assume key rotation alone removes trust in previously issued certificates.
- MUST NOT conceal misissuance or weaken validation to restore service.

## SHOULD
- Maintain and exercise compromise and misissuance runbooks.
- Pre-identify relying-party communication and trust-distribution channels.

## Exceptions
Emergency deviations require documented incident authority, rationale, scope, evidence, and retrospective approval.

## Verification
Review incident exercises, revocation timing, key inventories, trust-removal procedures, forensic records, communication plans, and post-incident corrective actions.