# Skill: Contract Modeling

## Purpose
Turn an agent/MCP tool definition into an explicit, testable contract with success, failure, permission and replay expectations.

## When to use
Use before integrating a new tool, after changing arguments/results, or when runtime behavior no longer matches the advertised schema.

## Inputs
- Tool name and description
- Input schema
- Result/error examples
- Declared side-effect level
- Permission/approval requirements
- Runtime constraints

## Preconditions
The tool must have a stable callable identity and a describable input/output boundary. If the real tool cannot be executed safely, fixtures must target a mock or sandbox adapter.

## Process
1. Record the tool identity and version/source.
2. Normalize each argument: name, type, required/optional, constraints and semantic meaning.
3. Define expected success envelope and required result fields.
4. Define expected error envelope and stable error fields.
5. Classify side effects: `none`, `read`, `reversible-write`, `destructive-write`, or `privileged`.
6. Record whether explicit human approval is required.
7. Create positive fixtures for representative valid inputs.
8. Create negative fixtures for missing required fields, wrong types, bounds and invalid enum values.
9. Create permission fixtures for unauthorized or approval-required calls.
10. Create application-error fixtures for realistic downstream failures.
11. Add replay/idempotency fixtures when repeated execution matters.
12. Define assertions without depending on incidental timestamps or volatile IDs unless those are contractual.

## Tools
Repository search, schema inspection, tool documentation, sandbox adapters, deterministic validator scripts.

## Constraints
Do not invent unsupported tool behavior. Do not use real secrets. Do not classify a mutating tool as read-only merely because common calls are reads.

## Expected output
A contract JSON conforming to `schemas/tool-contract.schema.json` plus executable fixture definitions consumable by the host adapter.

## Verification
Run `scripts/validate-contract.py`. The skill is complete only when structural validation passes and every required fixture class is represented.

## Failure handling
If the runtime contract is ambiguous, mark the ambiguous field in `open_questions` and stop release verification. Revise at most twice before escalation.

## Stop conditions
Stop if destructive behavior is discovered but not declared, required approval cannot be determined, real credentials are needed for a fixture, or the tool contract cannot be represented without guessing.