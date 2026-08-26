# Certificate Inventory and Discovery Rules

## Purpose
Maintain evidence of certificates, keys, owners, dependencies, and expiry risk.

## Scope
Managed and discovered certificate populations across services, devices, cloud, and infrastructure.

## MUST
- Inventory MUST record issuer, serial/fingerprint, subject/SAN, validity, owner, purpose, location, and lifecycle state where available.
- Discovery MUST cover unmanaged issuance paths that can create production trust dependencies.
- Unknown or ownerless high-impact certificates MUST be triaged and assigned remediation ownership.
- Inventory data MUST support expiry and cryptographic-policy reporting.

## MUST NOT
- MUST NOT store private-key material in inventory systems.
- MUST NOT treat issuance database records as proof that a certificate is still deployed.
- MUST NOT ignore duplicate-key or unexpected-issuer findings without investigation.

## SHOULD
- Inventory SHOULD reconcile issuance, network discovery, and deployment sources.

## Exceptions
Coverage gaps require documented scope, risk, owner, and remediation date.

## Verification
Reconcile samples against endpoints and issuers, test discovery coverage, and review stale/ownerless findings.