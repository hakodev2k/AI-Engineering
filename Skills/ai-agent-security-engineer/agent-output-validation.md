# Agent Output Validation

## Purpose
Validate model-generated outputs before they become commands, code, configuration, messages, database writes, or other trusted inputs.

## When to use
Use wherever downstream systems consume agent-generated structured or executable content.

## Inputs
Output schemas, downstream contracts, security rules, allowed formats, business invariants, and representative failure cases.

## Preconditions
Know which output fields can create side effects and which invariants must never be violated.

## Context to inspect
Structured-output parser, schema validator, tool adapter, templating, code execution, message publishing, storage writes, and error handling.

## Core knowledge
Model output is untrusted input. Syntactic validity is insufficient; semantic and authorization constraints must also be enforced. Parsing should fail closed for privileged actions.

## Procedure
1. Enumerate all model outputs crossing trust boundaries.
2. Define strict schemas and reject unknown fields where practical.
3. Validate types, lengths, ranges, formats, enums, and required relationships.
4. Canonicalize before security-sensitive comparison.
5. Enforce business invariants outside the model.
6. Re-check authorization against resolved resources.
7. Escape or parameterize output used in SQL, shell, HTML, templates, and URLs.
8. Restrict generated code to an appropriate sandbox.
9. Fail closed on ambiguous or unparsable privileged requests.
10. Record validation failures without exposing sensitive data.
11. Test injection strings, parser differentials, oversized values, invalid encodings, and contradictory fields.
12. Add regression cases for every production validation incident.

## Decision points
Use deterministic validators for enforceable rules; ask the model for correction only after rejection and never as the sole control. Prefer allowlists for high-risk formats.

## Common failure patterns
Trusting JSON because it parsed, string-concatenating commands, accepting unknown fields, validating before canonicalization, and using model self-review as security validation.

## Verification
Confirm invalid or unauthorized outputs never reach the downstream side-effect boundary and legitimate outputs remain accepted.

## Expected output
A validation layer, schema/invariant specification, negative tests, and documented failure behavior.

## Stop conditions
Escalate when downstream execution cannot be separated from unvalidated model output.