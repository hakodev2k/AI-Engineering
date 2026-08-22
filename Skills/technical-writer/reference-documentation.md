# Reference Documentation

## Purpose
Provide precise, scannable, complete facts users can consult while working.
## When to use
Use for commands, configuration, schemas, components, parameters, errors, and supported behavior.
## Inputs
Authoritative implementation/contracts, defaults, constraints, examples, compatibility data.
## Context to inspect
Source, generated metadata, tests, version history, deprecations, platform differences.
## Core knowledge
Reference optimizes lookup, consistency, and completeness rather than narrative learning. Generated facts need human-owned semantics.
## Procedure
1. Define reference object and canonical source.
2. Establish a repeatable field/section schema.
3. Document names, types, defaults, constraints, side effects, and compatibility.
4. Add concise examples for ambiguous semantics.
5. Link related concepts and task guides.
6. Mark experimental/deprecated behavior explicitly.
7. Automate derivable facts where trustworthy.
8. Validate samples and edge values.
## Decision points
Generate high-volume mechanical facts; manually curate explanations where intent, safety, or trade-offs matter.
## Common failure patterns
Inconsistent field order, undocumented defaults, prose hiding constraints, copied source comments, and stale compatibility claims.
## Verification
Compare a representative sample with authoritative implementation/tests and run examples.
## Expected output
Consistent, searchable, authoritative reference content.
## Stop conditions
Stop when no reliable source of truth exists for critical facts.