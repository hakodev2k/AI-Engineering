# Supply Chain Risk Model Rules

## Purpose
Define the trust boundaries, critical assets, dependencies, and failure modes that shape software supply-chain controls.

## Scope
Applies to source repositories, package managers, build systems, CI/CD, artifact stores, release pipelines, signing systems, and third-party components.

## MUST
- Every material software delivery path MUST have a documented risk model covering source integrity, dependency integrity, identity misuse, build integrity, artifact integrity, and release authorization.
- Trust boundaries and privileged actors MUST be identified explicitly.
- Risk models MUST be reviewed after material changes to build, release, identity, registry, or signing architecture.
- Mitigations MUST map to identified risks and include verification evidence.

## MUST NOT
- MUST NOT assume internal systems are trusted by default.
- MUST NOT accept a control as sufficient solely because a vendor labels it secure.
- MUST NOT omit human or automation identities with write, release, or signing authority.

## SHOULD
- Risk models SHOULD distinguish prevention, detection, containment, and recovery controls.
- High-impact delivery paths SHOULD include failure scenarios for untrusted upstream packages and unauthorized release changes.

## Exceptions
Exceptions MUST document the omitted risk, rationale, compensating controls, residual risk, owner, and approval.

## Verification
Review the risk model against the actual repository, CI/CD, registry, artifact, identity, and deployment topology. Confirm each high-risk trust boundary has enforceable controls and observable evidence.