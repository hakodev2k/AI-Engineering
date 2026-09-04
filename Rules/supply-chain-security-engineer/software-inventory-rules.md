# Software Inventory Rules

## Purpose
Maintain an authoritative inventory of software components, build inputs, artifacts, and ownership needed to assess supply-chain exposure.

## Scope
Applies to source repositories, packages, container images, build tools, base images, generated artifacts, and externally sourced components.

## MUST
- Production software MUST have an identifiable owning team or accountable maintainer.
- Direct and transitive dependencies MUST be discoverable from automated inventory or build metadata.
- Inventory records MUST include component name, version or immutable identifier, source, license metadata when available, and affected release scope.
- Unsupported or unmaintained critical components MUST be tracked as explicit risk.
- Inventory generation MUST run in CI or another repeatable system rather than rely on manual spreadsheets alone.

## MUST NOT
- Teams MUST NOT treat undeclared runtime downloads as outside the software inventory.
- Components MUST NOT be considered trusted merely because they are popular or already used elsewhere.

## SHOULD
- Inventory data SHOULD be queryable across repositories and environments.
- Ownership metadata SHOULD support rapid routing during vulnerability or compromise response.

## Exceptions
Exceptions require documented scope, reason, compensating controls, expiration date, and accountable approval.

## Verification
Verify CI outputs, package manifests, lockfiles, image metadata, artifact inventories, ownership records, and periodic reconciliation against deployed systems.