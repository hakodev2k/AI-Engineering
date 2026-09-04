# Artifact Repository Rules

## Purpose
Protect package registries, image registries, binary repositories, and artifact stores as security-critical distribution boundaries.

## Scope
Applies to repositories that publish, retain, promote, or distribute production software artifacts.

## MUST
- Publish, delete, overwrite, and promote permissions MUST be restricted by role and environment.
- Production artifacts MUST be immutable after release or otherwise protected by equivalent digest-based controls.
- Repository access MUST be authenticated and auditable for privileged operations.
- Retention and replication settings MUST support incident investigation and supported-release recovery.
- Promotion to trusted channels MUST validate required provenance, signatures, policy checks, and artifact digest.

## MUST NOT
- Anonymous users MUST NOT receive write access to trusted repositories.
- Released version identifiers MUST NOT be silently repointed to different content.
- Quarantined or known-malicious artifacts MUST NOT remain available through normal trusted channels.

## SHOULD
- Separate repositories or namespaces SHOULD distinguish untrusted, staging, and production artifacts.
- Repository administration SHOULD use separate privileged identities.

## Exceptions
Exceptions require explicit security approval, bounded scope, compensating integrity controls, expiry, and rollback plan.

## Verification
Review repository ACLs, immutability settings, audit logs, promotion policy, retention configuration, artifact digests, and tests proving lower-trust identities cannot publish to production channels.