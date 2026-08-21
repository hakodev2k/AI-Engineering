# Hooks

## PreToolUse — command preflight
**Trigger:** before shell/process execution.

**Action:** pass the exact command string to `scripts/command_preflight.py` with the configured policy.

**Command:**
`python scripts/command_preflight.py --policy config/redaction-policy.json --command "<command>"`

**Expected result:** exit 0 for ordinary commands; exit 2 for configured environment/credential-dump patterns or direct references to configured secret variables.

**Failure behavior:** block execution on exit 2 or 3. An override must be explicit, one-shot, user/human-approved and recorded without secret values.

---

## PostToolCapture — sanitize before model/transcript
**Trigger:** immediately after tool stdout/stderr/structured textual output is captured and before any model call, transcript write, terminal-history persistence, telemetry serialization or remote sync.

**Action:** run the raw payload through `scripts/secret_output_guard.py`; only forward the sanitized payload.

**Command:**
`python scripts/secret_output_guard.py --policy config/redaction-policy.json --input <raw-temp> --output <safe-temp> --metrics <metrics-json>`

**Expected result:** exit 0 and sanitized payload; metrics contain counts/sizes only.

**Failure behavior:** exit 2/3/4 suppresses the raw payload. Emit a generic quarantined-result marker and escalate. Never use the original output as fallback.

---

## PreTranscriptWrite — residual verification
**Trigger:** just before the final serialized tool result is written to durable history.

**Action:** run the already sanitized serialized text through the same guard in validation/redaction mode.

**Expected result:** residual count zero.

**Failure behavior:** block transcript write of the affected payload and store only a sanitized security event such as tool ID, rule type, byte count and timestamp.

---

## PostIntegrationChange — regression suite
**Trigger:** after changes to tool adapters, hooks, transcript serialization, output streaming, MCP integration, shell runner or sanitizer policy.

**Action:** run `python tests/run_tests.py` from the package root.

**Expected result:** all synthetic leak/preflight tests pass.

**Failure behavior:** integration is not releasable. Maximum two fix/retest cycles before escalation or quarantining the changed tool path.

---

## FinalVerification — boundary coverage gate
**Trigger:** before claiming production protection.

**Action:** Independent Security Verifier checks that every critical sink discovered by Boundary Mapper is intercepted before persistence/model use and that synthetic markers are absent downstream.

**Expected result:** 100% critical sink coverage, zero high-confidence residuals, no raw fallback path.

**Failure behavior:** status remains Implemented or Measured, not Verified.
