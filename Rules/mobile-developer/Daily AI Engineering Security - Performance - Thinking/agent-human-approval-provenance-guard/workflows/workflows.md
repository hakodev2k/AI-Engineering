# Workflows

## Workflow A — Permission Decision Reconciliation

**Trigger:** permission request is created or an approve/deny/cancel/stop event arrives.

**Goal:** produce a trustworthy decision classification before the model continues.

**Inputs:** permission request, candidate decision, session ledger, policy.

**Baseline:** current false-attribution count, verified-decision coverage, orphan/conflict count.

**Context:** provider IDs are authoritative; UI text and timing are evidence only.

### Stages
1. **Observe — Event Provenance Analyst:** capture request and decision metadata.
2. **Correlate:** exact `session_id + request_id`; add `tool_use_id` equality when available.
3. **Classify source:** human vs system/runtime/background/watchdog/unknown.
4. **Validate:** freshness, duplicates, conflicting decisions, cross-session contamination.
5. **Decide:** emit a terminal structured state.
6. **Handoff:** only verified-human states may be phrased as human intent.
7. **Verify — Independent Verification Agent:** run the same ledger through `provenance_guard.py`.

**Checkpoints:** after correlation and before model-context insertion.

**Metrics:** false attribution rate; verified coverage; unresolved decisions; decision latency.

**Retry policy:** one authoritative-state reconciliation retry maximum.

**Stop conditions:** terminal classification or retry exhausted.

**Failure path:** retain pending/ambiguous state, emit neutral correction, require explicit human action if progress depends on permission.

**Verification:** guard exit 0 plus independent review for changes to permission code.

**Definition of Done:** exact correlation enforced where possible; non-human causes never impersonate the user; adversarial tests pass.

## Workflow B — Phantom-Denial Incident Investigation

**Trigger:** agent claims the user denied/stopped but operator/host records disagree.

**Goal:** determine event source and prevent recurrence without weakening approval controls.

**Inputs:** transcript, host interaction log, queue/background events, permission ledger.

**Stages:**
1. Freeze evidence; do not replay the potentially dangerous action.
2. Locate the claimed deny/stop and its request/session IDs.
3. Search for authoritative human UI/API action with the same IDs.
4. Search system/background/runtime events in the surrounding event window.
5. Reproduce using synthetic fixture if safe.
6. Add regression fixture before code changes.
7. Implement source-preserving fix.
8. Re-run baseline and adversarial suite.

**Retry policy:** reproduction may be attempted twice; do not loop on nondeterministic races indefinitely.

**Stop conditions:** root cause supported by evidence, or classified unknown with required instrumentation identified.

**Failure path:** block user-intent attribution for the affected path until instrumentation is sufficient.

**Definition of Done:** incident evidence documented, regression test fails before/fixes after, no permission boundary weakened.

## Workflow C — Provider Without Request Identity

**Trigger:** provider permission event lacks a stable request/tool-call ID.

**Goal:** remain correct despite incomplete upstream identity.

**Stages:**
1. Record missing identity as a capability gap.
2. Never promote timing/payload similarity to verified-human identity.
3. Keep host-generated request ID only if the host owns both request issuance and decision collection.
4. If the provider controls the prompt but omits ID, classify downstream mapping as ambiguous.
5. Ask for fresh human confirmation only when the task cannot safely continue without it.

**Metrics:** ambiguous-event frequency; tasks blocked; provider-ID coverage.

**Stop condition:** exact identity obtained or safe escalation chosen.
