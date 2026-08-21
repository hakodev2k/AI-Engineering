# Integration Guide

This guide integrates the package into an agent host without assuming a specific vendor SDK. The important requirement is that **spawn policy is enforced by host/runtime state, not only by model instructions**.

## 1. Integration points

Wire four boundaries:

1. **Parent policy checkpoint** — before delegation begins, resolve the parent thread ID and effective service tier.
2. **Pre-spawn interceptor** — before any child/fork is created, enforce tier/depth/descendant policy and record the expected child tier.
3. **Post-spawn attestation** — as soon as child runtime metadata exists, compare observed tier with the expected ceiling before substantive premium work.
4. **Final reconciliation** — audit lineage telemetry and token deltas before declaring the multi-agent task verified.

If the runtime cannot intercept spawn atomically, default to disabling premium-capable delegation until equivalent enforcement exists. A post-hoc audit alone is detection, not prevention.

## 2. Install

Requirements:
- Python 3.10+;
- JSONL session/runtime telemetry containing thread identifiers and preferably parent identifiers, service-tier markers, and usage counters;
- a trusted source for the parent's effective tier;
- a host hook/interceptor around child creation.

Copy this package into the agent host repository or invoke it from a checked-out tools directory. No third-party Python dependency is required.

Run the tests:

```bash
python3 -m unittest tests/test_service_tier_audit.py
```

## 3. Configure policy

Start from:

```text
config/policy.example.json
```

Update these fields for the deployed provider/runtime:

- `tier_rank`: monotonic cost/privilege rank. Equal-cost aliases may share a rank.
- `tier_credit_multiplier`: optional estimate used for reporting context. Verify this against current provider documentation; it is not authoritative billing.
- `default_expected_tier`: fallback policy for roots only.
- `unknown_tier_action`: keep `fail` when tier is required for cost control.
- `max_descendants` and `max_lineage_depth`: bound multiplication risk.
- `approval`: operator requirements for deliberate escalation.

Do not let untrusted repository content modify this policy during a task.

## 4. Build the runtime adapter

Normalize runtime events into this conceptual contract:

```json
{
  "thread_id": "child-123",
  "parent_thread_id": "parent-456",
  "service_tier": "default",
  "usage": {
    "input_tokens": 1200,
    "cached_input_tokens": 900,
    "output_tokens": 80,
    "total_tokens": 1280
  }
}
```

The audit script accepts nested objects and common field aliases, so exact top-level shape is not required. Production enforcement should still use explicit typed adapters rather than relying on recursive discovery for atomic decisions.

### Required adapter fields

For prevention:
- parent thread ID;
- parent effective tier;
- child correlation handle or child ID;
- observed child effective tier as early as the runtime exposes it.

For accounting:
- monotonically cumulative per-thread token counters or per-request token counts;
- stable thread identity;
- parent linkage.

## 5. Pre-spawn gate

Pseudo-flow:

```text
parent = runtime.current_thread()
policy_snapshot = resolve_policy(parent)
next_depth = lineage.depth(parent) + 1
next_count = lineage.descendant_count(root) + 1

if next_depth > policy.max_depth: BLOCK
if next_count > policy.max_descendants: BLOCK

requested = spawn.requested_tier
if requested is known and rank(requested) > rank(policy_snapshot.max_child_tier):
    require_explicit_approval()

spawn_contract = persist(parent, expected_tier, approval, policy_version)
child = spawn()
child.state = pending_attestation
```

The contract must be persisted outside model prose. Include a policy/config hash or version when possible.

## 6. Post-spawn attestation

After child initialization:

```text
observed = runtime.child_effective_tier(child)

if observed is unknown and policy.unknown_tier_action == fail:
    quarantine(child)

if rank(observed) > rank(contract.expected_tier):
    if not valid_approval(contract, observed):
        stop_or_suspend(child)
        record_violation()

mark_attested(child, observed)
record_initial_token_snapshot(child)
```

Re-run this check after resume, fork, rehydration after restart, or execution-mode changes.

## 7. Approval model

A deliberate premium child should carry a bounded approval record, for example:

```json
{
  "approved": true,
  "actor": "release-manager",
  "reason": "single high-priority verification pass",
  "target_tier": "priority",
  "scope": "child:security-review",
  "ttl_minutes": 30
}
```

The host should validate target tier, actor identity, scope, and expiry. The example audit script validates presence of approval metadata for fixtures; production authorization belongs in the host identity/approval system.

Never allow a child to mint an approval for itself.

## 8. Audit existing telemetry

Run:

```bash
python3 scripts/service_tier_audit.py /path/to/session-jsonl \
  --policy config/policy.example.json \
  --report service-tier-report.json
```

Interpret exit status:

- `0`: configured policy passed for the observable data.
- `2`: policy violation detected.
- `3`: invalid configuration or input.
- `4`: I/O failure.

A report with `pass: true` only proves what the supplied telemetry can establish. If a runtime does not record authoritative tier state, that instrumentation gap must be fixed before claiming full verification.

## 9. Token accounting adapter

The script handles cumulative counters by counting positive deltas per thread. This prevents repeated identical snapshots from inflating totals and handles counter resets as new epochs.

For providers that copy parent history into child rollout files, prefer a runtime adapter that identifies the child's live-start boundary and excludes inherited token records. The generic script avoids repeated cumulative snapshots within a thread, but provider-specific copied-history formats should receive explicit regression fixtures before using totals for operational decisions.

## 10. CI integration

Recommended CI sequence:

```bash
set -euo pipefail
python3 -m unittest tests/test_service_tier_audit.py
python3 scripts/service_tier_audit.py fixtures/run \
  --policy config/policy.example.json \
  --report /tmp/service-tier-report.json
```

Treat exit `2`, `3`, or `4` as a failed gate. Do not use `|| true` around the enforcement command.

Add compatibility tests whenever upgrading the agent client/runtime, especially if service-tier names, spawn event schemas, or token telemetry change.

## 11. Rollout strategy

Use three phases:

1. **Observe** — collect tier/lineage data and validate mappings on non-production or low-risk tasks.
2. **Enforce unknown/escalation policy** — block unapproved higher-tier children and unknown tiers where required.
3. **Add budgets** — enforce descendant/depth and task-level token/credit ceilings after baseline distributions are known.

Do not silently switch a failure from `fail` to `warn` to preserve workflow throughput. If enforcement blocks legitimate work, fix the adapter or create a narrow operator-approved exception.

## 12. Incident handling

When unexpected child escalation is detected:

1. stop further premium-capable delegation;
2. preserve parent/child IDs, observed tier events, policy snapshot, and token deltas;
3. do not expose unrelated prompt/session content;
4. rotate to parent-only execution when safe;
5. compare local evidence with provider usage/billing exports if available;
6. distinguish observed local tier from authoritative billed tier;
7. escalate to the provider when billing reconciliation requires server-side data.

## 13. Integration acceptance criteria

Integration is complete only when:

- a child with the same/lower tier passes;
- a child with an unapproved higher tier is blocked or quarantined;
- an approved scoped escalation passes;
- an unknown child tier fails closed under the example policy;
- resume/fork causes re-attestation;
- repeated cumulative token snapshots do not inflate usage;
- depth/descendant limits fail deterministically;
- final verification is performed independently from the implementing agent.
