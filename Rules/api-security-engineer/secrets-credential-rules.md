# Secrets and Credential Rules

## Purpose
Prevent API credentials from being exposed, overprivileged, or unmanaged.

## Scope
API keys, client secrets, passwords, signing keys, certificates, tokens, and service credentials.

## MUST
- Store secrets in approved secret-management systems and grant access by least privilege.
- Maintain ownership and rotation expectations for production credentials.
- Rotate credentials promptly when compromise is suspected or confirmed.
- Separate credentials across environments and materially different trust domains.

## MUST NOT
- Commit secrets to source control, embed them in client-distributed code, or copy them into tickets and logs.
- Share a single privileged credential across unrelated consumers when separate identity is feasible.

## SHOULD
- Prefer managed/workload identities and short-lived credentials over static secrets.

## Exceptions
Static credentials require documented necessity, scope minimization, rotation, monitoring, and owner.

## Verification
Use secret scanning, configuration inspection, access reviews, credential inventory, and rotation evidence.