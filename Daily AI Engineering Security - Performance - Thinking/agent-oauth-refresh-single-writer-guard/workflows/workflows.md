# Workflows

## Workflow A — Diagnose OAuth Generation Failure

**Trigger:** repeated 401/403, child-only auth failures, duplicated refresh logs, or forced re-login.

**Goal:** identify the failure class before attempting recovery.

**Inputs:** redacted logs, credential metadata history, process/child registry, policy.

**Baseline:** 401 rate, active generations, concurrent refresh attempts, last successful request, malformed state count.

**Context:** provider status and OAuth error definitions.

**Stages:**
1. **Observe** — Auth Evidence Analyst collects timeline and metadata.
2. **Baseline** — run `credential_state_audit.py` against a redacted event JSONL.
3. **Classify** — stale child, refresh race, partial persistence, deterministic provider rejection, or unknown.
4. **Hypothesis test** — reproduce using synthetic state where possible.
5. **Decision checkpoint** — choose Recovery Workflow only if evidence supports it.

**Responsible agent:** Auth Evidence Analyst.

**Tools:** audit script, metrics/logs, public provider status.

**Outputs:** classification and recovery decision.

**Checkpoints:** no raw secrets present; provider incident checked; generation history monotonicity evaluated.

**Metrics:** unexplained events, overlapping refreshes, stale-child count.

**Retry policy:** at most 2 hypotheses per incident before escalation.

**Stop conditions:** supported classification or evidence-insufficient escalation.

**Failure path:** add observability and preserve state; do not blindly refresh.

**Verification:** independent review confirms evidence supports classification.

**Definition of Done:** failure is classified with evidence and a bounded next action.

---

## Workflow B — Refresh and Rebind

**Trigger:** token is inside refresh skew or diagnosis identifies refreshable expiry.

**Goal:** rotate one credential generation exactly once and converge all live workers.

**Inputs:** credential id, current metadata generation, refresh callback, lease backend, storage adapter, child registry.

**Baseline:** generation G, active child generations, refresh counter, authenticated probe status.

**Stages:**
1. **Lease** — Refresh Coordinator acquires exclusive lease for credential id.
2. **Revalidate** — re-read generation. If `current != observed`, skip refresh and adopt current.
3. **Refresh** — invoke provider once; classify response.
4. **Validate** — ensure complete metadata, expected token type, valid expiry, no scope expansion.
5. **Commit** — atomically persist generation G+1 with CAS against G.
6. **Publish** — secret-free generation-change event.
7. **Rebind** — Child Rebind Agent pauses stale workers and reloads via broker/reference.
8. **Verify** — authenticated parent and child probes, generation convergence, no secret leakage.

**Responsible agents:** Refresh Coordinator -> Child Rebind Agent -> Verification Agent.

**Tools:** integration lease/storage/broker; `credential_lease_guard.py`; normal authenticated API path.

**Outputs:** new generation and convergence report.

**Checkpoints:** lease owner unique; generation unchanged before refresh; CAS successful; stale children handled.

**Metrics:** refresh executions/G, CAS failures, lease wait, rebind latency, post-rotation 401s.

**Retry policy:** retry only transient provider/transport status and only up to `max_refresh_attempts`; use jittered delay. Unknown refresh outcome is reconciled before retry.

**Stop conditions:** verified convergence; deterministic OAuth error; CAS conflict after state adoption; retry budget exhausted.

**Failure path:** preserve current committed state, quarantine stale children, require human re-auth for invalid/revoked grants.

**Verification:** `refresh executions per old generation <= 1`; all workers current within grace; probe succeeds.

**Definition of Done:** one complete generation is committed, children converge/quarantine, recovery is independently verified.

---

## Workflow C — Concurrency Regression Test

**Trigger:** auth integration changes, agent-runtime upgrade, or refresh incident fix.

**Goal:** prove concurrency invariants without production credentials.

**Inputs:** synthetic credential metadata, mock provider, N workers (default 16).

**Baseline:** no guard or previous implementation measurements.

**Stages:** create generation 7 -> launch N simultaneous refresh contenders -> allow one lease owner -> mock one rotation -> assert generation 8 -> assert provider refresh count 1 -> force stale CAS contender -> assert rejection -> simulate children on generation 7 -> publish event -> assert converge/quarantine.

**Responsible agents:** implementation owner; Verification Agent is sole pass/fail authority.

**Tools:** `tests/test_credential_lease_guard.py`.

**Metrics:** provider refresh count, committed generations, CAS rejection count, stale children after grace.

**Retry policy:** test run may be repeated once for infrastructure flake; assertion failures are not retried away.

**Stop conditions:** all assertions pass or regression is blocked.

**Failure path:** revert/disable new integration; do not deploy.

**Definition of Done:** deterministic tests demonstrate single writer, stale-write rejection, bounded retry and secret-free output.
