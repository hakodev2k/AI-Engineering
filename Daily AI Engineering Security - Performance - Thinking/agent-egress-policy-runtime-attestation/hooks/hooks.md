# Hooks

## Hook — pre-task-network-policy

**Trigger:** Before any task that requires outbound network access.

**Action:** Validate and attest the declared policy in the active runtime.

**Command:** `python scripts/egress_attest.py config/policy.json --output .agent/egress-attestation.json`

**Expected result:** Exit 0, zero over-permissive and zero over-restrictive probes, current policy SHA-256 recorded.

**Failure behavior:** Exit 2 blocks network-dependent execution. Exit 3/4 marks the environment indeterminate and blocks security claims.

## Hook — policy-change-invalidation

**Trigger:** Policy file, proxy config, sandbox config, runtime/session identity, or task binding changes.

**Action:** Invalidate previous verification and require a fresh full attestation.

**Command:** Host-specific orchestration should compare SHA-256 of the current policy to `policy_sha256` in the last report, then invoke `egress_attest.py` when different.

**Expected result:** No stale report is reused across different policy/runtime pairs.

**Failure behavior:** Treat status as `Not Verified`; do not fall back to the previous report.

## Hook — pre-sensitive-network-action

**Trigger:** Before package publishing, source upload, production API access, secret-bearing network calls, deployment, or other sensitive egress.

**Action:** Check that the latest attestation belongs to the active runtime and policy hash and is still within the organization's attestation lifetime.

**Command/script:** Re-run `egress_attest.py` when freshness or identity cannot be proven.

**Expected result:** Current deny controls remain effective before the sensitive action.

**Failure behavior:** Stop and escalate; never bypass the proxy/sandbox to make the action work.

## Hook — post-remediation-verification

**Trigger:** After any change intended to fix an egress mismatch.

**Action:** Run the complete allow+deny matrix and hand the report to an independent verifier.

**Command:** `python scripts/egress_attest.py config/policy.json --output .agent/egress-attestation-after.json`

**Expected result:** Exit 0 and no control weakening relative to the approved manifest.

**Failure behavior:** Maximum two remediation cycles; then stop and preserve evidence.

## Hook — final-security-gate

**Trigger:** Before marking a restricted-network task complete.

**Action:** Assert all of the following: report exists; policy hash matches; runtime identity matches; zero mismatches; independent verification completed after remediation.

**Expected result:** Status may be labeled `Verified` only when every assertion holds.

**Failure behavior:** Report `Implemented` or `Measured`, not `Verified`.
