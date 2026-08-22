# Skill: Tool Argument Integrity Assessment

## Purpose
Detect ambiguous or silently corrupted parsed tool arguments before a side-effecting tool is dispatched.

## Trigger
Run for every multi-parameter persistence/external-write tool call, after parsing but before authorization and execution. High-assurance deployments may run it for all calls.

## Inputs
- tool name
- parsed argument object
- declared input schema or normalized property list
- required fields
- optional critical fields
- side-effect classification

## Preconditions
The gate runs outside model reasoning and has access to the exact parsed argument object that would be dispatched.

## Required context
Only argument names/types and bounded string values required for residue detection. Secret values should be redacted before evidence logging.

## Allowed tools
Schema validator, `scripts/tool_arg_integrity.py`, deterministic regex/string inspection, post-write readback APIs for verification.

## Constraints
- MUST NOT attempt to reconstruct ambiguous swallowed parameters and then execute.
- MUST NOT expose raw secret-bearing values in logs.
- MUST distinguish transport-grammar residue from legitimate application markup using schema-aware correlation.
- MUST fail before side effects when ambiguity involves a declared sibling parameter.
- MUST preserve normal calls that contain benign XML/HTML unrelated to declared sibling fields.

## Procedure
1. Normalize the declared tool schema into property names, required fields, types, and critical fields.
2. Validate that parsed arguments are an object and declared types are compatible.
3. For each string-valued argument, search for high-confidence transport residue such as `<parameter name="X">`, `<parameter name='X'>`, `</parameter>`, or `</invoke>`.
4. Correlate every embedded `parameter name="X"` with the schema. If `X` is another declared parameter and the actual argument `X` is absent/null, classify `SWALLOWED_SIBLING` and BLOCK.
5. If an invocation terminator appears in a normal application string and the tool does not explicitly allow transport markup, classify `INVOCATION_RESIDUE` and BLOCK.
6. Check required and configured critical fields independently. A critical field that is absent/null blocks even when schema marks it optional.
7. Emit only field names, reason codes, lengths, and hashes/previews that cannot reveal secrets.
8. Return the call to the agent/harness for re-composition; do not repair the call heuristically.
9. For persistence/external writes, perform normal authorization and execute only after ALLOW.
10. When the tool supports readback, compare critical fields or stable record identity after execution and record VERIFIED only on match.

## Decision points
- Residue mentions an undeclared field: warn or block according to strict mode; do not infer a sibling loss automatically.
- Legitimate markup tool explicitly permits strings containing `<parameter>` examples: use a tool-specific exemption plus critical-field checks; never globally disable the gate.
- Missing optional field is not critical and no correlated residue exists: allow according to schema.
- Readback unavailable: mark execution Implemented/Measured but not readback-Verified.

## Expected output
Structured result with `decision`, `reason_codes`, `residue_fields`, `missing_declared_fields`, `missing_critical_fields`, and `verification_status`.

## Metrics
Silent-corruption escapes, detection count, false-positive rate, recomposition success rate, pre-side-effect block rate, readback mismatch rate.

## Verification
Replay known-bad fixtures from the reported corruption shape and legitimate-markup controls. Required PASS conditions: all correlated swallowed-sibling fixtures block, benign controls allow, and no side-effect fixture executes before the gate decision.

## Failure handling
Scanner/configuration errors block high-risk calls. Retry the scanner once only for transient I/O/config-load failure. A model may re-compose a blocked call at most twice; a third integrity failure stops and escalates.

## Stop conditions
Stop on two failed re-compositions, missing/unparseable schema for a high-risk tool, contradictory critical-field configuration, or any post-write readback mismatch.