# Skill — Terminal Path Audit

## Purpose
Audit every agent termination path for equivalent output-policy enforcement and durable-session integrity.

## Trigger
A new terminal/error handler is added; output guardrails change; streaming/resume behavior changes; or a regression is reported around terminal persistence.

## Inputs
Runtime terminal reasons, handler configuration, guardrail configuration, session-item traces, streaming/non-streaming fixtures, package policy.

## Preconditions
A reproducible fixture exists for each supported terminal path. Tests run against non-production credentials/data.

## Required context
Public runtime contract, local handler behavior, session item model, guardrail verdict model, approval/resume semantics.

## Allowed tools
Read-only source inspection, test runner, session trace export, `scripts/terminal_integrity_guard.py`.

## Constraints
Do not expose hidden chain-of-thought. Do not bypass a guardrail to make a fixture pass. Do not mutate production sessions.

## Procedure
1. Enumerate all supported terminal reasons.
2. For each reason, identify where candidate final output is produced.
3. Record whether the candidate receives an explicit guardrail verdict before delivery.
4. Capture session items after terminal persistence.
5. Check for orphaned call/output pairs and rejected outputs persisted as accepted.
6. Run equivalent streaming/non-streaming fixtures when both modes exist.
7. Compare traces structurally, ignoring transport-only metadata.
8. Block the release if any terminal path lacks a verdict or violates session invariants.
9. Have an independent verifier review the evidence.

## Decision points
- If a handler intentionally produces no user-facing output, mark it `no_delivery` rather than fabricating a verdict requirement.
- If the guardrail system itself fails and policy is fail-secure, block delivery.
- If session parity differs only in documented transport metadata, allow with evidence; semantic differences block.

## Expected output
Terminal-path matrix, guardrail coverage, session-invariant results, parity results, blocking defects, evidence references.

## Metrics
Guardrail coverage %, orphan count, parity failures, rejected-output persistence failures, terminal fixture count.

## Verification
Coverage must be 100% for delivered terminal outputs; orphan count and critical parity failures must be zero.

## Failure handling
Capture the failing trace, stop delivery/release for the affected path, keep existing security policy, and escalate to runtime/framework-specific remediation.

## Stop conditions
All supported paths verified; one critical violation found and release is blocked; verification retry budget exhausted.
