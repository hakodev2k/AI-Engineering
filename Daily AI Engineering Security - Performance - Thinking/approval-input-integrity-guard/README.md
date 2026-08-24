# Approval Input Integrity Guard

**Category:** Security

## Problem
Agent approval can be bypassed semantically when the user approves missing, stale, outer-wrapper, pre-transform, or otherwise different tool arguments from those that execute.

## Evidence
Current evidence and links are in `evidence/research.md`, including 2026 reports from ACP, PydanticAI, OpenAI Agents Python, Mastra, and Codex.

## Existing approach
Framework-native approval callbacks, schema validation, and confirmation UIs provide useful controls but frequently do not cryptographically bind the final executable input to the approval decision.

## Existing limitations
Silent parser defaults, post-validation argument rewrites, deferred execution, nested agents, and UI projection can split the approval representation from the execution representation.

## Proposed improvement
Create a canonical `{tool, arguments}` envelope after deterministic validation/transforms, hash it at approval time, and require an exact hash match immediately before execution. Treat malformed/defaulted approval context as a blocking state rather than absence.

## Architecture
- `evidence/research.md` — current evidence and root causes.
- `skills/approval-envelope-verification.md` — reusable procedure.
- `rules/approval-integrity-rules.md` — enforceable invariants.
- `subagents/approval-security-reviewer.md` — independent verification role.
- `workflows/approval-to-execution-verification.md` — bounded implementation workflow.
- `hooks/pre-execution-approval-check.md` — deterministic blocking hook contract.
- `scripts/approval_input_guard.py` — dependency-free canonical digest verifier.
- `tests/test_approval_input_guard.py` — positive and negative regression tests.

## Installation
Python 3.9+ only; no third-party runtime dependencies. Copy this directory into the host repository.

## Configuration
Integrate the verifier at the host's approval and pre-execution boundaries. Store the approval digest with the decision record. Do not store raw secrets merely for auditing.

## Usage
Generate/inspect an approval digest:
`python3 scripts/approval_input_guard.py --approval approval.json`

Verify actual execution input:
`python3 scripts/approval_input_guard.py --approval approval.json --execution execution.json`

Run tests:
`python3 -m pytest tests/test_approval_input_guard.py`

## Workflow
Observe → baseline mismatch coverage → diagnose transform/delegation boundaries → canonicalize → bind approval digest → recompute before execution → verify independently.

## Metrics
Digest coverage of approval-bearing calls, mismatch blocks, parse-loss blocks, re-approval rate, and false-positive rate.

## Verification
**Implemented:** canonical digest verifier, rules, hook and workflow exist.

**Measured:** adoption requires collecting baseline and post-change metrics in the target runtime.

**Verified:** run the included tests and target-runtime integration tests. Success means unchanged payloads pass while mutation, missing input, and tool-identity changes block.

## Safety
The verifier never executes the target operation. Host authorization, sandboxing and least privilege still apply after a successful digest check.

## Failure handling
Detection: nonzero verifier exit. Evidence: sanitized digests/reason code. Retry: at most one deterministic normalization attempt. Fallback: fresh approval. Escalation: security reviewer. Stop: unresolved mismatch always blocks.

## Definition of Done
- Evidence documented.
- High-impact approval surfaces enumerated.
- Final post-transform payload is the approval payload.
- Approval digest persisted and checked pre-execution.
- Malformed/defaulted input fails closed.
- Nested identity is preserved.
- Included and integration tests pass.
- Independent review passes.
- No secrets are introduced into logs.

## Customization
Replace JSON canonicalization only if both approval and execution use the same deterministic canonical form. Extend the envelope with stable server/origin identity when tool names are not globally unique.
