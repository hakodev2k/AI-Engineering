# Release Documentation Rules
## Purpose
Ensure users can understand, adopt, and safely respond to product changes.
## Scope
Release notes, change logs, upgrade notes, launch documentation, and deprecations.
## MUST
- Identify user-visible behavior changes, breaking changes, security implications, migration actions, prerequisites, and known limitations relevant to the release.
- Trace material release claims to approved changes or verified behavior.
- Publish required migration and operational guidance before or with the change it governs.
- Distinguish new, changed, deprecated, removed, fixed, and known-issue states.
## MUST NOT
- Describe planned behavior as shipped behavior without clear status.
- Hide breaking or data-impacting changes in promotional language.
## SHOULD
- Prioritize changes by user impact rather than internal implementation effort.
## Exceptions
Confidential or security-embargoed changes follow approved disclosure timing while preserving necessary user safety.
## Verification
Compare release docs with change records, tests, support notes, deprecation plans, and release artifacts.