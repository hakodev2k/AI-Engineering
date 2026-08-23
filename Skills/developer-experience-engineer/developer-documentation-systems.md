# Developer Documentation Systems

## Purpose
Build documentation as a maintained product that helps developers complete tasks accurately and independently.

## When to use
Use when knowledge is tribal, docs are stale, support questions repeat, or platform adoption depends on hidden expertise.

## Inputs
User journeys, support issues, APIs/tools, repository conventions, analytics, and subject-matter experts.

## Context to inspect
Inspect discoverability, task coverage, freshness, ownership, examples, versioning, and docs-to-code coupling.

## Core knowledge
Separate tutorials, how-to guides, reference, and conceptual explanation. Prefer executable or automatically validated examples for high-risk instructions.

## Procedure
1. Prioritize documentation by developer jobs.
2. Identify authoritative sources.
3. Define information architecture and ownership.
4. Write task-oriented paths with prerequisites and verification.
5. Link reference material rather than duplicating it.
6. Validate commands/examples automatically where feasible.
7. Version docs with behavior.
8. Collect search/support signals and repair gaps.

## Decision points
Put repository-specific instructions near code; centralize cross-cutting platform guidance where discoverability and consistent ownership improve.

## Common failure patterns
Documentation dumps, screenshots of volatile UIs, duplicated reference, no owner, untested commands, and describing happy paths only.

## Verification
Have target users complete documented tasks without undocumented help and validate examples against supported versions.

## Expected output
A discoverable, owned, version-aware documentation system with validated task guidance.

## Stop conditions
Stop when behavior is not stable enough to document or no authoritative owner can validate critical instructions.