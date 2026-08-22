# Workflows

## Workflow 1 — Protect a Tool-Result Boundary

### Trigger
Adding a new tool/runtime adapter or discovering that output can reach model context/transcript without deterministic sanitization.

### Goal
Ensure no registered or high-confidence secret survives from tool result to any critical sink.

### Inputs
Boundary map, tool schemas, policy, synthetic fixtures.

### Baseline
Capture current behavior using fake credentials only. Record whether each sink receives raw, masked, blocked or unsupported output.

### Stages
1. **Observe** — Boundary Mapper traces stdout, stderr, structured output, errors, retries and transcript serialization.
2. **Baseline** — inject fake token fixtures and record unsanitized sink count.
3. **Cause** — determine why output bypasses masking: missing interceptor, late hook, schema rejection, alternate logger, streaming chunk path.
4. **Hypothesis** — choose the earliest safe interception point.
5. **Implement** — Implementation Agent wires preflight and sanitizer; failures suppress raw payload.
6. **Measure again** — re-run identical fixtures and record mask/residual counts.
7. **Independent verify** — Security Verifier runs a separate adversarial matrix.

### Responsible agents
Boundary Mapper → Sanitizer Implementation Agent → Independent Security Verifier.

### Tools
`command_preflight.py`, `secret_output_guard.py`, `tests/run_tests.py`, runtime integration tests.

### Outputs
Boundary coverage report, metrics, verification decision.

### Checkpoints
- C1: all sinks enumerated;
- C2: baseline captured;
- C3: no raw pass-through on sanitizer failure;
- C4: identical fixtures produce zero residuals;
- C5: independent verifier passes.

### Metrics
Unsanitized critical sinks, exact masks, pattern masks, residuals, false positives, boundary coverage %.

### Retry policy
Maximum two implementation iterations after the first measured attempt. Each retry must address a documented root cause, not just add broader regex blindly.

### Stop conditions
Stop and escalate if a critical sink cannot be intercepted safely, a tool output schema cannot be represented after sanitation, or residuals remain after two iterations.

### Failure path
Quarantine/block the affected tool result and require human review. Never fall back to raw output.

### Verification
Synthetic fake credentials are absent from all model/transcript sinks; tests pass; verifier did not author the final implementation change.

### Definition of Done
Baseline documented; interceptor installed; sanitizer failure is fail-closed; preflight integrated where shell commands are available; test matrix passes; critical sink coverage = 100%; independent verification complete.

---

## Workflow 2 — Suspected Credential Leak

### Trigger
Residual check fails, transcript scanner detects a secret shape, or a user reports plaintext credentials in agent history.

### Goal
Contain exposure, recover safely, and prevent recurrence without propagating the secret.

### Inputs
Session/tool identifiers, timestamp, affected sinks, credential provider/type if known.

### Baseline
Do not copy the secret. Record sanitized type and affected artifact identifiers only.

### Stages
1. **Contain** — stop forwarding the affected raw result and suspend the leaking tool path.
2. **Scope** — enumerate local transcript, remote sync, telemetry/logs and generated artifacts.
3. **Recover** — revoke/rotate confirmed exposed credentials using provider procedures.
4. **Preserve obligations** — handle log deletion/quarantine according to retention/legal policy; no unilateral destructive cleanup.
5. **Reproduce safely** — build a fake fixture matching the leak shape.
6. **Fix** — update boundary/pattern/preflight control.
7. **Verify** — independent reviewer confirms fixture no longer crosses the boundary.

### Checkpoints
Exposure classified; rotation decision made; all sinks assessed; regression fixture added; verification passed.

### Retry policy
One fix-and-retest retry for the same root cause. If still failing, disable/quarantine the tool path and escalate.

### Stop conditions
Credential is contained/rotated where required, all sinks addressed, regression passes, and no blocking residual remains.

### Definition of Done
Sanitized incident record exists; no plaintext secret is introduced into remediation artifacts; regression test covers the failure class; independent verifier signs off.
