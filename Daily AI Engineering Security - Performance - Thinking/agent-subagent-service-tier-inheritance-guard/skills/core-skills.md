# Core Skills

## Skill 1 — Establish the lineage cost-policy baseline

**Purpose**  
Create a trusted parent execution-policy snapshot before any child agent is spawned.

**Trigger**  
Before the first subagent spawn in a task, and again whenever the user changes service tier, model mode, reasoning mode, cost ceiling, or delegation policy.

**Inputs**
- parent thread ID;
- effective parent service tier from runtime telemetry/config;
- current policy file;
- current model and pricing/multiplier mapping if available;
- approved exceptions already in force.

**Preconditions**
- The parent thread identity is known.
- Tier rank mapping exists for every tier the host may emit.
- Configuration comes from a trusted local/operator source, not retrieved task content.

**Required context**
- Parent effective tier, not only a UI label.
- Whether a previous premium override is still active.
- Current descendant/depth budget.

**Tools**
- runtime/session metadata reader;
- `scripts/service_tier_audit.py` for historical/fixture validation;
- policy configuration.

**Procedure**
1. Resolve the parent thread identity from runtime state.
2. Resolve its current effective service tier from the most authoritative local/runtime marker available.
3. Normalize the tier using `tier_rank`.
4. Record a policy snapshot with timestamp, parent thread ID, expected child ceiling, descendant budget, depth budget, and active approvals.
5. If parent tier is unknown, stop child creation unless policy explicitly permits `unknown`.
6. If the user changes tier later, create a new snapshot; never silently mutate historical policy records.
7. Pass the snapshot identifier into the spawn workflow or equivalent host metadata.

**Decisions**
- Known parent tier and valid policy: proceed.
- Unknown/unmapped parent tier: quarantine delegation.
- Existing premium approval: verify actor, reason, scope, and expiry before reuse.

**Constraints**
- Do not infer billing from tier labels beyond configured mappings.
- Do not accept child-provided statements as proof of parent policy.
- Do not default unknown tiers to the cheapest tier for enforcement.

**Expected output**
A machine-readable lineage policy snapshot with the parent tier and maximum child tier.

**Metrics**
- percentage of child spawns with a baseline snapshot;
- number of unknown parent-tier blocks;
- number of stale approval rejections.

**Verification**
An independent verifier must be able to reconstruct the same expected child ceiling from the snapshot and policy.

**Failure handling**
If parent tier cannot be established, record evidence and stop delegation. Continue the task in the parent when safe rather than weakening the gate.

**Stop conditions**
- baseline captured successfully; or
- delegation is blocked because required state is unknown/inconsistent.

---

## Skill 2 — Gate a subagent spawn against cost-policy inheritance

**Purpose**  
Prevent a child agent from silently starting above its parent's allowed service-tier ceiling.

**Trigger**  
Every spawn/fork/resume operation that creates or reactivates a child execution context.

**Inputs**
- lineage policy snapshot;
- proposed child model/tier/mode, if the spawn API exposes it;
- explicit override request, if any;
- current lineage depth and descendant count.

**Preconditions**
- Baseline Skill 1 passed.
- Spawn identity or prospective child handle can be correlated with the eventual child thread.

**Required context**
- parent tier ceiling;
- child requested tier;
- depth/descendant limits;
- approval scope.

**Tools**
- spawn interceptor/pre-tool hook;
- policy rank comparison;
- approval store.

**Procedure**
1. Calculate the next lineage depth and projected descendant count.
2. Reject the spawn if either exceeds policy.
3. If the child tier is explicit, compare its rank with the parent ceiling.
4. If the child tier is higher, require explicit approval with actor and reason; apply the narrowest scope and bounded TTL.
5. If the spawn API does not expose a tier, mark the child `pending-attestation`, not `assumed-safe`.
6. Execute the spawn only after the preconditions pass.
7. Record parent ID, child correlation handle, expected tier, approval ID if applicable, and spawn timestamp.

**Decisions**
- Child <= parent tier: allow.
- Child > parent tier with valid approval: allow under approval scope.
- Child > parent tier without approval: block.
- Child tier unknown: allow only into a state where premium work cannot start until post-spawn attestation succeeds.

**Constraints**
- No blanket approval for all future descendants.
- No approval created by the implementing subagent itself.
- Nested children inherit the immediate parent's effective ceiling unless an operator policy specifies a stricter root ceiling.

**Expected output**
A spawn decision plus correlation metadata for post-spawn verification.

**Metrics**
- blocked escalation count;
- approved escalation count;
- pending-attestation count;
- percentage of spawns with explicit expected tier.

**Verification**
Post-spawn Skill 3 must verify observed runtime tier matches the allowed tier.

**Failure handling**
On interceptor failure, fail closed for premium-capable child creation. Never bypass because the guard is unavailable.

**Stop conditions**
Spawn allowed with recorded contract, or blocked with a policy reason.

---

## Skill 3 — Attest child effective tier and token deltas

**Purpose**  
Verify that the actual child runtime matches the spawn contract and collect non-duplicated usage evidence.

**Trigger**  
Immediately after child initialization; again after resume/fork, model-mode switch, compaction boundary that may reload config, or suspicious quota movement.

**Inputs**
- spawn contract;
- child runtime/rollout telemetry;
- policy;
- previous per-thread token snapshot.

**Preconditions**
- Child identity is correlated with its parent/spawn record.

**Required context**
- expected tier;
- observed tier markers;
- cumulative token snapshots;
- approval state.

**Tools**
- runtime metadata reader;
- `scripts/service_tier_audit.py`;
- telemetry store.

**Procedure**
1. Resolve the child thread ID and parent linkage.
2. Read observed service tier from runtime telemetry before substantial work where possible.
3. If tier is missing, mark `unknown`; do not silently map to Standard.
4. Compare observed rank with expected ceiling.
5. If observed rank is higher and no valid approval covers it, suspend/stop the child before further premium work.
6. Capture cumulative token counters.
7. Convert cumulative counters to positive per-thread deltas; treat counter resets as a new epoch.
8. Do not sum duplicated/copied parent-history counters as fresh usage.
9. Emit an attestation record containing expected tier, observed tier, token deltas, decision, and evidence source.

**Decisions**
- Match/lower tier: pass.
- Higher tier + valid approval: pass with escalation annotation.
- Higher tier + no approval: violation.
- Unknown tier: apply `unknown_tier_action`.

**Constraints**
- Local token totals are telemetry, not authoritative billed credits.
- Estimation must label configured multipliers as estimates.
- Never edit telemetry to make a mismatch disappear.

**Expected output**
A child attestation and lineage usage row.

**Metrics**
- attestation coverage;
- unapproved escalation rate;
- unknown-tier rate;
- total child tokens by tier;
- premium-estimated token share.

**Verification**
Run synthetic fixtures with repeated cumulative snapshots, counter resets, valid inheritance, and invalid escalation. Expected totals and decisions must match exactly.

**Failure handling**
If the child cannot be attested, stop or quarantine it and continue in the parent where safe.

**Stop conditions**
Attestation passes, or child execution is suspended/escalated.

---

## Skill 4 — Reconcile a completed lineage

**Purpose**  
Produce evidence-based final attribution and prove no unapproved tier escalation remains.

**Trigger**  
Before declaring a multi-agent task complete, and after any material quota anomaly.

**Inputs**
- all parent/child telemetry for the task;
- policy snapshots;
- approvals;
- audit report.

**Preconditions**
- All known child threads have terminal or explicitly tracked states.

**Required context**
- lineage graph;
- expected/observed tier per thread;
- token deltas;
- approval records.

**Tools**
- `scripts/service_tier_audit.py`;
- independent verifier/reviewer.

**Procedure**
1. Run the audit across all task rollout JSONL sources.
2. Confirm each child has a parent edge and tier state.
3. Confirm no descendant/depth budget was exceeded.
4. Confirm every higher-tier child has a valid approval.
5. Compare aggregate token deltas against an independent fixture or host counter when available.
6. Classify each assertion as Implemented, Measured, or Verified.
7. If provider billing is unavailable, explicitly mark authoritative billed credits as unknown.
8. Preserve the report as audit evidence without secrets or prompt content.

**Decisions**
- Zero blocking violations and verification passed: complete.
- Any unapproved escalation/unknown required tier/accounting mismatch: do not claim verified completion.

**Constraints**
- Implementer cannot be the sole verifier of a premium-tier incident.
- Do not infer causal billing from quota percentages alone.

**Expected output**
A final lineage verification report suitable for CI or human review.

**Metrics**
- violations per task;
- token share by parent vs descendants;
- premium-tier share;
- verification coverage.

**Verification**
Independent reviewer checks report against policy and raw telemetry identifiers, without needing model chain-of-thought.

**Failure handling**
Preserve evidence, stop further premium delegation, and escalate to the operator/provider if authoritative billing reconciliation is required.

**Stop conditions**
Verified completion or a clearly documented blocking discrepancy.
