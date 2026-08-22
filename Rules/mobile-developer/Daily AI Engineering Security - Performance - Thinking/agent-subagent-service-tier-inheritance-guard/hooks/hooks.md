# Hooks

## Hook 1 — Pre-task policy validation

**Trigger**  
At task startup when multi-agent execution is enabled.

**Action**
- Load deployed tier policy.
- Validate that every configured tier has a numeric rank.
- Validate `unknown_tier_action` and escalation action are supported.
- Capture parent effective tier when available.

**Command/script**
```bash
python3 -m json.tool config/policy.example.json >/dev/null
```
Production hosts should additionally validate the policy against their own schema and runtime tier catalog.

**Expected result**  
Policy parses; parent tier is mapped before any descendant is created.

**Failure behavior**  
Disable child delegation for the task. Do not fall back to an unguarded spawn path.

---

## Hook 2 — Pre-spawn inheritance gate

**Trigger**  
Immediately before `spawn_agent`, `fork`, or equivalent child creation.

**Action**
1. Resolve parent effective tier and rank.
2. Calculate proposed lineage depth and descendant count.
3. Resolve requested child tier if the API exposes one.
4. Reject out-of-budget spawn.
5. Reject higher-tier spawn without explicit bounded approval.
6. When child tier cannot be known until initialization, mark the spawn `pending-attestation` and prevent premium work until Hook 3 passes.

**Command/script**  
Runtime-native hook/interceptor; `service_tier_audit.py` is used as deterministic policy regression coverage, not as a substitute for an atomic production pre-spawn interceptor.

**Expected result**  
A spawn contract containing parent ID, expected child tier, approval reference if any, and lineage-budget state.

**Failure behavior**  
Block spawn and return a structured policy reason. Continue safe parent work if possible.

---

## Hook 3 — Post-spawn tier attestation

**Trigger**  
As soon as the child thread exposes runtime metadata and before substantial/premium model work.

**Action**
- Correlate child thread ID with spawn contract.
- Read effective child service tier.
- Compare observed rank against expected rank.
- Verify approval if rank increased.
- Store first token counter snapshot as measurement baseline.

**Command/script**
For captured JSONL telemetry:
```bash
python3 scripts/service_tier_audit.py /path/to/task-rollouts \
  --policy config/policy.example.json \
  --report service-tier-report.json
```

**Expected result**  
Exit `0`; no unapproved escalation or unknown required child tier.

**Failure behavior**  
Suspend/stop/quarantine the child. Exit code `2` is a policy violation and must not be converted to success by a wrapper.

---

## Hook 4 — Resume/fork re-attestation

**Trigger**  
A child is resumed, forked, rehydrated after restart, or switches execution mode.

**Action**
- Re-read effective tier.
- Re-evaluate active approval scope/expiry.
- Re-establish token counter epoch.
- Ensure the resumed/forked thread still obeys root and immediate-parent ceilings.

**Command/script**  
Same deterministic audit command against the updated telemetry set; production hosts should perform the tier comparison before new premium work begins.

**Expected result**  
Tier remains compliant and usage accounting continues from the correct per-thread counter snapshot.

**Failure behavior**  
At most two bounded metadata-read retries. Persistent mismatch or missing required tier suspends the child.

---

## Hook 5 — Usage budget checkpoint

**Trigger**  
After each child completion, before spawning another review/fix child, or when descendants exceed 25% of the task's configured token/credit budget.

**Action**
- Recompute positive token deltas by thread.
- Calculate child token share and premium-tier share.
- Compare descendant count and depth against policy.
- Require explicit operator approval before crossing any configured hard budget.

**Command/script**
```bash
python3 scripts/service_tier_audit.py /path/to/task-rollouts \
  --policy config/policy.example.json \
  --report service-tier-report.json
```

**Expected result**  
Usage remains within limits and all premium-tier children are approved.

**Failure behavior**  
Stop further delegation; do not terminate unrelated safe parent work automatically unless task policy requires it.

---

## Hook 6 — Final verification gate

**Trigger**  
Before the agent reports a multi-agent task as verified/complete.

**Action**
1. Run full lineage audit.
2. Confirm all known child IDs are correlated.
3. Confirm zero unapproved tier escalations.
4. Confirm zero required unknown tiers.
5. Confirm token delta fixtures/tests pass.
6. Confirm estimated multipliers are labelled as estimates.
7. Require independent verifier sign-off for any run that used premium descendants.

**Command/script**
```bash
python3 -m unittest tests/test_service_tier_audit.py
python3 scripts/service_tier_audit.py /path/to/task-rollouts \
  --policy config/policy.example.json \
  --report service-tier-report.json
```

**Expected result**  
Tests pass and audit exits `0`.

**Failure behavior**  
Report the task as `NOT_VERIFIED` or `BLOCKED`; never hide a violation by relaxing the policy at the final gate.

## Exit-code contract

`service_tier_audit.py` uses:
- `0` — policy passes;
- `2` — policy violation detected;
- `3` — invalid config/input;
- `4` — I/O failure.

CI and host integrations must preserve these semantics rather than treating any produced report file as success.
