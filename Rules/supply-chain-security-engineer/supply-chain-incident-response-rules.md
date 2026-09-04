# Supply-Chain Incident Response Rules

## Purpose
Contain and investigate suspected compromise of dependencies, build systems, signing identities, registries, or distributed artifacts.

## Scope
Applies to malicious packages, compromised maintainers, leaked release credentials, poisoned builders, tampered artifacts, and provenance failures.

## MUST
- Suspected supply-chain compromise MUST establish the affected time window, components, identities, artifacts, releases, and downstream consumers as evidence permits.
- Potentially compromised signing, publishing, or deployment credentials MUST be revoked or contained according to incident authority.
- Affected artifacts MUST be quarantined or blocked from further promotion when compromise cannot be ruled out promptly.
- Investigation MUST preserve relevant logs, provenance, build records, registry events, SBOMs, and artifact digests.
- Recovery MUST rebuild or reissue trusted artifacts from a verified clean source and build path when integrity is in doubt.

## MUST NOT
- Teams MUST NOT assume replacing one dependency version fully remediates an incident without checking credentials, build infrastructure, and previously released artifacts.
- Evidence MUST NOT be destroyed through premature cleanup.

## SHOULD
- Incident playbooks SHOULD identify registry, signing, CI/CD, security, and product owners in advance.
- Downstream notification SHOULD be based on confirmed or bounded exposure and coordinated with incident leadership.

## Exceptions
Emergency actions may bypass normal process only within incident authority and MUST be documented afterward with evidence and rationale.

## Verification
Review incident timelines, audit logs, revocation evidence, quarantined digests, rebuilt artifacts, provenance records, downstream impact analysis, and post-incident corrective actions.