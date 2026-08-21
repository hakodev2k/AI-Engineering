# Core Skills

## Skill 1 — Map Secret Exposure Paths

**Purpose:** identify every point where secret-bearing bytes can enter agent-visible or persisted state.

**Trigger:** introducing a coding agent, adding a new tool, enabling shell/file access, or reviewing an existing agent runtime.

**Inputs:** tool registry, process environment policy, transcript/log sinks, file-access rules, persistence architecture, connector configuration.

**Preconditions:** read access to runtime/tool configuration and logging paths.

**Required context:** tool execution lifecycle from request → execution → stdout/stderr/result → model context → UI/transcript → telemetry/storage.

**Tools:** architecture diagrams, code search, runtime logs with synthetic secrets, configuration inspection.

**Procedure:**
1. Enumerate every tool capable of returning text or structured data.
2. Enumerate sources likely to contain secrets: environment, config files, credential stores, CLI output, HTTP headers, cloud metadata, logs.
3. Enumerate every downstream sink receiving tool results.
4. Draw trust boundaries and mark where plaintext may cross them.
5. Seed canary secrets in a controlled test environment.
6. Execute representative tool calls and trace whether each canary reaches each sink.
7. Record unguarded paths as blocking findings.

**Decisions:** a path is protected only when sanitized bytes—not raw bytes—feed the model/transcript/log sink.

**Constraints:** never use production credentials as test data.

**Expected output:** exposure map with source, tool, sanitizer, sink, policy, and verification status.

**Metrics:** guarded-path coverage percentage; count of raw bypass paths.

**Verification:** each sink is exercised with a seeded secret.

**Failure handling:** if a sink cannot be traced, mark it unverified and fail the security review.

**Stop condition:** all configured sinks are either guarded or explicitly disabled.

---

## Skill 2 — Build Layered Secret Detection

**Purpose:** detect secret values without relying on one brittle regex family.

**Trigger:** implementing or tuning the output guard.

**Inputs:** policy, known environment values, secret formats used by the organization, benign corpus, seeded-secret corpus.

**Procedure:**
1. Register exact known secret values from configured sensitive environment variables in memory only.
2. Compile provider/token patterns.
3. Detect assignment-like key/value pairs where the key name is sensitive.
4. Detect private-key headers as block-level findings.
5. Optionally flag high-entropy candidates only when contextual evidence is present; do not use entropy alone as the default blocker.
6. Merge overlapping spans, prioritizing exact-known-value matches.
7. Replace detected spans before any downstream sink.
8. Emit only reason, detector, offsets, and hash prefix in audit metadata.
9. Evaluate against benign and seeded corpora.

**Decisions:** known-value matches and private keys are high confidence; contextual patterns may redact but should be tuned against false positives.

**Constraints:** detector diagnostics must never print the matched plaintext.

**Expected output:** deterministic sanitized output plus metadata.

**Metrics:** seeded recall, benign false-positive rate, scanner latency, redaction count.

**Verification:** regression tests prove each seed disappears from sanitized bytes.

**Failure handling:** scanner errors fail closed.

**Stop condition:** required recall and false-positive thresholds pass.

---

## Skill 3 — Enforce Pre-Persistence Sanitization

**Purpose:** guarantee that the same sanitized representation feeds model context, transcript storage, UI, and telemetry.

**Trigger:** tool result completion.

**Inputs:** raw tool result, tool identity, source metadata, policy.

**Procedure:**
1. Keep raw bytes in the smallest possible execution-local scope.
2. Enforce max-size policy before scanning.
3. Scan stdout, stderr, structured string fields, headers, and error messages.
4. Produce a sanitized immutable result object.
5. Destroy/drop references to raw output after scanning when operationally possible.
6. Send only the sanitized object to model context, transcript, UI, telemetry, cache, and subagent handoff.
7. Attach non-secret audit metadata.
8. For block-level findings, replace the result with a safe blocked-result envelope.

**Decisions:** there must be no “UI-only masking”; persistence and model visibility receive the redacted bytes.

**Constraints:** do not silently make a tool look successful when the result was blocked.

**Expected output:** sanitized result envelope.

**Metrics:** bypass count, blocked-output count, sanitized-output count.

**Verification:** sink-by-sink canary test.

**Failure handling:** fail closed and return `dlp_scanner_failed` without raw content.

**Stop condition:** every output sink consumes the sanitized envelope.

---

## Skill 4 — Gate High-Risk Reads Before Execution

**Purpose:** reduce the amount of secret-bearing data produced in the first place.

**Trigger:** tool call targets a sensitive path or environment-dumping command.

**Inputs:** tool name, arguments, path, shell AST/command string, policy.

**Procedure:**
1. Normalize target paths without resolving outside permitted roots.
2. Compare against sensitive path patterns.
3. Detect broad environment dumps such as `env`, `printenv`, `set`, `export -p`, `/proc/self/environ` reads.
4. Detect broad reads of `.env`, credentials, private keys, kubeconfigs, and service-account files.
5. Prefer metadata-only or safe-field inspection alternatives.
6. Require explicit one-shot approval if raw access is genuinely necessary and the platform supports secure out-of-band viewing.
7. Even after approval, keep output DLP enabled unless the user explicitly opts into a secure non-model sink.

**Expected output:** allow, deny, or approval-required decision with safe alternative.

**Metrics:** prevented broad reads; approval count; unsafe override count.

**Verification:** command/path regression suite.

**Failure handling:** ambiguous high-risk commands are denied by default.

**Stop condition:** decision is deterministic before execution.