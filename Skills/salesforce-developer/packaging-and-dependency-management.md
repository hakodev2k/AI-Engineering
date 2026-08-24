# Packaging and Dependency Management

## Purpose
Structure Salesforce metadata and code into maintainable package/dependency boundaries that support reuse, versioning, deployment order, and safe team ownership.

## When to use
Use for modular org development, unlocked/managed package design, shared libraries, namespace decisions, and dependency cleanup.

## Inputs
Modules, metadata ownership, release cadence, dependencies, target orgs, namespace requirements, upgrade constraints.

## Context to inspect
Existing packages, package directories, metadata references, public/global Apex APIs, permission dependencies, Flow/LWC coupling, version history.

## Core knowledge
Package boundaries create lifecycle contracts. Cross-package dependencies should point toward stable abstractions and avoid circular ownership. Public/global APIs and metadata references can become compatibility commitments.

## Procedure
1. Group metadata by cohesive business/technical ownership.
2. Map incoming/outgoing dependencies.
3. Remove circular dependencies through contracts or boundary changes.
4. Keep shared packages narrowly scoped.
5. Minimize global/public surface area.
6. Define semantic release/version compatibility expectations.
7. Validate install/upgrade order in clean environments.
8. Document package-specific permissions and configuration.
9. Test upgrade and rollback/forward-fix scenarios.

## Decision points
Use packages when independent lifecycle, reuse, ownership, or distribution benefits exceed added dependency/release complexity. Keep tightly coupled metadata together.

## Common failure patterns
One giant shared package, circular dependencies, global APIs for convenience, environment-specific references, and untested upgrades.

## Verification
Build/install packages in dependency order, run regression tests, and verify upgrade behavior from supported prior versions.

## Expected output
A package topology with explicit ownership, dependency direction, versioning, and upgrade evidence.

## Stop conditions
Escalate when required dependency changes would break supported consumers or namespace/API commitments are unclear.