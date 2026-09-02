# Certificate Automation and ACME

## Purpose
Automate certificate issuance and renewal without weakening identity, policy, or key protections.

## Scope
Applies to ACME and equivalent automated enrollment, renewal, deployment, and revocation workflows.

## MUST
- Automated enrollment MUST authenticate the workload or control plane and enforce certificate policy before issuance.
- Automation credentials MUST be scoped to the minimum names, accounts, or certificate classes required.
- Renewal automation MUST expose failures through actionable monitoring before certificate expiry becomes imminent.
- Automated deployment MUST verify that the expected certificate and chain became active on the target.

## MUST NOT
- MUST NOT grant automation unrestricted issuance across unrelated namespaces or trust domains.
- MUST NOT store automation account keys or enrollment credentials in source code or plaintext configuration.
- MUST NOT treat successful ACME order completion as proof of successful production deployment.

## SHOULD
- Prefer short-lived certificates when reliable automation and client compatibility exist.
- Make renewal workflows idempotent and safely retryable.

## Exceptions
Require documented operational constraint, compensating controls, owner, expiry, and approval.

## Verification
Inspect enrollment policy, account scope, secret storage, renewal metrics, deployment probes, logs, and negative authorization tests.