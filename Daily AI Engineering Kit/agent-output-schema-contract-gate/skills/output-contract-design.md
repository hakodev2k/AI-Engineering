# Skill: Output Contract Design

## Purpose
Define a stable, versioned, machine-checkable output contract for an AI agent, tool, or workflow stage so downstream consumers can depend on explicit fields, types, enums, requiredness, and semantics.

## When to use
Use this skill when an agent or tool emits structured JSON/YAML consumed by another agent, script, service, CI job, test runner, workflow stage, or database loader.

## Inputs
- Producer name and responsibility.
- Consumer names and parsing assumptions.
- Current sample outputs.
- Required business semantics.
- Existing schema, if any.
- Compatibility policy.

## Preconditions
- Producer and consumer boundaries are known.
- At least one representative output exists or can be produced safely.
- The current revision or release identifier is known.

## Required context
Inspect only the producer, its serializers/prompts/tool definitions, immediate consumers, their parsers, and relevant tests. Expand context only when evidence indicates another consumer or derived contract.

## Allowed tools
Repository search, file reads, local scripts, tests, schema validators, diff tools, and read-only production evidence where approved.

## Constraints
- Do not invent fields merely because they may be useful later.
- Separate structural requirements from semantic requirements.
- Do not treat a sample response as the contract unless explicitly approved.
- Do not place secrets or raw sensitive payloads into examples.

## Procedure
1. Identify producer entry points and all direct consumers.
2. Record fields each consumer actually reads, including nested paths and enums.
3. Record business meaning for each required field.
4. Classify fields as required, optional, nullable, deprecated, or internal.
5. Define stable enum values and numeric/string formats.
6. Add `contract_name` and `contract_version` to the envelope where practical.
7. Define unknown-field behavior: ignore, warn, or reject.
8. Define compatibility rules for additive, soft-breaking, and breaking changes.
9. Create or update the JSON Schema under `schemas/`.
10. Create representative valid examples and consumer replay fixtures.
11. Validate examples with `scripts/validate-contract-instance.py`.
12. Review the schema against actual consumer code.
13. Record unresolved semantic assumptions explicitly.

## Expected output
- Versioned schema.
- Contract inventory entry.
- Representative instance.
- Consumer assumptions list.
- Compatibility classification rules.

## Verification
The skill is complete only when every current direct consumer can point to the schema fields it relies on and at least one representative instance validates deterministically.

## Failure handling
If a consumer relies on undocumented free text or ambiguous semantics, classify the contract as `unstable`, preserve evidence, and stop automated compatibility approval until semantics are formalized.

## Stop conditions
Stop when a required consumer cannot be inspected, when current output contains secrets that cannot be safely redacted, or when producer semantics are unknown enough that a schema would falsely imply guarantees.