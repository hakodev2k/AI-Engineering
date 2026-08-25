# Security and Trust Boundary Rules

## Purpose
Prevent game clients, services, content, and tools from creating exploitable trust assumptions.

## Scope
Client/server trust, downloadable content, local files, IPC, web services, credentials, and user-generated data.

## MUST
- Every external or player-controlled input crossing a trust boundary MUST be validated before privileged use.
- Credentials and signing material MUST be stored outside source and shipped client assets.
- Privileged operations MUST enforce authorization on the trusted side.
- Security-sensitive failures MUST produce auditable evidence without exposing secrets.

## MUST NOT
- MUST NOT rely on client obfuscation as an authorization control.
- MUST NOT log authentication tokens, private keys, session secrets, or unnecessary sensitive player data.
- MUST NOT weaken security controls without explicit human approval and documented risk.

## SHOULD
- Attack surface SHOULD be minimized by disabling unused listeners, debug endpoints, and privileged commands in release builds.

## Exceptions
Security exceptions require threat analysis, compensating controls, evidence, expiry/review criteria, and authorized approval.

## Verification
Use threat modeling, static/dependency scanning, configuration inspection, adversarial tests, secret scanning, and server authorization tests.