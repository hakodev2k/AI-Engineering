# Persistence and Data Integrity Rules

## Purpose
Protect local data from corruption, inconsistency, accidental loss, and incompatible schema evolution.

## Scope
Core Data, SwiftData, SQLite, files, caches, preferences, and application-owned local persistence.

## MUST
- Durable data models MUST define ownership, consistency constraints, and migration behavior.
- Schema changes affecting existing user data MUST have a tested migration path before release.
- Writes that must succeed or fail together MUST use an atomic mechanism supported by the store.
- Persistence errors MUST be surfaced or recorded with actionable context.
- Sensitive data MUST use storage protections appropriate to its classification.

## MUST NOT
- MUST NOT perform destructive migration as a default recovery strategy.
- MUST NOT store secrets in UserDefaults or unprotected files.
- MUST NOT assume caches are durable sources of truth.
- MUST NOT ship irreversible data transformations without backup/recovery reasoning and approval.

## SHOULD
- Keep persistence models decoupled from presentation models.
- Test migrations from every materially supported schema version.
- Bound local storage growth and define cleanup policy.

## Exceptions
Destructive or lossy behavior requires explicit product/security approval, documented user impact, and recovery evidence.

## Verification
Run migration fixtures, corruption/failure tests, storage inspection, data-protection checks, transaction tests, and upgrade tests on representative devices.