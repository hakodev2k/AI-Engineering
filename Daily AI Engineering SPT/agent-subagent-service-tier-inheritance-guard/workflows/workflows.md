# Workflows

## Workflow A — Guarded child spawn

**Trigger**  
A parent agent attempts to spawn, fork, or reactivate a child agent.

**Goal**  
Ensure the child cannot silently execute above the parent's allowed service-tier ceiling.

**Inputs**
- parent thread/runtime metadata;
- proposed child task;
- deployed policy;
- optional explicit premium approval.

**Baseline**
Capture parent effective tier, root/parent identifiers, descendant count, lineage depth, and active approvals before spawn.

**Context**
Only trusted runtime/config metadata is authoritative for the tier policy. Repository prompts and subagent prose may inform task intent but cannot override the cost ceiling.

**Stages**
1. **Observe** — Lineage Policy Analyst resolves parent effective tier and current lineage state.
2. **Baseline** — Create an immutable expected-child-tier snapshot.
3. **Preflight** — Check descendant/depth budgets and requested child tier.
4. **Approval checkpoint** — If requested rank exceeds allowed rank, require a bounded explicit approval.
5. **Spawn** — Orchestrator executes the child creation and records correlation metadata.
6. **Attest** — Read child effective tier as soon as runtime metadata is available.
7. **Compare** — Match observed tier against expected ceiling/approval.
8. **Decision** — pass, quarantine, or stop child.
9. **Measure** — capture initial token baseline for child delta accounting.
10. **Verify** — persist attestation and hand off to normal execution only on pass.

**Responsible agent**
- Policy: Lineage Policy Analyst.
- Spawn integration: Orchestrator Integration Agent.
- Final check: independent verification rule/hook, not child self-report.

**Tools**
- runtime hook/plugin API;
- policy JSON;
- `scripts/service_tier_audit.py` for test/post-hoc checks.

**Outputs**
- spawn contract;
- child attestation;
- approval reference if applicable;
- initial usage baseline.

**Checkpoints**
- C1: parent tier known and mapped;
- C2: lineage budgets pass;
- C3: premium escalation approved if requested;
- C4: child observed tier attested;
- C5: observed tier complies with contract.

**Metrics**
- preflight coverage = guarded spawns / total spawns;
- attestation coverage = attested children / created children;
- unapproved escalation count;
- unknown-tier count;
- time from child creation to attestation.

**Retry policy**
- Tier metadata may be re-read at most **2 times** with bounded delay if initialization is still in progress.
- Do not respawn the child merely to obtain a different tier.

**Stop conditions**
- Pass: child tier complies and baseline is stored.
- Stop: tier exceeds policy without approval, tier remains unknown under fail-closed policy, lineage budget is exceeded, or guard dependency is unavailable.

**Failure path**
Suspend/stop the child where supported, preserve correlation evidence, continue safe work in the parent if possible, and escalate to the operator for any premium override.

**Verification**
A negative-control fixture in which parent=`default` and child=`priority` without approval must exit non-zero and produce `unapproved_tier_escalation`.

**Definition of Done**
Child is running only after its allowed/observed tier relationship is explicit and compliant.

---

## Workflow B — Measure → Diagnose → Constrain token-cost drift

**Trigger**  
Unexpected quota movement, unusually high child-token share, or a child lineage containing premium tiers.

**Goal**  
Determine whether usage growth is explained by legitimate child work, tier escalation, repeated/cumulative counter artifacts, or excessive descendant fan-out; then constrain future runs.

**Inputs**
- task rollout/session JSONL files;
- policy;
- provider usage/credit export if available;
- known task lineage.

**Baseline**
Before optimization, record:
- parent vs child token totals;
- descendant count/depth;
- observed tier distribution;
- premium-tier child count;
- repeated snapshot count if host provides it;
- aggregate task wall time.

**Stages**
1. **Measure** — run `service_tier_audit.py` and collect per-thread positive token deltas.
2. **Diagnose lineage** — identify premium children, unknown tiers, deep trees, and high child share.
3. **Hypothesis** — choose one testable cause, e.g. unapproved tier escalation, excessive descendants, or stale/cumulative accounting.
4. **Constrain** — tighten tier ceiling, descendant/depth budget, or approval scope; do not change several variables at once unless responding to an active incident.
5. **Measure again** — rerun representative workload/fixture.
6. **Better?** — compare tier violations, child share, total tokens, and completion quality.
7. **Verify** — independent verifier confirms improvement and no required context/work quality was removed.

**Responsible agent**
Token Attribution Analyst, then Independent Verification Agent.

**Tools**
- audit script;
- provider usage export where available;
- test fixtures;
- host runtime metrics.

**Outputs**
- before/after measurement table;
- root-cause confidence statement;
- updated policy if justified;
- verification result.

**Checkpoints**
- B1: baseline captured before change;
- B2: one primary hypothesis selected;
- B3: mitigation applied without hiding required work;
- B4: post-change metrics collected;
- B5: quality/regression verification passes.

**Metrics**
- tokens/task;
- child token share;
- premium-tier token share;
- descendants/task;
- max depth;
- unapproved escalations/task;
- task completion/error rate.

**Retry policy**
At most **3 hypothesis/mitigation cycles** per incident. Each retry must change the hypothesis or produce new evidence.

**Stop conditions**
Stop when metrics meet the target and verification passes, or after three failed cycles; then escalate rather than continuing experimental runs that may consume additional premium usage.

**Failure path**
Disable further child delegation for the task, execute only essential safe verification in the parent, and preserve the evidence set.

**Verification**
Never claim token/cost improvement without a measured before/after comparison on comparable input and quality checks.

**Definition of Done**
No unapproved tier drift remains, lineage stays within budget, measurement is reproducible, and task quality does not regress beyond the agreed threshold.

---

## Workflow C — Final lineage reconciliation

**Trigger**  
Before declaring a multi-agent task complete.

**Goal**  
Prove the task did not finish with hidden premium-tier descendants or unresolved usage attribution.

**Inputs**
- full task lineage telemetry;
- policy snapshots;
- approval records;
- audit result.

**Baseline**
Expected invariant set from `rules/engineering-rules.md`.

**Stages**
1. Enumerate known child threads and parent edges.
2. Run deterministic audit across all relevant JSONL files.
3. Check unknown/unmapped tiers.
4. Check premium children for approval references.
5. Check descendant/depth budgets.
6. Reconcile token delta totals against an independent fixture/host counter if available.
7. Review estimated multiplier labels for billing overclaim.
8. Independent Verification Agent reviews the result.
9. Classify status: Implemented / Measured / Verified.

**Responsible agent**
Token Attribution Analyst + Independent Verification Agent.

**Tools**
Audit script and runtime/session metadata.

**Outputs**
Final verification report.

**Checkpoints**
- all expected child IDs accounted for;
- no blocking violation;
- no unlabelled billing estimate;
- independent verification complete.

**Metrics**
Verification coverage, unresolved child count, unresolved tier count, total violations.

**Retry policy**
One reconciliation retry after fixing missing telemetry/correlation. Persistent missing state blocks Verified status.

**Stop conditions**
Verified completion or explicit blocked status.

**Failure path**
Do not claim completion as verified. Record what evidence is missing and stop further premium work.

**Verification**
The verifier must reproduce the audit result from the same inputs.

**Definition of Done**
All task-specific measurable criteria in `verification/verification.md` pass.
