# SPF Rules

## Purpose
Ensure SPF authorizes legitimate envelope senders without creating brittle or overly broad trust.

## Scope
SPF records, include chains, sending services, envelope domains, DNS limits, and change control.

## MUST
- SPF authorization MUST reflect actual approved sending sources for each envelope domain.
- Changes MUST be evaluated against the SPF DNS-lookup limit and include-chain behavior before release.
- Deprecated providers and IP ranges MUST be removed after verified cutover.
- SPF failures affecting legitimate traffic MUST be investigated using message headers and DNS evidence rather than assumptions.
- Organizational ownership MUST be known for every included third-party domain.

## MUST NOT
- MUST NOT publish `+all` or equivalent unrestricted authorization.
- MUST NOT add broad IP ranges merely to suppress failures without proving they are legitimate senders.
- MUST NOT rely on SPF alone as proof that visible From identity is authenticated.
- MUST NOT create multiple SPF TXT records for one identity where they would produce PermError.

## SHOULD
- Minimize include depth and unnecessary authorization.
- Automate monitoring for record drift, lookup exhaustion, and provider changes.

## Exceptions
Any temporary broadening requires reason, expiry, affected traffic, abuse risk, rollback, and approval.

## Verification
Resolve SPF recursively, count lookup-producing mechanisms, test representative envelope domains, inspect received headers, and compare authorized sources with provider and infrastructure inventories.