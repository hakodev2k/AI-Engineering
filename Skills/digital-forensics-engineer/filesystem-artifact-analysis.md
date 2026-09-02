# Filesystem Artifact Analysis

## Purpose
Interpret filesystem and application artifacts to reconstruct user, process, and file activity with defensible confidence.

## When to use
Use when answering who accessed or changed data, how a file arrived, whether execution occurred, or what activity preceded an incident.

## Inputs
Filesystem metadata, user profiles, application artifacts, timestamps, known indicators, and investigation window.

## Preconditions
Understand the filesystem and operating-system timestamp semantics in scope.

## Context to inspect
Metadata tables, journals, shortcut/recent-file data, shell history, browser data, download records, archive metadata, recycle/trash artifacts, and application caches.

## Core knowledge
No single artifact is authoritative. Timestamp meaning depends on filesystem, application, copy method, timezone, and clock state. Strong conclusions require corroboration among independent artifacts.

## Procedure
1. Define the activity hypothesis to test.
2. Identify artifacts capable of supporting or refuting it.
3. Normalize time sources and record timezone assumptions.
4. Parse metadata with validated tooling.
5. Correlate file identifiers, paths, users, processes, and timestamps.
6. Distinguish direct evidence from inference.
7. Investigate contradictory artifacts rather than averaging them away.
8. Preserve raw records supporting material findings.
9. Assign confidence based on corroboration and artifact reliability.

## Decision points
Use high-level parsers for breadth, then raw metadata inspection for disputed or high-impact findings. Prefer multiple independent artifact classes over repeated interpretations of one source.

## Common failure patterns
Treating access time as reliable proof, ignoring timestamp manipulation, failing to normalize timezones, confusing extraction with original creation, and overclaiming from shortcut or cache artifacts.

## Verification
Reproduce key parses, compare raw metadata with tool output, and corroborate significant claims using another artifact source.

## Expected output
Correlated artifact findings with provenance, timestamps, confidence, and limitations.

## Stop conditions
Stop when timestamp semantics are unresolved, parser output conflicts with raw evidence, or conclusions require unsupported attribution.