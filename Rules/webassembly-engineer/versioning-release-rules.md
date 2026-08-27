# Versioning and Release Rules

## Purpose
Ensure modules, components, interfaces, and runtimes evolve without accidental consumer breakage.

## Scope
Applies to artifact versions, interface versions, compatibility promises, deprecation, and release metadata.

## MUST
- Every released artifact MUST be uniquely identifiable and traceable to source.
- Breaking interface changes MUST use the project's explicit breaking-version mechanism.
- Deprecations MUST identify affected consumers, migration guidance, and removal conditions.
- Release notes MUST call out changes to required features, capabilities, resource behavior, and compatibility.
- Compatibility claims MUST be supported by tests against declared consumers or runtime ranges.

## MUST NOT
- Mutable tags alone MUST NOT be the only production identity for an artifact.
- A public contract MUST NOT change incompatibly without explicit review and consumer migration planning.
- Runtime minimum-version requirements MUST NOT change silently.
- Deprecated interfaces MUST NOT be removed solely because no recent internal use was observed when external consumers may exist.

## SHOULD
- Prefer additive interface evolution.
- Automate compatibility checks in CI.
- Maintain bounded support windows rather than indefinite undocumented compatibility.

## Exceptions
Security emergencies may require accelerated breaking changes with human approval, explicit communication, and a containment/migration plan.

## Verification
Inspect artifact metadata, interface diffs, compatibility test results, consumer inventories, release notes, and deprecation records before release.