# Context Capture Skill

## Purpose
Create a bounded, evidence-backed repository context manifest before planning or editing.

## When to use
Use before repository-wide planning, refactoring, debugging, architecture review, or any task where an agent will rely on summaries, retrieved snippets, indexes, maps, or prior context artifacts.

## Inputs
- repository root
- current Git commit/ref
- task scope paths
- candidate context artifacts

## Preconditions
- repository is readable
- Git metadata is available, or an explicit immutable source revision is provided
- task scope is defined

## Allowed tools
Read-only repository inspection, Git status/log/diff, file hashing, search/index retrieval, deterministic scripts in `scripts/`.

## Constraints
- Do not modify source files while capturing context.
- Do not treat generated summaries as authoritative without source hashes.
- Do not expand to unrelated repository areas without evidence.

## Process
1. Resolve repository identity and current commit.
2. Normalize requested scope into repository-relative paths.
3. Enumerate source files actually used to construct context.
4. Hash each source file with SHA-256.
5. Record source commit, path, hash, size, and context artifact IDs.
6. Record whether an artifact is direct source, derived summary, index hit, or agent note.
7. Bind each derived artifact to its source set.
8. Run `scripts/validate-context-manifest.py`.
9. Mark manifest `captured` only after validation passes.

## Expected output
A context manifest matching `schemas/context-manifest.schema.json`.

## Verification
- repository revision present
- every derived artifact has source bindings
- every source binding has a content hash
- scope paths are normalized and non-empty

## Failure handling
Validation failure blocks planning. Preserve the invalid manifest and validation errors. Fix once, rerun once, then escalate.

## Stop conditions
Stop if repository identity or revision cannot be established, or required source files cannot be read.