# Locale-Aware Data Modeling

## Purpose
Design data models that preserve source meaning, locale identity, translation lineage, and market-specific variants without duplicating business data unnecessarily.

## When to use
Use when schemas must store localized content, model outputs, translation states, regional metadata, or user language preferences.

## Inputs
Existing schemas, locale requirements, content lifecycle, translation workflow, query patterns, retention rules, and consistency requirements.

## Preconditions
Canonical business entities and locale identifiers are known.

## Context to inspect
Inspect relational/document schemas, APIs, caches, search indexes, migration history, content versioning, and audit requirements.

## Core knowledge
Localized values should usually reference a stable source entity and explicit locale. Source language, translation status, provenance, version, and fallback eligibility are separate concerns. Locale-sensitive content must not be mixed with canonical numeric or temporal values.

## Procedure
1. Identify fields whose semantics vary by locale.
2. Separate canonical data from localized presentation.
3. Define locale keys and uniqueness rules.
4. Track source version and translation provenance.
5. Represent approval and freshness states explicitly.
6. Model regional overrides independently from language translations.
7. Define fallback queries deliberately.
8. Test concurrency, migration, and deletion behavior.

## Decision points
Use normalized translation tables for many locales and strong consistency needs; embedded localized fields may suit small bounded documents. Duplicate entire entities only when market behavior truly diverges.

## Common failure patterns
Storing formatted dates as canonical values, locale columns proliferating per language, missing provenance, accidental fallback to stale content, and conflating region with language.

## Verification
Run schema and query tests for locale lookup, fallback, updates, deletes, and version mismatches. Verify canonical data remains locale-neutral.

## Expected output
A durable locale-aware data model with migration and lifecycle rules.

## Stop conditions
Stop when business ownership of regional variants is unresolved or migration would risk destructive data loss without approval.