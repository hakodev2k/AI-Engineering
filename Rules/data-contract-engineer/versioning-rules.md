# Versioning Rules

## Purpose
Provide predictable lifecycle boundaries for contract evolution.

## Scope
Applies to explicit contract versions, major/minor revisions, schema registry versions, and versioned endpoints or datasets.

## MUST
- Versioning policy MUST define what constitutes a breaking change and how versions are identified.
- Breaking changes MUST create a new compatibility boundary unless an approved migration proves all consumers can move safely in place.
- Deprecation and support windows MUST be documented for active versions.
- Version identifiers MUST be immutable once published.

## MUST NOT
- A published version MUST NOT be silently rewritten to incompatible semantics.
- Producers MUST NOT create new major versions merely to bypass compatibility analysis.
- Multiple active versions MUST NOT diverge without documented ownership and retirement plans.

## SHOULD
- Prefer the minimum number of concurrently supported versions needed for safe migration.
- Version metadata SHOULD be machine-readable when practical.

## Exceptions
Exceptions require consumer inventory, migration evidence, explicit risk acceptance, and owner approval.

## Verification
Inspect version history, schema diffs, deprecation records, consumer migration status, and CI checks enforcing the declared compatibility policy.