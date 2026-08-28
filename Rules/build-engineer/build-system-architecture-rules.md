# Build System Architecture Rules

## Purpose
Define safe, scalable principles for structuring build systems across large codebases.

## Scope
Applies to build graph design, target boundaries, dependency direction, generated artifacts, build orchestration, and repository integration.

## MUST
- Build graphs MUST model dependencies explicitly rather than rely on execution order side effects.
- Build targets MUST have deterministic inputs, outputs, and declared toolchain requirements.
- Shared build logic MUST be versioned, testable, and isolated from project-specific assumptions.
- Build graph changes that broaden dependency impact MUST include measured analysis.

## MUST NOT
- MUST NOT introduce hidden dependencies through undeclared files, environment variables, or mutable global state.
- MUST NOT couple unrelated modules only to simplify build orchestration.
- MUST NOT permit generated outputs to become accidental source-of-truth inputs.

## SHOULD
- Build rules SHOULD be composable and reusable across similar projects.
- Build graph topology SHOULD minimize unnecessary rebuild propagation.

## Exceptions
Exceptions require documented constraints, alternatives considered, measured impact, rollback approach, and approval when broad build behavior changes.

## Verification
Inspect build graph metadata, dependency declarations, clean-build behavior, incremental rebuild scope, and affected-target analysis in CI.