# DNS Disaster Recovery Rules

## Purpose
Ensure DNS can be recovered after provider, configuration, credential, or infrastructure loss.

## Scope
Zone data, keys, registrar access, authoritative/resolver infrastructure, and recovery procedures.

## MUST
- Critical DNS desired state MUST be backed up or reproducible independently of a single live control plane.
- Recovery procedures MUST include registrar/registry access and DNSSEC key/DS considerations where applicable.
- Recovery objectives MUST be tested against realistic failure scenarios.

## MUST NOT
- MUST NOT assume provider redundancy substitutes for recoverable configuration and access.
- MUST NOT store all recovery credentials in the same failure domain as production administration.

## SHOULD
- Recovery exercises SHOULD include loss of a provider or management plane.

## Exceptions
Unavoidable shared dependencies require explicit risk acceptance and compensating recovery measures.

## Verification
Perform restoration drills, inspect backups and access paths, validate recovered zones, and record achieved RTO/RPO.