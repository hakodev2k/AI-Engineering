# Supply Chain Incident Response Rules

## Purpose
Contain and recover from compromised dependencies, build systems, signing identities, registries, or released artifacts.

## Scope
Source repositories, CI/CD, package registries, dependencies, signing systems, artifact stores, and released software.

## MUST
- Suspected supply-chain compromise MUST trigger preservation of relevant logs, artifacts, provenance, and configuration state.
- Response MUST identify affected artifacts and downstream consumers using immutable release and component inventories.
- Compromised credentials, signing keys, tokens, or automation identities MUST be revoked or contained promptly according to risk.
- Rebuild and re-release actions MUST use a trusted environment whose integrity has been established independently.
- Incident closure MUST document root cause or bounded cause, affected scope, remediation, and preventive controls.

## MUST NOT
- MUST NOT rebuild using infrastructure suspected of compromise before trust is re-established.
- MUST NOT delete evidence merely to restore service quickly.
- MUST NOT claim containment until affected distribution paths and credentials have been addressed.

## SHOULD
- Playbooks SHOULD cover malicious package updates, registry compromise, runner compromise, and signing-key compromise.
- Exercises SHOULD validate component-to-release traceability.

## Exceptions
Emergency containment may prioritize stopping distribution, but deviations MUST be documented and reviewed afterward.

## Verification
Inspect incident timelines, preserved evidence, revocation logs, impact inventories, trusted rebuild evidence, and corrective-action records.