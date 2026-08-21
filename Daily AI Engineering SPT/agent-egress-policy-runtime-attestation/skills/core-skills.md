# Core Skills

## Skill 1 — Runtime Egress Attestation

**Purpose:** Prove that effective outbound network behavior matches declared allow/deny policy before network-dependent agent work.

**Trigger:** Task startup, network-policy change, sandbox/proxy restart, resumed long-running task, or unexplained network success/failure.

**Inputs:** Policy manifest, current runtime, harmless probe endpoints, timeout budget.

**Preconditions:** Probe endpoints are approved; no credentials are required; the runtime being tested is the same runtime the agent will use.

**Required context:** Declared policy source, task/session identity, policy hash, expected allowed and denied destinations.

**Tools:** `scripts/egress_attest.py`, policy file, host logs if available.

**Procedure:**
1. Record the declared policy source and hash.
2. Validate that allow and deny probes are explicit and bounded.
3. Run the attestor inside the target runtime.
4. Classify each mismatch as over-permissive or over-restrictive.
5. If policy was recently changed, compare the report hash with the prior attestation.
6. Block network-dependent or sensitive actions when any deny target is reachable.
7. For allow failures, diagnose proxy/DNS/TLS/config propagation without broadening policy automatically.
8. Re-run once after a concrete remediation.
9. Hand the second result to an independent verifier.

**Decisions:**
- Denied target reachable → security failure; stop.
- Allowed target unreachable → availability failure; investigate.
- Both match → proceed for the lifetime of the policy hash/runtime identity.
- Inconclusive runtime/probe failure → do not claim policy verified.

**Constraints:** Maximum two attestation attempts per remediation cycle. Never add wildcard domains automatically. Never send secrets in probes.

**Expected output:** JSON report with policy hash, per-probe evidence, mismatch classification, and latency.

**Metrics:** deny-pass rate, allow-pass rate, mismatch count, attestation duration, policy-age since last verification.

**Verification:** Independent reviewer confirms the report was produced inside the correct runtime and policy hash equals the expected manifest.

**Failure handling:** Preserve report, identify control-plane/data-plane mismatch, retry only after a specific remediation.

**Stop conditions:** Any over-permissive result, two failed remediation cycles, or inability to prove runtime identity.

## Skill 2 — Policy Drift Diagnosis

**Purpose:** Determine why desired egress policy differs from observed behavior without weakening controls.

**Trigger:** Any attestation mismatch.

**Inputs:** Current and previous policy hashes, attestation reports, proxy/sandbox configuration, task creation/resume timestamps.

**Preconditions:** Baseline report exists.

**Required context:** Whether policy changed after task creation; proxy lifecycle; execution path used by the failing tool.

**Tools:** config inspection, process/runtime metadata, bounded attestation.

**Procedure:**
1. Confirm mismatch is reproducible with one direct probe.
2. Compare desired policy hash to the last verified hash.
3. Determine whether the runtime was created before the policy change.
4. Check whether the execution path uses the managed proxy/sandbox.
5. Check DNS/TLS/redirect behavior only for the affected endpoint.
6. Form one hypothesis at a time: stale runtime, bypass path, missing transitive domain, or proxy failure.
7. Apply the smallest safe remediation.
8. Re-attest both a required-allow and required-deny control.

**Decisions:** Prefer restarting/rebinding the runtime over widening policy when stale state is suspected.

**Constraints:** No automatic `*`, `0.0.0.0/0`, arbitrary proxy bypass, or permission-skip flags.

**Expected output:** Evidence table containing fact, hypothesis, test, result, and disposition.

**Metrics:** remediation attempts, policy expansion count, time-to-verified-policy.

**Verification:** Deny controls remain blocked after remediation.

**Failure handling:** Escalate with report and exact runtime/config hashes.

**Stop conditions:** Two failed hypotheses or any remediation that would weaken a security boundary without human approval.
