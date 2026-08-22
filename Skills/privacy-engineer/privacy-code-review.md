# Privacy-Focused Code Review

## Purpose
Detect implementation choices that violate data minimization, purpose, isolation, retention, or transparency requirements before merge.

## When to use
Use for changes touching identity, telemetry, data models, exports, analytics, AI, permissions, deletion, or third-party calls.

## Inputs
Diff, requirements, data classification, architecture, threat model, and tests.

## Context to inspect
Inspect callers and consumers beyond changed lines, generated payloads, serialization, logs, persistence, caches, and background jobs.

## Core knowledge
Privacy defects often look technically correct: an extra serialized field, broad query, verbose log, missing tenant predicate, or new durable identifier. Review data lifecycle, not syntax alone.

## Procedure
1. Identify new or changed personal-data flows.
2. Verify each field has a defined purpose.
3. Check authorization and tenant boundaries.
4. Review persistence and retention implications.
5. Inspect logs and error handling for leakage.
6. Review external calls and serialization.
7. Check deletion/update propagation.
8. Require tests for important privacy invariants.
9. Distinguish blocking risks from optional improvements.

## Decision points
Request redesign when the safest fix requires changing the data flow rather than adding redaction after collection.

## Common failure patterns
Reviewing only changed files, trusting DTO names, missing implicit serialization, and approving broad access because callers are “internal.”

## Verification
Trace representative sensitive data through the changed path and confirm required tests cover it.

## Expected output
Actionable review findings tied to concrete privacy risks.

## Stop conditions
Block merge for unresolved high-impact exposure, unauthorized processing, or missing critical evidence.