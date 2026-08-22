# Workflows

## Workflow 1 — Baseline and Exposure Mapping

**Trigger:** first integration, new tool adapter, new transcript/log sink, or security review.

**Goal:** prove where raw secret-bearing bytes can travel before changing the system.

**Inputs:** tool registry, sink list, synthetic canary set, runtime config.

**Baseline:** record current number of guarded adapters, raw bypasses, persisted canary occurrences, and scanner latency (if any).

**Stages:**
1. Exposure Mapper enumerates tool-output sources.
2. Enumerate model, transcript, UI, telemetry, cache, trace, and subagent sinks.
3. Inject non-production canaries into test environment variables and files.
4. Run representative reads/commands.
5. Search every sink for canary plaintext and hashes.
6. Classify each path: guarded, leaking, blocked, or unverified.
7. Produce baseline metrics.

**Responsible agent:** Exposure Mapper.

**Tools:** runtime tests, safe search over generated test artifacts, architecture inspection.

**Outputs:** exposure matrix and baseline report.

**Checkpoint:** do not implement until at least one concrete source→sink path is established or all paths are proven guarded.

**Metrics:** guarded-path coverage; leaking-path count; unverified-path count.

**Retry policy:** one rerun for environmental/test harness errors.

**Stop condition:** stop if production credentials would be required; replace with synthetic fixtures.

**Failure path:** untraceable sink remains `unverified` and blocks Definition of Done.

**Verification:** sink files/results contain only synthetic canary test material.

**Definition of Done:** baseline captured for all registered adapters and sinks.

---

## Workflow 2 — Pre-Tool Risk Gate

**Trigger:** before executing shell/file/connector tools that can access sensitive material.

**Goal:** prevent unnecessary broad secret reads.

**Inputs:** tool name, normalized arguments, path/command metadata, policy.

**Baseline:** count high-risk commands that currently execute without structured policy.

**Stages:**
1. Normalize tool metadata.
2. Match sensitive path patterns.
3. Match broad environment-dump operations.
4. Match private-key/credential-store reads.
5. If low risk: allow and continue to mandatory output DLP.
6. If high risk but safe alternative exists: deny original and return safe alternative.
7. If intentional raw access is necessary: require one-shot human approval when supported.
8. Regardless of approval, route output through DLP unless a separately secured non-model sink is explicitly selected.

**Responsible agent:** runtime policy engine; Security Verifier tests it.

**Outputs:** `{decision, reason, safe_alternative, approval_scope}`.

**Checkpoint:** every deny/approval decision is auditable without secret values.

**Metrics:** prevented broad reads; safe-alternative acceptance; overrides.

**Retry policy:** no automatic retry with broader permissions.

**Stop condition:** ambiguous high-risk input fails closed.

**Failure path:** policy-engine exception denies execution.

**Verification:** fixtures for `env`, `printenv`, `.env`, private key, benign file reads.

**Definition of Done:** high-risk fixtures produce expected deterministic decisions.

---

## Workflow 3 — Tool Output Sanitization

**Trigger:** immediately after tool execution and before any downstream sink.

**Goal:** ensure plaintext secrets never cross the raw-execution boundary.

**Inputs:** raw result, policy, in-memory known-secret registry, correlation ID.

**Baseline:** raw result exists only inside the adapter's execution scope.

**Stages:**
1. Enforce byte-size limit.
2. Flatten/visit string fields in structured results while preserving shape.
3. Detect exact known-secret values.
4. Detect configured provider/token patterns.
5. Detect sensitive key/value assignments.
6. Detect private-key material and block if configured.
7. Merge overlapping spans.
8. Replace spans with redaction markers.
9. Create audit metadata using reason + detector + SHA-256 prefix of the matched bytes, never plaintext.
10. Produce immutable sanitized envelope.
11. Drop raw result reference.
12. Forward sanitized envelope to model, transcript, UI, telemetry, cache, trace, and subagent systems.

**Responsible agent:** runtime DLP guard.

**Outputs:** sanitized result envelope and audit event.

**Checkpoint:** no downstream sink API is invoked before successful scan.

**Metrics:** redaction count, blocked result count, scan duration, bytes scanned.

**Retry policy:** scanner may retry once only for explicitly transient internal errors; raw output remains quarantined.

**Stop condition:** scanner failure after bounded retry returns `dlp_scanner_failed` safe envelope.

**Failure path:** fail closed; never forward raw bytes.

**Verification:** canary plaintext absent from every sink fixture.

**Definition of Done:** 100% registered adapters invoke this path.

---

## Workflow 4 — Regression and False-Positive Tuning

**Trigger:** detector/policy change, provider-token format change, or new adapter.

**Goal:** improve recall without making ordinary development output unusable.

**Inputs:** seeded secret corpus, benign corpus, expected actions.

**Stages:**
1. Run seeded-secret tests.
2. Calculate recall by detector class.
3. Run benign corpus.
4. Calculate false-positive rate.
5. Inspect false positives using synthetic/benign data only.
6. Tune patterns or context rules.
7. Re-run entire suite.
8. Compare scan latency to baseline.

**Responsible agent:** Security Verifier.

**Metrics:** seeded recall, false-positive rate, p50/p95 scanning latency.

**Retry policy:** maximum three tuning iterations per review; unresolved cases escalate rather than weakening critical detectors.

**Stop condition:** required high-confidence detectors must reach 100% seeded recall; otherwise release is blocked.

**Failure path:** revert detector change or ship behind stricter block mode after human review.

**Definition of Done:** thresholds pass and results are recorded.

---

## Workflow 5 — Secret Exposure Incident

**Trigger:** evidence that a real credential appeared in any model-visible or persisted sink.

**Goal:** contain and prevent recurrence.

**Stages:**
1. Stop further reproduction with the real value.
2. Identify credential owner/scope using metadata, not chat copies.
3. Revoke/rotate credential according to its provider process.
4. Identify sinks that may contain the leaked value.
5. Apply retention/deletion procedures available to the organization.
6. Determine the source→tool→sink bypass.
7. Add a synthetic equivalent regression fixture.
8. Fix the boundary and independently verify.

**Responsible agent:** Incident Reviewer + human security owner.

**Retry policy:** credential rotation follows provider-specific bounded procedures; failures escalate to owner.

**Stop condition:** never paste leaked plaintext into issue trackers or debugging chat.

**Verification:** old credential is invalid where testable; synthetic regression passes.

**Definition of Done:** containment completed, bypass closed, regression added, residual exposure documented.