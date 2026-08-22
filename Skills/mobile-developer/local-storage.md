# Local Storage

## Purpose
Select and implement safe local persistence for structured data, preferences, files, and sensitive values.

## When to use
Caching, offline data, settings, drafts, or credentials.

## Inputs
Data classification, size, query patterns, retention and encryption needs.

## Context to inspect
Existing databases, key-value stores, filesystem use, backup behavior, migrations.

## Core knowledge
Storage choices differ in consistency, queryability, durability, security, migration cost, and OS backup exposure.

## Procedure
1. Classify data sensitivity and lifetime.
2. Define access/query patterns.
3. Choose database, key-value, file, or secure storage appropriately.
4. Define schema/version migrations.
5. Define transaction boundaries.
6. Encrypt sensitive material using platform facilities where appropriate.
7. Define cleanup and retention.
8. Test upgrade, corruption, low-storage, and rollback scenarios.

## Decision points
Do not use secure key stores for bulk data; do not use plain preferences for secrets.

## Common failure patterns
No migration strategy, storing tokens in plaintext, blocking UI on disk I/O, unlimited cache growth.

## Verification
Migration tests, backup inspection, security review, storage-pressure testing.

## Expected output
Storage design with lifecycle, security, and migration guarantees.

## Stop conditions
Escalate unclear regulatory retention or cryptographic requirements.