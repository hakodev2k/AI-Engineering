# Skill: Contract Diff Analysis

## Purpose
Detect backward-incompatible OpenAPI changes before merge or release.

## When to use
Run when an API implementation, DTO, route, controller, schema, serializer, or OpenAPI generator changes.

## Inputs
- Baseline OpenAPI file.
- Candidate OpenAPI file.
- `config/policy.yaml`.

## Preconditions
- Both specs are valid JSON or YAML OpenAPI documents.
- The baseline represents the contract consumers currently depend on.

## Allowed tools
Read repository files, run deterministic scripts, inspect diffs, run tests/builds. Network access is optional and must not be required for the core gate.

## Constraints
Do not edit the baseline or policy to suppress findings. Do not approve breaking changes.

## Procedure
1. Confirm baseline and candidate paths are distinct and readable.
2. Validate both documents can be parsed.
3. Normalize path ordering and schema traversal without changing semantics.
4. Compare paths and HTTP methods.
5. Compare operation parameters, including location, required flag, and type.
6. Compare request-body required properties and property types.
7. Compare response status codes and response-schema property types.
8. Compare enum values and flag removals.
9. Map every finding to a policy category.
10. Write a structured result containing finding, evidence, affected operation/schema, risk, and status.
11. Block when at least one unapproved blocking finding exists.

## Expected output
A JSON result conforming to `schemas/gate-result.schema.json` plus a human-readable Markdown report when requested.

## Verification
- Both inputs parsed successfully.
- Every blocking category in policy is covered by the deterministic comparator.
- Exit code is nonzero when an unapproved breaking change is detected.

## Failure handling
Parsing/configuration errors are validation failures, not passes. Retry once only for transient file-access failures; otherwise stop and preserve error evidence.

## Stop conditions
Stop on missing baseline, invalid spec, invalid policy, or any approval-required breaking change.
