# Localization Pipeline Automation

## Purpose
Build reliable automation that moves source content through extraction, translation, validation, review, packaging, and release without losing provenance or blocking engineering unnecessarily.

## When to use
Use when localization volume grows, manual handoffs cause errors, or AI-generated translation is introduced into CI/CD.

## Inputs
Repositories, content sources, translation provider APIs, glossary, review workflow, build pipeline, release policy, and credential strategy.

## Preconditions
Source-of-truth ownership and translation states are defined.

## Context to inspect
Inspect string extraction, file formats, translation memories, webhooks, CI jobs, artifact storage, branch workflow, secrets handling, and deployment gates.

## Core knowledge
Automation must be idempotent, versioned, auditable, and safe under concurrent source changes. Translation assets should preserve source revision, locale, provider/model version, quality status, and reviewer state.

## Procedure
1. Define source and target artifact contracts.
2. Detect changed source content deterministically.
3. Generate stable content identifiers.
4. Submit translation jobs with glossary and metadata.
5. Validate syntax, placeholders, protected tokens, and encoding.
6. Route content according to risk-based review rules.
7. Prevent stale translations from overwriting newer source revisions.
8. Package approved assets reproducibly.
9. Add retries for transient failures with bounded backoff.
10. Record audit metadata and failure diagnostics.

## Decision points
Use synchronous CI gates for small critical assets; use asynchronous workflows for large translation volumes. Auto-merge only when structural and quality gates meet agreed risk thresholds.

## Common failure patterns
Translating unchanged content repeatedly, losing source revision, overwriting human edits, infinite retries, exposing vendor credentials, and deploying partial locale assets silently.

## Verification
Replay a known content change end-to-end, simulate provider failure and concurrent source updates, and verify correct artifacts and audit metadata are produced.

## Expected output
An idempotent, observable localization pipeline with explicit quality and release gates.

## Stop conditions
Stop when credentials cannot be secured, source ownership is ambiguous, or automation could overwrite approved translations without safe conflict handling.