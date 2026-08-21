# Core Skills

## Skill 1 — Credential Generation Diagnosis

**Purpose:** distinguish stale-reader, concurrent-refresh, persistence, and authorization failures before changing auth behavior.

**Trigger:** 401/403 bursts, child-only auth failures, repeated re-login, duplicate refresh logs, or credential-file anomalies.

**Inputs:** redacted auth logs, credential metadata (never token values), process/agent lineage, expiry times, refresh events, HTTP/OAuth error codes.

**Preconditions:** secrets are redacted; clocks are reasonably synchronized; process identities can be correlated.

**Required context:** current generation, expiry, scopes/audience, parent/child processes, refresh owner, last successful authenticated request.

**Tools:** `scripts/credential_state_audit.py`, process logs, provider status page, authorization-server documentation.

**Procedure:**
1. Capture a baseline timeline from last known-good request through failure.
2. Group failures by credential generation and process identity.
3. Check whether parent and children report different generations.
4. Check for overlapping refresh windows or multiple refresh owners.
5. Validate persisted metadata schema and generation monotonicity.
6. Classify the OAuth error as retryable transport/server failure or deterministic authorization failure.
7. Form one falsifiable root-cause hypothesis at a time.
8. Reproduce with synthetic metadata/fixtures before touching production credentials.

**Decisions:** stale child -> rebind protocol; duplicate refresh -> single-writer lease; partial state -> atomic persistence; invalid_grant/revocation -> stop and re-auth/escalate.

**Constraints:** never print tokens; never infer success from file timestamps alone; do not retry deterministic OAuth failures.

**Expected output:** incident timeline, facts, assumptions, selected hypothesis, evidence, corrective action, verification plan.

**Metrics:** number of distinct generations active simultaneously; overlapping refresh count; malformed-generation count; 401 rate by generation.

**Verification:** hypothesis explains observed process/generation pattern and a controlled test reproduces or disproves it.

**Failure handling:** if metadata is insufficient, stop diagnosis at `UNKNOWN` and add observability; do not weaken auth controls.

**Stop conditions:** cause verified, or two bounded hypotheses fail and escalation is required.

---

## Skill 2 — Single-Writer Refresh Protocol

**Purpose:** ensure at most one component rotates a credential generation.

**Trigger:** access token is within configured refresh skew or an authenticated request returns an expiry-classified failure.

**Inputs:** credential key/id, observed generation, lease backend, refresh callback, policy.

**Preconditions:** lease backend supports exclusive ownership with TTL; refresh callback is secret-safe; current generation can be re-read.

**Procedure:**
1. Observe metadata only; never copy the refresh token into orchestration logs/state.
2. Acquire a lease scoped to credential identity.
3. After lease acquisition, re-read the current generation.
4. If generation advanced since observation, do not refresh; adopt the new generation.
5. If still current, call the provider refresh endpoint exactly once for that attempt.
6. Validate required metadata, token type, expiry, scope non-expansion, and provider response before persistence.
7. Persist the full new credential record atomically with `generation = old + 1` using compare-and-swap where available.
8. Publish a generation-changed event without secret values.
9. Run an authenticated probe through the normal request path.
10. Release the lease.

**Decisions:** retry only policy-listed transient failures; deterministic OAuth errors fail closed; lost/unknown refresh response requires state reconciliation before another refresh.

**Constraints:** maximum attempts from policy; no parallel refresh; no raw-secret logging; never downgrade scopes/checks to recover.

**Expected output:** one committed generation or an explicit blocked state.

**Metrics:** refresh executions/generation, lease contention, CAS failures, refresh latency, probe success rate.

**Verification:** concurrent callers yield one writer and all readers converge on one new generation.

**Failure handling:** preserve last known-good state, record redacted evidence, reconcile provider/client state, escalate on ambiguous rotation.

**Stop conditions:** verified new generation, deterministic auth failure, or retry budget exhausted.

---

## Skill 3 — Child Credential Rebind

**Purpose:** prevent long-lived subagents from continuing with a spawn-time token snapshot.

**Trigger:** generation-changed event, child 401 with parent healthy, or task lifetime exceeds token lifetime.

**Inputs:** child registry, credential reference id, generation event, grace period.

**Preconditions:** children use a credential provider/reference rather than receiving a permanent token string when possible.

**Procedure:**
1. Record each child's bound generation at dispatch.
2. On generation change, mark older children `REBIND_REQUIRED`.
3. Pause new authenticated tool calls for stale children.
4. Reload credential through the broker/provider; do not transmit token through agent prompts.
5. Update the child's bound generation.
6. Probe a non-destructive authenticated endpoint or next normal call.
7. Quarantine a child that cannot rebind within the grace period.

**Expected output:** all live children converge to current generation or are explicitly quarantined.

**Metrics:** stale-child duration, stale requests after rotation, rebind success rate, quarantined children.

**Verification:** zero requests with superseded generation after grace period.

**Failure handling:** terminate/quarantine affected child safely; parent does not silently mark its work complete.

**Stop conditions:** convergence, explicit quarantine, or human escalation.

---

## Skill 4 — Auth Recovery Verification

**Purpose:** prove recovery without creating an unbounded 401/refresh loop.

**Trigger:** refresh/rebind completed or an auth incident appears resolved.

**Procedure:** baseline failure -> refresh/rebind -> authenticated probe -> child probe -> observe 401 rate for bounded window -> validate generation/scopes -> declare verified.

**Expected output:** status separated into **Implemented**, **Measured**, and **Verified**.

**Metrics:** authenticated-probe success, 401 recurrence, refresh count, generation divergence.

**Failure handling:** maximum two recovery cycles by default; then stop and escalate.

**Stop conditions:** verification passes or retry budget is exhausted.
