# Core Skills

## Skill 1 — Cache Health Baseline

**Purpose:** establish what healthy cache reuse looks like for a real long-running agent session before declaring a regression.

**Trigger:** new agent/client/model rollout, long-session cost complaint, or sentinel deployment.

**Inputs:** request-level token usage events, model/client version, session timestamps, policy thresholds.

**Preconditions:** usage counters are available; request IDs are preserved where possible; prompt content is not required.

**Required context:** known session boundaries, expected pauses, client/version changes, enabled hooks/extensions.

**Tools:** `scripts/cache_sentinel.py`, provider/client transcript metadata, usage dashboard for aggregate cross-checking.

**Procedure:**
1. Collect a representative healthy session with at least 10 requests and at least 3 warm-cache requests.
2. Normalize events into request ID, timestamp, cache-read tokens, cache-creation/write tokens, uncached input, model, client version, and miss reason when present.
3. Run the sentinel with default policy.
4. Record median warm `cache_read_ratio`, typical incremental cache creation, and session rewrite volume.
5. Tune thresholds only from observed healthy data; keep absolute lower bounds so tiny sessions do not trigger.
6. Store the resulting policy beside the integration configuration.
7. Re-run on a second healthy session and confirm no incident.

**Decisions:**
- If healthy sessions legitimately rewrite large prefixes, investigate serialization/TTL before loosening thresholds.
- If usage semantics differ by provider, adapt the normalizer rather than changing metric definitions silently.

**Constraints:** never ingest prompt/tool content solely for cache diagnosis. Never call a single cache miss a regression without baseline evidence.

**Expected output:** a versioned policy and baseline metrics.

**Metrics:** cache-read ratio, cache-creation tokens/request, estimated rewrite tokens/session, false-positive count.

**Verification:** at least two healthy sessions pass and metrics are reproducible from raw usage metadata.

**Failure handling:** if counters are unavailable or ambiguous, mark baseline as incomplete and do not enable blocking mode.

**Stop conditions:** stop after two representative healthy sessions agree within the team's accepted variance, or after data quality prevents reliable measurement.

---

## Skill 2 — Cache Collapse Diagnosis

**Purpose:** turn a sudden token/cost spike into evidence identifying where cache reuse collapsed.

**Trigger:** sentinel incident, unexplained usage-window burn, or repeated large cache writes.

**Inputs:** sentinel report, raw usage metadata, client/model/version timeline, hook configuration, resume/update events.

**Preconditions:** baseline exists or the session contains a clearly warm prefix before collapse.

**Required context:** recent upgrades, process restarts, concurrent clients, session resumes, hook/additional-context changes, observed cache TTL.

**Tools:** sentinel report; client logs; version and configuration diffs.

**Procedure:**
1. Identify the first collapse event rather than the largest later consequence.
2. Compare its previous warm request with the collapse request: cache read, cache creation, model, client version, timestamps, miss reason.
3. Build a minimal transition table for the preceding 3 and following 3 requests.
4. Test hypotheses in this order: expected TTL expiry; explicit model/system change; client/version transition; hook/context mutation; concurrent resume/client; unknown provider-side miss.
5. Reproduce with one controlled variable at a time when cost permits.
6. Limit reproduction to two large-context attempts; use a reduced fixture after that.
7. Record observed facts separately from hypotheses.

**Decisions:**
- If a known transition exactly coincides with collapse and a controlled test reproduces it, classify as supported cause.
- If no controlled reproduction exists, classify only as correlation.

**Constraints:** do not repeatedly recreate a million-token context to prove a point. Do not infer provider internals from counters alone.

**Expected output:** incident record containing facts, candidate causes, tests, result, and mitigation.

**Metrics:** time-to-first-collapse identification, reproduction attempts, rewrite tokens avoided after detection.

**Verification:** an independent reviewer can derive the same first-collapse request and evidence from the metadata.

**Failure handling:** when evidence is insufficient, disable only the suspected integration/hook if safe and approved; otherwise start a fresh session and preserve the incident artifacts.

**Stop conditions:** maximum two high-cost reproductions; stop immediately if another attempt risks a usage limit or production disruption.

---

## Skill 3 — Cache-Safe Change Verification

**Purpose:** verify that a proposed hook, client, serializer, or TTL change improves cache behavior without losing required context.

**Trigger:** after mitigation implementation.

**Inputs:** before/after event sets, same representative workflow, quality checks for task correctness.

**Procedure:**
1. Freeze the task fixture and model where possible.
2. Run baseline and candidate once each; repeat once if variance is high.
3. Compare cache-read ratio, cache-creation tokens, collapse count, end-to-end latency, and task-quality result.
4. Require zero repeated-collapse incidents for the candidate.
5. Reject any token improvement caused by deleting correctness-critical context.
6. Document Implemented, Measured, and Verified separately.

**Expected output:** before/after comparison with acceptance decision.

**Metrics:** rewrite reduction %, cache-read-ratio delta, latency delta, quality-regression count.

**Verification:** deterministic sentinel output plus existing task tests/evals.

**Failure handling:** roll back the cache-related change if quality degrades or cache behavior worsens.

**Stop conditions:** maximum two candidate iterations per investigation before escalation to platform/client maintainers.
