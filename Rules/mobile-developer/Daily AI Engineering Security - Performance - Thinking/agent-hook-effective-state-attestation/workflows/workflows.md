# Workflows

## Workflow 1 — Session Hook Attestation

**Trigger:** agent session start, process restart, organization/profile change, plugin enable/disable, settings update, or agent upgrade.

**Goal:** prove that critical hooks expected by policy are actually active and forbidden hooks are absent before protected work begins.

**Inputs:** approved hook policy, product/version metadata, normalized runtime hook snapshot.

**Baseline:** previous verified attestation if available; otherwise no trusted baseline.

**Context:** configuration-source identities, workspace, organization/profile, agent version.

### Stages
1. **Observe** — Runtime Evidence Collector captures effective hook state read-only.
2. **Normalize** — convert host-specific fields to event/matcher/command/source.
3. **Reconcile** — Policy Reconciler runs `hook_state_guard.py`.
4. **Checkpoint A** — any critical missing, forbidden-active, or disallowed unknown hook blocks protected tools.
5. **Verify** — Verification Agent runs approved isolated canaries for selected critical hooks when configured.
6. **Checkpoint B** — canary failure blocks.
7. **Complete** — record redacted attestation and its policy/runtime fingerprints.

**Responsible agents:** Runtime Evidence Collector → Policy Reconciler → Verification Agent.

**Tools:** host diagnostics, JSON adapter, Python guard, optional isolated canary.

**Outputs:** runtime snapshot, attestation report, optional canary report.

**Metrics:** required-hook coverage, forbidden-active count, unknown count, canary pass rate, attestation latency.

**Retry policy:** one retry after clean process restart/reload if collection or runtime state appears stale.

**Stop conditions:** verified pass; or retry exhausted with blocking mismatch.

**Failure path:** freeze protected actions → Security Reviewer → preserve evidence → one approved remediation → fresh attestation → escalate if still failing.

**Verification:** guard exit code 0 plus configured critical canaries.

**Definition of Done:** all critical required hooks present, no critical forbidden hooks active, unknown-hook policy satisfied, canaries pass when required, report stored without secrets.

---

## Workflow 2 — Configuration Change Re-attestation

**Trigger:** watcher detects change in managed/user/project settings, plugin registry, or policy manifest.

**Goal:** prevent a previously valid attestation from surviving a state-changing event.

**Inputs:** previous attestation fingerprint and new config/plugin metadata.

**Baseline:** last verified attestation timestamp/fingerprint.

**Stages:**
1. Invalidate the old attestation immediately.
2. Pause high-risk tool classes protected by critical hooks.
3. Recollect runtime state after the host has applied/reloaded configuration.
4. Reconcile from scratch; do not diff only the changed file.
5. Run critical canaries if configured.
6. Restore protected operations only on verified pass.

**Checkpoint:** a config change with no runtime refresh is `unverified`, never assumed safe.

**Metrics:** re-attestation latency and number of stale-state mismatches detected.

**Retry policy:** one host reload/restart.

**Stop conditions:** verified or escalated.

**Failure path:** same as Workflow 1.

**Definition of Done:** previous attestation invalidated and new verified state produced.

---

## Workflow 3 — Hook Drift Incident

**Trigger:** required hook missing, forbidden hook active, unknown hook active, or canary/listing disagreement.

**Goal:** contain hook-state drift while preserving evidence and avoiding weaker controls.

**Inputs:** mismatch report and environment metadata.

**Baseline:** last verified attestation, if any.

### Stages
1. **Contain** — block actions relying on the affected hook.
2. **Classify** — enforcement, audit, third-party side effect, or convenience.
3. **Evidence** — retain redacted source/runtime fingerprints and timestamps.
4. **Hypothesize** — settings-source substitution, stale plugin registration, stale process, adapter defect, or unknown.
5. **Remediate once** — approved reload/restart or explicit plugin/config correction.
6. **Measure again** — fresh runtime snapshot and guard execution.
7. **Independent verify** — Verification Agent validates result; implementer is not sole verifier.

**Retry policy:** maximum one automated remediation cycle.

**Stop conditions:** verified restoration or human escalation.

**Failure path:** maintain fail-closed state; do not suppress the mismatch or downgrade criticality.

**Definition of Done:** verified restoration plus incident evidence, or explicit unresolved escalation with protected actions still blocked.
