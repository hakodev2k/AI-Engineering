# Hooks

## PreSession / SessionStart Attestation
**Trigger:** before enabling protected agent tools.

**Action:** collect a normalized runtime hook snapshot, then reconcile it against the approved manifest.

**Command:**
`python scripts/hook_state_guard.py --policy config/hook-policy.json --runtime .agent-attestation/runtime-hooks.json --report .agent-attestation/report.json`

**Expected result:** exit 0 and `verified: true`.

**Failure behavior:** block protected tool classes and invoke the Hook Drift Incident workflow. Do not continue on exit 2/3/4.

---

## Settings/Plugin Change Invalidation
**Trigger:** managed/user/project settings, plugin state, organization/profile, or runtime version changes.

**Action:** invalidate the previous attestation and require a fresh runtime snapshot.

**Command/script:** host-specific watcher or launcher integration; the deterministic reconciliation command remains the same.

**Expected result:** no protected tool use until a new verified report exists.

**Failure behavior:** remain unverified/fail closed.

---

## PreToolUse Critical Gate
**Trigger:** before a tool class whose security depends on a critical hook, such as Bash/network/write.

**Action:** verify that the current attestation is still valid for the same policy hash, runtime version, organization/profile, and settings/plugin state.

**Command/script:** host launcher checks the attestation metadata; if any state fingerprint changed, rerun SessionStart Attestation.

**Expected result:** verified and fresh attestation.

**Failure behavior:** deny/hold the tool action until re-attestation succeeds.

---

## PostChange Verification
**Trigger:** after an approved remediation to hook configuration or plugin state.

**Action:** recollect runtime state from scratch and rerun the guard; optionally run configured isolated canaries.

**Expected result:** fresh verified report, not reuse of the pre-remediation report.

**Failure behavior:** maximum one remediation cycle; then escalate.

---

## Final Verification
**Trigger:** before declaring a protected agent workflow complete.

**Action:** ensure the last attestation remained valid through the workflow and no relevant settings/plugin/runtime change occurred.

**Expected result:** `implemented=true`, `measured=true`, `verified=true` and zero blocking mismatches.

**Failure behavior:** do not report verified completion; run re-attestation or escalate.
