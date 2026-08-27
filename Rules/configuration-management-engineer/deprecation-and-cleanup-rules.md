# Deprecation and Cleanup

## Purpose
Retire obsolete configuration safely without breaking hidden consumers or accumulating permanent complexity.

## Scope
Deprecated keys, aliases, feature settings, compatibility layers, templates, and unused configuration.

## MUST
- Deprecation MUST define replacement behavior or explicitly state that no replacement exists.
- Removal MUST consider runtime, external, offline, and infrequently deployed consumers, not only repository references.
- Critical deprecations MUST provide telemetry or another evidence source for remaining usage where feasible.
- Cleanup MUST remove obsolete documentation, validation paths, and aliases when the migration is complete.
- Removal of externally consumed configuration contracts MUST follow required compatibility and approval processes.

## MUST NOT
- Deprecated settings MUST NOT remain indefinitely without ownership and review.
- A key MUST NOT be deleted based solely on static search when dynamic consumers are plausible.
- Aliases MUST NOT create ambiguous precedence during migration.

## SHOULD
- Announce deprecation windows and deadlines proportionate to consumer diversity.
- Prefer warnings before enforcement when safety permits.

## Exceptions
Urgent removal of unsafe settings may shorten migration windows with documented risk, communication, and mitigation.

## Verification
Inspect usage telemetry, consumer inventories, warnings, migration status, and final diffs. Test both transition behavior and post-removal rejection or fallback behavior.