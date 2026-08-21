# Workflows

## Workflow A — First Approval

**Trigger:** a new MCP server is installed or a server is being onboarded into an agent platform.

**Goal:** create a trusted baseline before the server's tools are available to the model.

**Inputs:** authenticated `tools/list`, stable server identity, policy, approver/change record.

**Baseline:** none.

**Context:** intended server purpose, data domains, authorization scopes, destructive capabilities.

### Stages
1. **Discover** — Manifest Evidence Analyst fetches/export the tool manifest without invoking tools.
2. **Validate identity** — confirm endpoint/server/package identity through an independent source.
3. **Review** — Security Reviewer examines each tool and its descriptions/schemas/annotations.
4. **Decision checkpoint** — approve or reject. Rejection stops onboarding.
5. **Snapshot** — Baseline Custodian runs `manifest_guard.py snapshot --approval-id ...`.
6. **Round-trip check** — run `check` against the same live manifest.
7. **Publish** — only after pass does the host register approved tools for model visibility.
8. **Verify** — Verification Agent confirms host registry and invocation layer use the gate.

**Tools:** MCP discovery/export, `scripts/manifest_guard.py`, approval/change system.

**Outputs:** approved baseline, approval id, verification record.

**Checkpoints:** server identity verified; approval explicit; round-trip digest stable.

**Metrics:** tools reviewed, high-risk tools, onboarding duration, guard latency.

**Retry policy:** manifest fetch may retry at most 2 times for transient transport errors. Parsing/policy/identity failures are not retried automatically.

**Stop conditions:** successful baseline + pass + registry publish, or rejection/failure with tools unavailable.

**Failure path:** quarantine entire server; preserve evidence; escalate identity/security anomalies.

**Verification:** synthetic mutation after onboarding must block before model visibility.

**Definition of Done:** baseline exists in trusted storage, review evidence exists, same manifest passes, host gate is wired, negative drift test passes.

---

## Workflow B — Runtime Drift Reconciliation

**Trigger:** reconnect, `tools/list_changed`, list TTL expiry/refetch, server update, or operator refresh.

**Goal:** reconcile current tool definitions with approved state without silently widening trust.

**Inputs:** current manifest, trusted baseline, policy.

**Baseline:** approved manifest digest and approval metadata.

### Stages
1. **Hold publication** — stage the refreshed manifest separately from the active approved registry.
2. **Compare** — Manifest Evidence Analyst executes `check`.
3. **No drift?** publish/retain approved tools and record pass.
4. **Drift?** classify deterministic changes and risk levels.
5. **Blocked level present?** quarantine changed/new tools; do not invoke them.
6. **Review** — Security Reviewer maps drift to release evidence and authorization impact.
7. **Approve?** if no, keep quarantine and optionally roll server/client version back. If yes, hand off to Workflow C.

**Responsible agents:** Evidence Analyst -> Security Reviewer.

**Tools:** manifest guard, host registry controls, release metadata.

**Outputs:** pass report or blocked change report.

**Checkpoints:** baseline readable; server identity matches; every changed tool has a risk classification.

**Metrics:** drift count, blocked changes, time-to-detection, time-to-review, guard execution duration.

**Retry policy:** maximum 2 current-manifest fetch retries. Never retry comparison by changing policy automatically.

**Stop conditions:** current state is approved/pass, or affected tool surface remains quarantined.

**Failure path:** if baseline is missing/corrupt or comparator errors, fail closed for that server and alert Platform Owner.

**Verification:** host telemetry proves no blocked tool ID appears in model-visible tool registry or invocation events.

**Definition of Done:** deterministic report produced; publication decision matches policy; high/critical drift cannot execute.

---

## Workflow C — Re-approve Legitimate Drift

**Trigger:** Security Reviewer determines blocked drift is intended and acceptable.

**Goal:** move from the old approved baseline to a reviewed new baseline without erasing audit history.

**Inputs:** old baseline, live manifest, drift report, approval decision/id.

**Baseline:** previous approved revision.

### Stages
1. Verify the reviewed manifest digest is still the live digest; if it changed again, return to Workflow B.
2. Run safe sandbox tests for newly destructive/data-sensitive behavior when relevant.
3. Re-evaluate authorization scopes and human-approval boundaries.
4. Obtain explicit approval identifier.
5. Preserve old baseline and drift report.
6. Baseline Custodian snapshots the exact reviewed manifest into a new baseline revision.
7. Run `check` against the new baseline.
8. Verification Agent performs negative drift and representative safe-call tests.
9. Restore approved changed tools to the active registry.

**Retry policy:** at most one re-snapshot for an I/O-only failure. Any manifest-content change restarts reconciliation.

**Stop conditions:** new baseline verified, or changed tools remain quarantined.

**Failure path:** do not restore availability by bypassing the gate; escalate if operational impact requires rollback.

**Definition of Done:** approval tied to exact digest, old/new baselines retained, tests pass, no unreviewed high-risk drift remains.

---

## Workflow D — Security Incident / Suspected Rug Pull

**Trigger:** unexplained critical drift, suspicious description instruction, server identity change, or repeated out-of-band manifest mutations.

**Goal:** contain potential tool poisoning and preserve evidence.

### Stages
1. Disable/quarantine the affected server's changed tools at registry and invocation layers.
2. Preserve old baseline, current manifest, comparator report, server/package version, and timestamps.
3. Do not invoke the suspicious tool to "see what it does" using production credentials/data.
4. Assess credential exposure and downstream authorization scope.
5. If a compromise is plausible, rotate affected credentials according to existing incident procedures.
6. Validate server provenance/source/release and compare package artifacts where available.
7. Restore only from a known-approved baseline/version or after a new formal approval.

**Maximum retries:** none for blocked critical changes; investigation is explicit, not an automated retry loop.

**Definition of Done:** affected capabilities contained, evidence preserved, credential risk handled, and restored state matches an approved manifest.
