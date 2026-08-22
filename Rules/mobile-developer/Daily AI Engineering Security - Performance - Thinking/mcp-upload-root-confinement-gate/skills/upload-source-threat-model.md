# Skill: Upload Source Threat Model

## Purpose
Find local filesystem reads hidden behind upload/export tools and prove their confinement boundary.

## Trigger
New upload/export tool, remote MCP exposure, transport change, security advisory, or file-source change.

## Inputs
Tool schemas, file-open call sites, configured roots, transport model, process filesystem privileges.

## Preconditions
Repository access and a list of write/upload capabilities.

## Required context
Relevant schemas, handlers, path helpers, deployment mounts, and policy. Never collect live secret values.

## Allowed tools
Code search, static analysis, unit tests, temporary test directories, dependency/advisory lookup.

## Constraints
Do not read production secrets, follow untrusted symlinks, weaken sandboxing, or test by uploading sensitive files.

## Procedure
1. Enumerate every tool argument that can select a server-local file.
2. Trace each argument to every `open`/read/stream call.
3. Classify transport and caller trust; remote/multi-user paths are untrusted by default.
4. Locate canonicalization, containment, symlink, existence and size checks.
5. Build fixtures for traversal, sibling-prefix confusion, symlink escape, outside-root absolute paths and oversized files.
6. Insert the central gate immediately before the first file read.
7. Measure sink coverage and run fixtures.
8. Hand off to an independent verifier.

## Decision points
If local file paths are unnecessary, remove the capability. If required, use narrow roots. Unknown provenance or unresolved paths fail closed.

## Expected output
Sink inventory, root policy, tests, measured coverage, residual risks and verification status.

## Metrics
Guarded sinks/total sinks, blocked malicious fixtures, false positives, exception count.

## Verification
Independent reviewer traces schema-to-open paths and reruns tests.

## Failure handling
Maximum two repair/retest cycles; unresolved path semantics or uncovered sinks block completion.

## Stop conditions
Stop only when all sinks are classified and verified or when safe confinement cannot be established.