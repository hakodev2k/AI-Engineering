# Skill: Validate and Repair Structured AI Output

## Purpose
Prevent malformed, schema-invalid, or unsafe model output from crossing an agent/tool boundary.

## When to use
Use whenever an LLM response is expected to become JSON consumed by code, another agent, CI, an API, a database adapter, or a tool invocation.

## Inputs
- Raw model response
- Exact JSON Schema
- Original task/context needed for semantic regeneration
- Policy from `config/policy.yaml`

## Preconditions
The schema is versioned and trusted. The raw response has not already been executed. Python 3.9+ and `jsonschema` are available for deterministic validation.

## Allowed tools
Read-only repository inspection, Python validator/repair scripts, model regeneration, tests, and evidence storage. Writes are limited to task artifacts until validation succeeds.

## Process
1. Save raw output unchanged and calculate its SHA-256.
2. Reject oversized output before parsing.
3. Run `scripts/validate_output.py` against the exact schema.
4. Classify failures as syntax/envelope, schema-shape, semantic-context, sensitive-data, or tool/environment.
5. For syntax/envelope failures only, run `scripts/repair_json.py`; it may remove a complete Markdown JSON fence but may not invent data.
6. Revalidate. If valid, mark `repaired` and hand off only the validated file.
7. If still invalid and the failure is repairable from original context, request one contract-aware regeneration that includes validation errors but not secrets.
8. Revalidate the regenerated candidate.
9. Stop after two total repair/regeneration attempts, or earlier if the identical failure repeats.
10. Produce a gate result containing status, attempt count, original hash, output path, errors, and evidence.

## Expected output
A validated structured artifact with status `valid` or `repaired`, or a `blocked` result. Invalid raw content never becomes an executable tool payload.

## Verification
Re-run the validator independently on the final file, confirm the exact schema version, inspect that no sensitive field names are present, and confirm attempts did not exceed two.

## Failure handling
Transient filesystem/tool failures may be retried once with unchanged inputs. Schema ambiguity, permission failures, repeated validation failures, and sensitive-data findings stop the workflow and preserve evidence.

## Stop conditions
Stop on successful independent validation, two failed repair attempts, repeated identical failure, approval boundary, missing trusted schema, or detected sensitive content.
