# Artifact Versioning

## Purpose
Create version identifiers that make every released artifact uniquely identifiable, reproducible, comparable, and traceable.

## When to use
Use when defining package, container, binary, bundle, or deployment version conventions.

## Inputs
Artifact types, consumer expectations, repository model, release cadence, compatibility policy, registry capabilities, and existing version conventions.

## Preconditions
Know which artifacts are independently deployable and which version is exposed to operators or consumers.

## Context to inspect
Inspect package metadata, image tags and digests, Git tags, manifests, release notes, dependency declarations, and deployment records.

## Core knowledge
Human-friendly versions and immutable identities serve different needs. Semantic Versioning can communicate compatibility for public contracts, while commit SHA, digest, or build identity provides uniqueness. Never rely on mutable labels such as latest as the only production identity.

## Procedure
1. Inventory independently released artifacts.
2. Identify compatibility promises for each artifact.
3. Select a version scheme appropriate to those promises.
4. Attach immutable build identity and source revision.
5. Define prerelease and candidate notation.
6. Prevent version reuse and mutable replacement.
7. Propagate versions into manifests and telemetry.
8. Define dependency version policies.
9. Validate registry and tooling behavior.
10. Document operator-facing lookup procedures.

## Decision points
Use semantic versions where consumers need compatibility meaning; use date/build versions where ordering is more important; always retain immutable provenance regardless of display version.

## Common failure patterns
Overwriting an existing version, using latest in production, versions that cannot map to source, inconsistent versions across artifact metadata, and manual version increments that race under concurrent builds.

## Verification
Confirm two builds cannot publish the same immutable identity, production reports the deployed version, a version resolves to source and build evidence, and historical artifacts remain retrievable according to retention policy.

## Expected output
A documented version scheme implemented consistently across build, registry, deployment, and observability systems.

## Stop conditions
Stop if compatibility policy is unresolved, registry behavior permits unsafe overwrites without controls, or downstream consumers require an incompatible scheme that lacks an agreed migration.