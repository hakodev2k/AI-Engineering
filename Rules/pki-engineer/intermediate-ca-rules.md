# Intermediate CA

## Purpose
Constrain operational issuance risk below protected trust anchors.

## Scope
Applies to subordinate and issuing CAs, their keys, policies, lifetimes, paths, and operational boundaries.

## MUST
- Each intermediate CA MUST have a documented purpose, certificate policy, permitted key usages, path constraints, and owner.
- Issuing CAs MUST be separated when compromise impact, assurance level, or certificate policy materially differs.
- Intermediate CA lifetimes MUST be shorter than the issuing parent and planned around dependent certificate lifetimes.
- CA certificates MUST enforce intended Basic Constraints and Key Usage values.

## MUST NOT
- MUST NOT issue certificates outside the CA's documented policy scope.
- MUST NOT remove path-length or name constraints merely to simplify integration.
- MUST NOT share an issuing CA across unrelated trust domains without explicit risk acceptance.

## SHOULD
- Prefer dedicated issuing tiers for materially different workload classes.
- Plan replacement before cryptographic or operational end-of-life pressure arises.

## Exceptions
Require documented risk, affected relying parties, compensating controls, and security approval.

## Verification
Inspect CA profiles, certificate extensions, policy documents, issuance logs, chain validation, and ownership records.