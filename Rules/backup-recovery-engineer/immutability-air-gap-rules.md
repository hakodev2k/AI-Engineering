# Immutability and Air Gap

## Purpose
Protect recovery copies from compromise, deletion, and destructive propagation.

## Scope
Immutable repositories, object locks, offline copies, isolated vaults, and administrative boundaries.

## MUST
- Critical recovery data MUST include a copy resistant to alteration by compromised production credentials.
- Immutability duration MUST cover the credible detection and response window for destructive attacks.
- Air-gapped or logically isolated copies MUST have a documented, tested access and recovery procedure.
- Controls that can disable immutability MUST be tightly restricted and audited.

## MUST NOT
- MUST NOT expose immutable-copy administration through the same unrestricted credentials used for production.
- MUST NOT shorten immutability or delete protected copies merely to resolve capacity pressure without approval.
- MUST NOT call a copy air-gapped when routine production compromise can directly reach and modify it.

## SHOULD
- Isolation SHOULD combine separate credentials, network boundaries, and delayed or controlled access where practical.

## Exceptions
Exceptions require threat analysis, compensating controls, time limit, and security plus service-owner approval.

## Verification
Inspect repository lock settings, identity permissions, network reachability, audit logs, retention windows, and evidence from isolated recovery tests.