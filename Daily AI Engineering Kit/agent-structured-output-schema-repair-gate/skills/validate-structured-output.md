# Skill: Validate Structured Output

## Purpose
Determine whether an AI-produced payload is safe to consume under the repository's declared output contract.

## Inputs
Raw output, schema, semantic policy, producing model/task metadata when available.

## Preconditions
Raw output is preserved before any normalization or repair.

## Allowed tools
Read-only file inspection, deterministic parser/validator, repository search, test runner.

## Process
1. Hash and preserve the raw output.
2. Parse JSON without silently fixing syntax.
3. Validate required fields, types, enums, bounds, nested arrays/objects, and additional-property policy.
4. Run domain semantic rules from configuration.
5. Record every finding with path, code, evidence, and severity.
6. Separate malformed structure from missing knowledge/business-rule failure.
7. If valid, hand evidence to Verification Agent.
8. If invalid but repairable without inventing facts, hand to Repair Agent.
9. Stop if repair would require changing the contract or fabricating unavailable facts.

## Expected output
Validation status, input hash, findings, repairability decision, unresolved risk.

## Verification
All acceptance decisions must be reproducible by deterministic scripts.

## Failure handling
Tool/transport errors retry at most twice. Validation failures do not retry blindly.
