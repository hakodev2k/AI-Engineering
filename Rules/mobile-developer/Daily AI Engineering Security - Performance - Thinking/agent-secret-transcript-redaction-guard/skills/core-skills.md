# Core Skills

## Skill 1 — Secret Boundary Assessment

### Purpose
Find every path where tool-produced data can reach model context, transcript storage, logs, telemetry, or user-visible history before a deterministic sanitizer runs.

### Trigger
Use when integrating a new agent runtime, tool adapter, MCP server, shell runner, browser tool, or transcript writer.

### Inputs
- agent architecture or event pipeline;
- tool result schemas;
- transcript/logging paths;
- redaction policy;
- representative fake-secret fixtures.

### Preconditions
- no real production secrets in fixtures;
- ability to trace tool result flow;
- sanitizer deployment location identified.

### Required context
Tool execution lifecycle, serialization points, retry/replay behavior, stdout/stderr handling, structured outputs, streaming chunks.

### Tools
Architecture docs, source search, event logs using synthetic markers, `secret_output_guard.py`, test runner.

### Procedure
1. Enumerate tool result sources: stdout, stderr, structured fields, attachments, hook output, errors and retries.
2. Enumerate sinks: model input, local transcript, remote sync, telemetry, terminal rendering and debug logs.
3. Draw source→transform→sink paths.
4. Mark the earliest common interception point before any durable sink or model call.
5. Inject synthetic credential-shaped markers into each source path.
6. Verify each marker passes through the sanitizer exactly once or through an equivalent fail-closed control.
7. Record uncovered paths as blocking findings.
8. Re-test after integration changes.

### Decisions
- If a sink receives raw output before sanitation: integration fails.
- If output is sanitized for model context but raw text is still persisted: integration fails.
- If a tool schema cannot be safely rewritten: block the tool result or place the sanitizer earlier in the runner.

### Constraints
Never use real credentials for testing. Never log original values while diagnosing the sanitizer.

### Expected output
Boundary map, covered/uncovered sink list, synthetic-marker evidence, final pass/fail decision.

### Metrics
Boundary coverage %, unsanitized sink count, duplicate-sanitization count.

### Verification
All configured synthetic secrets are absent from every persisted/model-bound artifact.

### Failure handling
Stop deployment when any raw path remains. Do not downgrade to warning for high-confidence leaks merely to make tests pass.

### Stop conditions
All critical sinks covered or the integration is explicitly rejected.

---

## Skill 2 — Safe Tool Output Sanitization

### Purpose
Sanitize tool output without revealing sensitive values to the model, transcript, reports, or debugging logs.

### Trigger
Every tool result before model reinjection and transcript persistence.

### Inputs
Raw tool output bytes, redaction policy, explicitly registered secret environment-variable names.

### Preconditions
Policy is versioned and validated; output size is within configured bound.

### Required context
Tool identifier, output encoding, whether result is streaming or complete, destination sinks.

### Tools
`secret_output_guard.py`.

### Procedure
1. Capture output into a bounded buffer or stream-safe sanitizer.
2. Apply exact known-value masking, longest value first.
3. Apply high-confidence credential-shape masking.
4. Apply sensitive-assignment masking.
5. Run residual detection against registered exact values and high-confidence patterns.
6. Emit only sanitized content.
7. Emit metrics containing counts and byte sizes, never secret values.
8. If residual count is non-zero, fail closed and suppress the raw payload.

### Decisions
- Exact match wins over pattern labels.
- High-confidence residual → block.
- Low-confidence heuristic match → team policy may warn or redact, but never reveal a previously exact-matched value.

### Constraints
Do not enumerate the entire environment to discover secrets. Only read explicitly configured variable names.

### Expected output
Sanitized text plus non-sensitive metrics.

### Metrics
Exact masks, pattern masks, assignment masks, residual count, bytes in/out.

### Verification
Run `tests/run_tests.py`; inspect no fixture secret survives.

### Failure handling
If sanitizer crashes or policy is invalid, the integration must not forward raw output.

### Stop conditions
Sanitized output passes residual check or the tool result is quarantined.

---

## Skill 3 — Leak Incident Verification and Recovery

### Purpose
Respond to a suspected transcript leak without spreading the credential further.

### Trigger
Residual detector failure, user report, secret scanner alert on transcript storage, or discovery of raw credentials in history.

### Inputs
Incident timestamp, affected tool/session IDs, credential type if known, sanitized evidence.

### Preconditions
Do not paste the suspected secret into tickets/chat. Preserve only hashes/fingerprints when correlation is required.

### Procedure
1. Freeze further model/tool propagation from the affected raw output.
2. Classify affected sinks: local transcript, remote sync, telemetry, logs, artifacts.
3. Record a one-way fingerprint only if needed for searching controlled storage.
4. Revoke/rotate the credential using provider-approved procedures when exposure is confirmed.
5. Purge or quarantine locally stored transcript copies according to platform capability and retention requirements.
6. Confirm the new credential is not present in old logs.
7. Reproduce with a fake fixture and add a regression test.
8. Require independent security verification before closing.

### Constraints
Never automate destructive log deletion without retention/legal approval. Never print the old credential during validation.

### Expected output
Sanitized incident record, affected-sink matrix, rotation status, regression-test reference.

### Metrics
Time to containment, sinks checked, recurrence count, regression coverage.

### Verification
Independent reviewer confirms rotation where applicable and that the regression fixture is blocked.

### Stop conditions
Exposure is contained, recovery actions documented, and the attack/failure path has a passing regression test.
