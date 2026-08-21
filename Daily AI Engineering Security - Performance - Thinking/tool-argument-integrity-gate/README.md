# Tool Argument Integrity Gate

**Category:** Security  
**Run date:** 2026-08-20 (UTC+7)

## Problem
A tool-call parser can turn malformed model-emitted structured syntax into a superficially valid argument object while silently absorbing sibling parameters into a preceding string. Required-field validation catches some failures, but optional or nullable fields can let a corrupted call execute successfully and persist bad data or perform the wrong side effect.

## Evidence
See `evidence/research.md`. A current August 2026 Claude Code report measures silent field loss on parameter-rich MCP calls and re-raises an older reproduced issue describing the same mechanism. The MCP tool contract defines JSON-Schema-governed arguments, but schema validation cannot prove that a permissive upstream parser preserved argument segmentation.

## Existing approach
Common defenses are ordinary schema validation, required fields, prompt formatting instructions, client parser recovery, or server-specific lint checks.

## Existing limitations
Optional but semantically important fields can disappear while the call stays schema-valid. Prompt rules are probabilistic. Generic tag rejection can break legitimate markup workloads. Post-write linting detects the problem only after side effects.

## Proposed improvement
Place a deterministic schema-aware integrity gate between parsing and tool dispatch. Correlate residual tool grammar inside string fields with declared sibling fields that are missing/null, reject ambiguous calls rather than reconstructing them, enforce configured critical fields, bound re-composition retries, and use readback verification for persistence/external writes when safe read APIs exist.

## Architecture
- `skills/tool-argument-integrity-assessment.md` defines the evidence-driven detection and verification procedure.
- `rules/tool-input-integrity-rules.md` enforces fail-closed behavior before side effects.
- `subagents/tool-call-integrity-verifier.md` independently verifies known-bad and benign fixtures.
- `workflows/validate-dispatch-readback.md` supplies the bounded baseline → gate → remeasure → readback loop.
- `hooks/pre-tool-argument-integrity.md` defines deterministic pre-dispatch integration.
- `scripts/tool_arg_integrity.py` performs schema-aware residue, required/critical-field, and simple type checks.
- `tests/test_tool_arg_integrity.py` covers swallowed siblings, critical fields, benign markup, narrow exemptions, and type errors.

## Package tree
```text
README.md
evidence/research.md
skills/tool-argument-integrity-assessment.md
rules/tool-input-integrity-rules.md
subagents/tool-call-integrity-verifier.md
workflows/validate-dispatch-readback.md
hooks/pre-tool-argument-integrity.md
scripts/tool_arg_integrity.py
tests/test_tool_arg_integrity.py
```

## Installation
Python 3.10+; no third-party dependency. Copy the package into the agent/tool host and invoke the hook on the exact parsed call immediately before authorization/execution.

## Policy format
Example `tool-policy.json`:
```json
{
  "tools": {
    "remember": {
      "properties": {
        "content": "string",
        "reason": "string",
        "evidence": "string"
      },
      "required": ["content"],
      "critical": ["reason"],
      "allow_transport_markup": false
    }
  }
}
```

The policy is a compact normalized view of the real tool schema. Generate it from the authoritative schema when possible rather than maintaining two unrelated contracts.

## Call format
Example `parsed-call.json`:
```json
{
  "tool": "remember",
  "arguments": {
    "content": "plain text",
    "reason": "verified reason",
    "evidence": "e-42"
  }
}
```

## Usage
```bash
python3 scripts/tool_arg_integrity.py --call parsed-call.json --policy tool-policy.json
python3 -m unittest tests/test_tool_arg_integrity.py
```

Exit codes: 0 = ALLOW; 2 = invalid configuration/input; 3 = integrity violation/BLOCK.

## Workflow
Follow `workflows/validate-dispatch-readback.md`: Observe → baseline known-bad/benign fixtures → diagnose detectable residue/field loss → implement pre-dispatch gate → replay corpus → verify no side effect occurs for blocked calls → read back critical fields after allowed persistence writes → independent verification.

## Metrics
Track known-bad escape rate, suspicious-residue rate, benign false-positive rate, blocked-call side-effect count, re-composition success rate, critical-field readback mismatch rate, and normal tool success rate.

## Verification
At minimum, replay the corruption shapes represented in the tests. PASS requires every correlated swallowed-sibling fixture to BLOCK, benign HTML/XML controls to ALLOW, blocked-call side-effect count to remain zero, missing critical fields to BLOCK, and readback mismatches to prevent Verified status.

## Safety
The gate does not inspect hidden chain-of-thought and does not need it. Do not log full sensitive values. Do not heuristically recover ambiguous parameters and execute them. A tool-specific markup exemption must be narrow and regression-tested; do not globally bypass integrity checks for high-risk tools.

## Failure handling
Scanner/config failures block high-risk dispatch. Retry a transient scanner/config load once. A model may re-compose a blocked call at most twice; on the third integrity failure, stop and escalate. If readback disagrees with the intended critical fields, stop further writes and investigate rather than repeatedly overwriting data.

## Implemented / Measured / Verified
- **Implemented:** gate is integrated before the tool execution boundary.
- **Measured:** the same known-bad and benign fixture corpus has before/after results.
- **Verified:** independent reviewer confirms zero known-bad escapes, zero blocked-call side effects, acceptable benign behavior, and matching readback where supported.

Package creation alone is not Verified.

## Definition of Done
Current evidence documented; authoritative schema mapped; baseline captured; gate integrated before side effects; deterministic tests pass; known-bad fixture escape rate is zero; false positives are measured; blocked calls execute no side effects; critical readback matches where available; retries are bounded; independent verifier returns PASS; no secret values appear in logs or repository artifacts.

## Customization
Extend simple type checks or replace them with your JSON Schema validator while retaining the residue-correlation rule. Add provider/parser-specific residue patterns only when supported by fixtures. For tools that legitimately store examples of transport grammar, use a narrow per-tool exemption and strengthen critical-field/readback verification rather than disabling the guard globally.