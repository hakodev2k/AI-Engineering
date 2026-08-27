# Versioning and Compatibility

## Purpose
Protect consumers from incompatible configuration evolution and uncontrolled contract changes.

## Scope
Schemas, keys, values, defaults, templates, parsers, generators, and consumer contracts.

## MUST
- Breaking configuration changes MUST be explicitly identified before rollout.
- Producers and consumers MUST have a compatibility strategy for staggered deployment.
- Removed or renamed settings MUST include a migration path when active consumers may still depend on them.
- Default changes MUST be treated as behavior changes and reviewed accordingly.
- Compatibility assumptions MUST be tested across supported versions where practical.

## MUST NOT
- A setting MUST NOT be repurposed with materially different semantics while retaining the same contract without explicit migration.
- Deprecated settings MUST NOT be removed solely because current source search finds no references when runtime or external consumers may exist.
- Breaking public configuration contracts MUST NOT be executed without required approval.

## SHOULD
- Prefer additive evolution and deprecation windows.
- Record supported producer/consumer version combinations.

## Exceptions
Immediate breaking changes are permitted only for urgent safety or security reasons with documented impact, communication, mitigation, and authorization.

## Verification
Run compatibility tests, inspect consumer inventories and deployment order, review deprecation telemetry, and compare effective behavior before and after default or schema changes.