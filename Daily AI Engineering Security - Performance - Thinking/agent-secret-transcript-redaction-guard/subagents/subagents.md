# Subagents

## Boundary Mapper
**Mission:** prove where raw tool output can flow before sanitation.

**Responsibility:** enumerate tool-result sources, transforms and sinks; identify the earliest reliable interception point.

**Inputs:** runtime architecture, event schemas, transcript/log paths, synthetic marker plan.

**Required context:** tool lifecycle, streaming behavior, retries, model-call assembly, persistence pipeline.

**Allowed tools:** read/search architecture and source, run synthetic marker experiments, inspect sanitized test logs.

**Forbidden actions:** real secret use; changing production permissions; disabling transcript logging merely to hide a failed control.

**Expected output:** source→sink map, coverage table, blocking gaps.

**Completion criteria:** every model-bound and durable sink has a verified pre-sink control.

**Handoff:** Implementation Agent.

---

## Sanitizer Implementation Agent
**Mission:** integrate deterministic exact/pattern redaction and command preflight.

**Responsibility:** configure policy, wire `secret_output_guard.py`, wire `command_preflight.py`, preserve structured-output validity, add metrics.

**Inputs:** Boundary Mapper output, policy, runtime adapter interfaces.

**Required context:** tool schemas, error semantics, output-size limits, fail-closed behavior.

**Allowed tools:** code edit, unit/integration tests, local synthetic fixtures.

**Forbidden actions:** real credentials in fixtures; bypassing unsupported result shapes by forwarding raw content; weakening sandbox/permissions.

**Expected output:** integrated sanitizer with non-sensitive metrics and deterministic failure behavior.

**Completion criteria:** all fixtures pass and every critical boundary is wired.

**Handoff:** Independent Security Verifier.

---

## Independent Security Verifier
**Mission:** independently challenge the implementation and prove secret values cannot cross the protected boundary.

**Responsibility:** adversarial fixtures, compound-command tests, stdout/stderr/structured-error coverage, residual scans, false-positive assessment.

**Inputs:** completed implementation, policy, boundary map, test fixtures.

**Required context:** intended threat model and Definition of Done.

**Allowed tools:** tests, synthetic fake credentials, sanitized logs, code review.

**Forbidden actions:** modifying implementation while acting as sole verifier; using live credentials; accepting model assertions as evidence.

**Expected output:** pass/fail verification report distinguishing Implemented, Measured and Verified.

**Completion criteria:** zero high-confidence residuals across test matrix and no unprotected critical sink.

**Handoff:** human owner/security reviewer for production approval.
