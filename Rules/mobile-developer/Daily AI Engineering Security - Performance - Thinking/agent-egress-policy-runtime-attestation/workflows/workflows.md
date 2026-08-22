# Workflows

## Workflow 1 — Pre-task Egress Attestation

**Trigger:** Agent task requires network access or claims to run under a restricted allowlist.

**Goal:** Prove that effective egress matches declared policy before network-dependent work.

**Inputs:** Policy manifest, target runtime, approved probe endpoints.

**Baseline:** No policy is considered verified without a current report bound to both policy hash and runtime identity.

**Context:** Desired allow/deny policy, runtime/task identity, last attestation timestamp/hash.

**Stages:**
1. **Observe** — Policy Evidence Analyst records desired policy source and runtime identity.
2. **Validate** — Check schema, max probes, timeouts, credential-free URLs, and approved deny controls.
3. **Measure** — Runtime Attestation Agent runs `python scripts/egress_attest.py <policy> --output attestation.json` inside the target environment.
4. **Classify** — Separate over-permissive, over-restrictive, and indeterminate results.
5. **Checkpoint A** — Any over-permissive result stops the task immediately.
6. **Diagnose** — On mismatch, Remediation Agent tests exactly one hypothesis.
7. **Remediate** — Apply the smallest safe fix; no policy broadening without explicit approval.
8. **Measure again** — Run a complete second attestation, not only the previously failing endpoint.
9. **Checkpoint B** — Maximum two remediation cycles.
10. **Verify** — Independent Verifier checks runtime identity, policy hash, full report, and deny controls.

**Responsible agents:** Evidence Analyst → Runtime Attestation Agent → Remediation Agent if needed → Independent Verifier.

**Tools:** `scripts/egress_attest.py`, config/runtime inspection.

**Outputs:** Policy hash, attestation JSON, mismatch classification, remediation evidence, final verification status.

**Metrics:** allow pass rate, deny pass rate, mismatch count, attestation duration, remediation attempts, policy expansion count.

**Retry policy:** One retry after each concrete remediation; maximum two remediation cycles.

**Stop conditions:** Any over-permissive result pending remediation, inability to identify runtime, missing safe deny control, or two failed remediation cycles.

**Failure path:** Preserve evidence, mark `Not Verified` or `Indeterminate`, stop sensitive network actions, escalate with exact report and hashes.

**Verification:** Fresh report has zero mismatches; verifier confirms no control was weakened to obtain a pass.

**Definition of Done:** Current policy hash attested in correct runtime; all allow/deny probes match; independent verdict is `Verified`; no wildcard or bypass introduced.

## Workflow 2 — Policy-change Re-attestation

**Trigger:** Config edit, allowlist edit, proxy restart, sandbox restart, task resume/rebind, or environment recreation.

**Goal:** Prevent stale attestations from surviving a control-plane change.

**Inputs:** Previous report, new manifest, runtime identity.

**Baseline:** Compare previous and current policy SHA-256 plus runtime identity.

**Stages:**
1. Invalidate previous `Verified` status when hash or runtime identity changes.
2. Run the full pre-task workflow.
3. Compare new report against prior behavior.
4. If a newly denied destination remains reachable, classify security regression.
5. If a newly allowed destination remains blocked, classify propagation/availability failure.
6. Verify independently.

**Checkpoints:** No action may rely on old verification after invalidation.

**Metrics:** policy propagation time, stale-policy detections, regressions per change.

**Retry policy:** Same bounded two-cycle rule.

**Stop conditions:** New deny rule not effective, runtime cannot be refreshed, or required evidence unavailable.

**Failure path:** Keep prior policy intent explicit; do not revert to broader access automatically.

**Definition of Done:** New hash/runtime pair has a passing fresh report and independent verification.

## Workflow 3 — Incident Response for Unexpected Reachability

**Trigger:** Agent/tool successfully reaches a destination believed to be denied.

**Goal:** Contain possible egress-policy bypass and preserve evidence.

**Stages:**
1. Stop further network-capable automation.
2. Record destination, timestamp, runtime identity, and current policy hash; never record credentials.
3. Reproduce once with the bounded attestor if safe.
4. Classify whether the request path bypassed the managed proxy/sandbox.
5. Rotate/revoke credentials only when exposure evidence warrants it; do not automate destructive response.
6. Restart/rebind runtime if stale state is suspected and approved.
7. Re-attest full allow/deny matrix.
8. Require independent verification before resuming.

**Retry policy:** One controlled reproduction plus at most two remediation cycles.

**Stop condition:** Evidence of uncontrolled egress remains.

**Definition of Done:** Attack path blocked, deny control measured, policy boundary preserved, incident evidence documented, verifier signs off.
