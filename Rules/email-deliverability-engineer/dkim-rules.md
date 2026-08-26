# DKIM Rules

## Purpose
Provide verifiable message authentication with controlled keys and reliable domain alignment.

## Scope
DKIM signing domains, selectors, keys, canonicalization, rotation, and provider integrations.

## MUST
- Production streams MUST use DKIM signing where supported.
- Signing domains MUST be intentionally selected for alignment and reputation ownership.
- Private keys MUST remain in approved secret or provider-managed storage with least-privilege access.
- Selectors MUST support safe rotation without requiring destructive in-place replacement.
- Key rotation or provider migration MUST preserve a verification window for mail already in transit.
- Authentication failures MUST be diagnosed from raw headers and DNS state.

## MUST NOT
- MUST NOT store DKIM private keys in source control, tickets, logs, or documentation.
- MUST NOT remove an old selector before the maximum relevant transit and retry window has passed.
- MUST NOT treat a DKIM `pass` from an unrelated domain as sufficient alignment evidence.

## SHOULD
- Use contemporary key strength supported by receivers and providers.
- Monitor selector resolution and signature pass rates continuously.

## Exceptions
Exceptions require a documented interoperability constraint, risk analysis, compensating authentication, expiry, and approval.

## Verification
Inspect DNS public keys, provider signing configuration, representative raw messages, alignment results, key access controls, and rotation records.