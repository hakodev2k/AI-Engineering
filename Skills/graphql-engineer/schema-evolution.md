# Schema Evolution and Deprecation

## Purpose
Evolve GraphQL contracts without surprising existing consumers and retire obsolete fields through evidence-based migration.

## When to use
Use for renames, type changes, field replacement, enum evolution, behavior changes, and removals.

## Inputs
Current schema, usage telemetry, consumer ownership, replacement design, release policy, and compatibility tooling.

## Context to inspect
Inspect field usage, persisted operations, mobile/client release cadence, deprecation metadata, schema registry, and federated dependencies.

## Core knowledge
GraphQL encourages additive evolution. Removing fields, tightening nullability, changing argument requirements, and changing enum semantics can break clients. Deprecation is a migration process, not merely a directive.

## Procedure
1. Identify the desired change and compatibility risk.
2. Prefer additive replacement over in-place breaking change.
3. Add replacement fields with clear semantics.
4. Mark obsolete fields deprecated with migration guidance.
5. Measure actual usage by operation/client.
6. Contact owners of remaining consumers where possible.
7. Define a removal threshold and date based on release realities.
8. Add schema checks preventing accidental breaks.
9. Remove only after evidence shows safe migration.
10. Monitor errors after rollout.

## Decision points
Keep legacy fields longer for slow-release or third-party clients. A breaking change may justify a coordinated version boundary only when additive evolution would create unacceptable ambiguity or risk.

## Common failure patterns
Removing unused-looking fields without telemetry, making nullable fields non-null, changing enum values silently, deprecating without replacement guidance, and relying only on source-code search for consumers.

## Verification
Run schema diff checks, inspect usage telemetry, execute persisted operations, and verify replacement behavior before removal.

## Expected output
A staged compatibility plan with deprecation evidence and safe removal criteria.

## Stop conditions
Stop if consumer usage cannot be measured and removal would create material unknown risk.