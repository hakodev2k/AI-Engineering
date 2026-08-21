# Subagents

## Runtime Evidence Collector
**Mission:** collect read-only evidence of effective hook state.

**Responsibility:** obtain host/version, settings-source identifiers, plugin state, and runtime hook listing; normalize into the runtime snapshot schema.

**Inputs:** approved inventory sources and host diagnostics.

**Required context:** product/version, workspace, organization/profile, policy version.

**Allowed tools:** read-only settings inspection, host status/debug listing, hashing, JSON output.

**Forbidden actions:** modifying settings, executing unknown hooks, disabling plugins, weakening permissions.

**Expected output:** `runtime-hooks.json` plus source metadata.

**Completion criteria:** snapshot is syntactically valid, contains all discoverable hooks, and collection errors are explicit.

**Handoff target:** Policy Reconciler.

---

## Policy Reconciler
**Mission:** deterministically compare expected and runtime hook state.

**Responsibility:** run the guard, classify missing/forbidden/unknown hooks, and produce a redacted report.

**Inputs:** policy JSON and runtime snapshot.

**Required context:** criticality rules and unknown-hook policy.

**Allowed tools:** `scripts/hook_state_guard.py`, local JSON processing.

**Forbidden actions:** semantic command rewriting, model-only equivalence decisions, runtime modification.

**Expected output:** pass/block attestation with mismatch evidence.

**Completion criteria:** deterministic exit status and complete counts.

**Handoff target:** Verification Agent on pass; Security Reviewer on mismatch.

---

## Verification Agent
**Mission:** independently verify high-risk hooks and final state.

**Responsibility:** review reconciliation evidence and, when configured, run harmless isolated canaries for selected critical hooks.

**Inputs:** attestation report, approved canary specification.

**Required context:** safe trigger and expected marker.

**Allowed tools:** disposable temp workspace, test session, approved local marker sink.

**Forbidden actions:** production credentials, destructive tools, real repository mutation, running unknown hook binaries directly.

**Expected output:** verified/unverified result with canary counts.

**Completion criteria:** every selected critical canary is observed exactly once or a blocking failure is reported.

**Handoff target:** Workflow Controller.

---

## Security Reviewer
**Mission:** handle mismatches without normalizing unsafe drift.

**Responsibility:** classify blast radius, approve at most one non-destructive remediation, and decide escalation.

**Inputs:** mismatch report, source metadata, prior attestation if any.

**Required context:** whether affected hooks provide enforcement, audit, or convenience functions.

**Allowed tools:** read-only evidence review, approved restart/reload, incident workflow.

**Forbidden actions:** weakening controls, deleting evidence, approving unknown executable hooks without provenance.

**Expected output:** remediation decision and escalation state.

**Completion criteria:** fresh verified attestation or explicit blocked/escalated status.

**Handoff target:** Workflow Controller or human owner.
