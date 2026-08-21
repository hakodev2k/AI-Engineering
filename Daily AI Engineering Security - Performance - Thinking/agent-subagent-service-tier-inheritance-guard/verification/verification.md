# Verification Contract

## Goal

Prove that child service-tier policy is inherited or explicitly overridden, token attribution is not inflated by repeated cumulative snapshots, and no unapproved premium descendant remains hidden at completion.

## Required evidence

- deployed policy and version/hash;
- parent effective-tier baseline;
- parent/child correlation records;
- observed child effective-tier events;
- approval records for deliberate escalation;
- per-thread token telemetry;
- deterministic audit report;
- test results;
- independent verifier result.

## Test matrix

| Case | Expected result |
|---|---|
| Parent `default`, child `default` | Pass |
| Parent `default`, child `priority`, no approval | Fail: `unapproved_tier_escalation` |
| Parent `default`, child `priority`, valid bounded approval | Pass with approval evidence |
| Child tier missing under `unknown_tier_action=fail` | Fail: `unknown_child_tier` |
| Repeated identical cumulative token snapshot | Adds zero new usage |
| Counter decreases because a new epoch starts | New counter value is counted; no negative usage |
| Descendant exceeds configured maximum depth | Fail: `lineage_depth` |
| Descendant count exceeds configured budget | Fail: `descendant_budget` |
| Runtime emits unmapped tier | Fail: `unmapped_tier` |
| Child resumes/forks into higher tier without new approval | Fail after re-attestation |

## Deterministic verification commands

From the package root:

```bash
python3 -m unittest tests/test_service_tier_audit.py
```

For real or captured task telemetry:

```bash
python3 scripts/service_tier_audit.py /path/to/task-rollouts \
  --policy config/policy.example.json \
  --report service-tier-report.json
```

Expected successful audit exit code: `0`.

## Success metrics

### Prevention
- guarded child spawns / total child spawns = **100%**;
- child tier attestation coverage = **100%** for cost-controlled lineages;
- unapproved higher-tier children = **0**;
- required unknown-tier children at completion = **0**;
- lineage depth and descendant count never exceed policy.

### Token accounting
- repeated identical cumulative snapshots add **0** fresh tokens;
- fixture totals match independently calculated ground truth exactly;
- parent and child totals remain separately attributable;
- any configured multiplier is labelled as an estimate, not authoritative provider billing.

### Reliability
- pre/post-spawn guard failures are surfaced explicitly;
- metadata re-attestation retries are bounded to **2**;
- incident hypothesis/mitigation cycles are bounded to **3**;
- no failure path converts a policy violation into success.

## Implemented / Measured / Verified

### Implemented
Use only when:
- policy exists;
- pre-spawn/post-spawn integration points exist;
- audit script and hooks are installed;
- required tests are present.

### Measured
Use only when:
- representative runtime telemetry has been collected;
- parent/child tier distribution is observable;
- per-thread token deltas are computed;
- descendant/depth metrics are recorded.

### Verified
Use only when:
- all positive and negative controls pass;
- a deliberate unapproved escalation is blocked;
- an approved escalation passes with evidence;
- unknown tier behavior matches policy;
- token fixture totals reconcile;
- independent verification completes;
- no blocking discrepancy remains.

Installation alone is never `Verified`.

## Definition of Done

The package/integration is done only when all applicable items below are objectively true:

- Current public evidence is documented in `evidence/research.md`.
- Existing approaches and limitations are documented.
- Parent effective-tier baseline can be captured from a trusted runtime source.
- Every child has an expected tier before substantive execution.
- Child observed tier is attested at initialization and after resume/fork.
- Unapproved tier escalation is rejected or quarantined.
- Scoped approved escalation is supported without blanket authorization.
- Unknown required tier fails closed.
- Descendant/depth budgets are enforced.
- Token accounting uses per-thread deltas and regression tests pass.
- Audit output distinguishes estimated multipliers from authoritative billing.
- Risks and evidence limitations are documented.
- Independent verification passes.
- No required file/reference is missing.
- No secret or raw credential is required by the package.
- No blocking policy violation remains.

## Failure handling

### 1. Tier metadata unavailable
**Detection:** child exists but no authoritative/observable tier marker is available.  
**Evidence:** child ID, parent ID, runtime version, missing field/source.  
**Retry policy:** up to 2 bounded metadata reads.  
**Fallback:** quarantine child; continue safe parent-only execution when possible.  
**Escalation:** runtime/integration owner.  
**Stop condition:** do not allow premium-capable child execution while required tier remains unknown.

### 2. Unapproved higher-tier child
**Detection:** observed rank > expected rank and no valid approval.  
**Evidence:** parent/child IDs, expected/observed tiers, policy snapshot.  
**Retry policy:** one re-read only to rule out initialization lag; never respawn repeatedly.  
**Fallback:** suspend/stop child.  
**Escalation:** human/operator for an explicit exception if genuinely required.  
**Stop condition:** no further work in that child until compliant or approved.

### 3. Token counters inconsistent
**Detection:** impossible totals, unknown counter semantics, or independent totals disagree.  
**Evidence:** sanitized counter sequence and runtime version.  
**Retry policy:** one parser/adapter correction and rerun.  
**Fallback:** mark cost attribution `UNVERIFIED`; preserve raw metadata.  
**Escalation:** telemetry/runtime owner.  
**Stop condition:** do not publish authoritative cost claims from inconsistent local counters.

### 4. Audit/guard dependency unavailable
**Detection:** script/hook cannot execute or policy cannot load.  
**Evidence:** exit code/error, without secrets.  
**Retry policy:** one retry for transient I/O; no unlimited retries.  
**Fallback:** disable further child delegation.  
**Escalation:** operator/infrastructure owner.  
**Stop condition:** do not fail open.

### 5. Provider billing differs from local estimate
**Detection:** provider ledger/export disagrees with configured multiplier estimate.  
**Evidence:** sanitized provider billing record and local lineage report.  
**Retry policy:** none through model speculation.  
**Fallback:** treat provider ledger as authoritative for billing and update policy mapping after validation.  
**Escalation:** provider support if billing itself is disputed.  
**Stop condition:** never present local estimated credits as authoritative.

## Independent review checklist

The verifier must confirm:

- the implementer did not self-approve premium execution;
- the policy source is trusted and immutable for the task;
- child correlation is not based solely on natural-language names;
- missing tier is not silently coerced to Standard;
- token totals do not sum copied cumulative snapshots;
- all loops/retries are bounded;
- provider pricing assumptions are configurable and current;
- README references exactly the files present in the package;
- tests include both allowed and forbidden cases.

## Verification outcome schema

Use a compact result such as:

```json
{
  "status": "VERIFIED",
  "policy_violations": 0,
  "unknown_required_tiers": 0,
  "unapproved_escalations": 0,
  "tests_passed": true,
  "independent_review": true,
  "authoritative_billing_verified": false,
  "note": "Local multipliers remain estimates unless provider ledger is supplied."
}
```

Allowed final statuses are `VERIFIED`, `NOT_VERIFIED`, and `BLOCKED`.
