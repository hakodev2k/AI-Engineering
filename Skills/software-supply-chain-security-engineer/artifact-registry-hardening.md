# Artifact Registry Hardening

## Purpose
Protect release artifacts from unauthorized publication, mutation, deletion, substitution, and untraceable promotion.

## When to use
Use when configuring registries for containers, packages, binaries, models, or internal release artifacts.

## Inputs
Registry architecture, IAM, retention settings, replication, network controls, artifact metadata, signing/provenance integration, and audit logs.

## Context to inspect
Identify repositories/namespaces, publisher and reader identities, mutable tags, deletion rights, replication trust, public exposure, and promotion paths.

## Core knowledge
Registries are integrity boundaries. Immutable digests, least-privilege publication, separation of environments, authenticated metadata, and comprehensive audit logs limit substitution risk.

## Procedure
1. Classify registries and repositories by artifact criticality.
2. Inventory write, delete, admin, and replication permissions.
3. Restrict publication to authorized release identities.
4. Enforce immutability for released versions where supported.
5. Separate development and production namespaces or permissions.
6. Require verified signatures/provenance for promotion where practical.
7. Protect retention and garbage-collection settings.
8. Enable audit logging for publish/delete/policy changes.
9. Back up or replicate critical artifacts with integrity preservation.
10. Test unauthorized mutation, deletion, and promotion attempts.

## Decision points
Immutability can complicate cleanup; solve with lifecycle policy rather than permitting release replacement. Public registries need stronger publisher identity and monitoring.

## Common failure patterns
Shared publisher accounts; broad delete rights; mutable release tags treated as identities; unaudited replication; production pulling from development namespaces.

## Verification
Confirm permission boundaries with test identities and trace a production artifact to an immutable digest, signature, provenance, and publish audit event.

## Expected output
A least-privilege, auditable registry architecture preserving released artifact integrity.

## Stop conditions
Escalate on evidence of unauthorized publication/deletion, missing audit trails for critical registries, or inability to protect production artifacts from mutation.