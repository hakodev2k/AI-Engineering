# Subagent Terminal-State Evidence Contract

**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Agent orchestrators can label a subagent run `completed`/`success` even when the child produced no usable deliverable, stopped on a deferred tool call, or lost its result after a final-stream/persistence failure. Parents then accept false success, redo expensive work, or make unsupported conclusions.

## Evidence
See `evidence/research.md`. Independent August 2026 reports across Claude Code, OpenCode, and Hermes Agent describe success-like terminal states with empty/partial results, deferred tools, failed final streams, and persistence failures.

## Existing approach
Framework terminal flags, non-empty text checks, task notifications, parent-side ad hoc inspection, and full child retries.

## Existing limitations
Transport/runtime success is not task success. Non-empty text may be an incomplete fragment. Deliverables and verification evidence are often not bound to completion status, and full retries discard recoverable work.

## Proposed improvement
Require a structured completion envelope containing terminal reason, final result, expected/delivered artifacts, unresolved actions, and explicit verification status. A deterministic validator rejects false success before the parent consumes child claims.

## Architecture
- `evidence/research.md`
- `skills/completion-validation.md`
- `rules/completion-contract.md`
- `subagents/independent-verifier.md`
- `workflows/delegate-checkpoint-recover.md`
- `scripts/validate_completion.py`
- `tests/test_validate_completion.py`

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/validate_completion.py completion.json`

## Metrics
False-success rate, empty-result completion rate, missing-deliverable rate, checkpoint recovery rate, child re-run rate, unsupported parent conclusions, rework tokens/time.

## Verification
Run `python -m unittest tests/test_validate_completion.py`.

## Safety
The contract validates observable artifacts/status only and never requests hidden chain-of-thought. Dangerous or irreversible actions remain human-approved.

## Failure handling
Invalid completion becomes `incomplete`, not success. Permit at most one checkpoint recovery and one child retry; then escalate.

## Definition of Done
**Implemented:** envelope/validator integrated.  
**Measured:** false-success and rework metrics captured.  
**Verified:** known failure fixtures are rejected and legitimate completions pass independent verification.

## Customization
Projects may add artifact-specific checks, but explicit terminal reasons, unresolved actions, bounded recovery, and independent verification for high-impact work MUST remain.