# Supply Chain Incident Response Rules

## Purpose
Provide a controlled response when source, dependencies, builds, registries, artifacts, or release trust may be compromised.

## Scope
Applies to suspected integrity failures, unauthorized release changes, dependency incidents, signing issues, registry issues, and build-system integrity events.

## MUST
- Suspected supply-chain incidents MUST preserve relevant logs, artifact digests, provenance, source revisions, and access evidence before cleanup when feasible.
- Response MUST identify potentially affected versions, artifacts, environments, and consumers.
- Containment actions MUST prioritize stopping further untrusted publication or deployment.
- Recovery MUST re-establish trusted source, build, identity, signing, and release paths before normal delivery resumes.
- Material incidents MUST produce corrective actions based on evidence.

## MUST NOT
- MUST NOT declare an incident resolved solely because the visible symptom disappeared.
- MUST NOT destroy evidence needed to determine affected scope.
- MUST NOT re-enable a release path before required trust controls are restored or explicitly risk-accepted.

## SHOULD
- Incident playbooks SHOULD predefine artifact revocation, credential rotation, package withdrawal, and consumer notification responsibilities where relevant.
- Exercises SHOULD validate high-impact recovery procedures periodically.

## Exceptions
Emergency deviations MUST be documented with reason, risk, authority, actions taken, and required retrospective review.

## Verification
Review incident timelines, logs, digests, provenance, access records, containment actions, recovered controls, and post-incident evidence. Confirm affected scope and trust restoration were explicitly validated.