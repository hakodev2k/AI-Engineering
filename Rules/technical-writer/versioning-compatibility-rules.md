# Versioning and Compatibility Rules
## Purpose
Keep documentation accurate across supported product and interface versions.
## Scope
Version selectors, compatibility matrices, upgrades, deprecated behavior, and historical docs.
## MUST
- State version applicability when behavior differs materially across supported versions.
- Align documentation lifecycle with actual support and deprecation policy.
- Preserve access to required historical documentation or migration guidance when users remain on supported older versions.
- Document breaking changes and replacement paths before affected users are expected to migrate.
## MUST NOT
- Mix incompatible instructions from different versions in one unqualified procedure.
- Remove still-required supported-version guidance solely because a newer version exists.
## SHOULD
- Minimize duplicated version branches by isolating only genuinely different behavior.
## Exceptions
Evergreen conceptual content may omit versions when verified to be version-independent.
## Verification
Test version selectors/links, compare support matrices, review release diffs, and validate procedures on representative supported versions.