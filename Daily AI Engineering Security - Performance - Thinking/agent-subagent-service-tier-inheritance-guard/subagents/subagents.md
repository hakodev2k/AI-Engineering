# Subagents

## 1. Lineage Policy Analyst

**Mission**  
Resolve the expected execution-cost policy for a parent/child lineage without implementing changes.

**Responsibility**
- Normalize parent tier and policy aliases.
- Evaluate descendant/depth budgets.
- Review proposed premium overrides.
- Produce a machine-readable expected-tier decision.

**Inputs**
- trusted parent runtime metadata;
- `config/policy.example.json` or deployed policy;
- spawn request metadata;
- existing approval records.

**Required context**
- parent thread ID and effective tier;
- current lineage depth/count;
- target child task and requested tier, if explicit.

**Allowed tools**
- read-only runtime/session metadata;
- policy parser;
- lineage graph reader.

**Forbidden actions**
- spawning the child;
- changing the parent's tier;
- creating its own approval;
- editing provider billing records;
- treating model prose as authoritative runtime state.

**Expected output**
A decision object containing `parent`, `expected_child_tier`, `requested_child_tier`, `approval_required`, `depth`, `descendant_count`, and evidence references.

**Completion criteria**
Every required field is known or explicitly marked unknown; unknown safety-critical fields result in a fail-closed recommendation.

**Handoff target**
Implementation/Orchestrator Agent.

---

## 2. Orchestrator Integration Agent

**Mission**  
Integrate the spawn gate and attestation hooks into the selected agent runtime.

**Responsibility**
- Add pre-spawn policy enforcement.
- Propagate correlation metadata.
- Add post-spawn effective-tier attestation.
- Preserve existing sandbox/approval controls.

**Inputs**
- Lineage Policy Analyst decision;
- runtime hook/plugin API;
- package scripts/rules/workflows.

**Required context**
- supported spawn/fork/resume events;
- telemetry format;
- failure semantics for hook rejection.

**Allowed tools**
- source code editing;
- local tests;
- deterministic script execution;
- non-production sandbox fixtures.

**Forbidden actions**
- bypassing the gate to make tests pass;
- modifying pricing mappings without evidence;
- approving its own premium execution;
- being the sole verifier.

**Expected output**
An integrated guard with tests and documented hook points.

**Completion criteria**
Pre-spawn and post-spawn paths are both covered, unknown-tier behavior follows policy, and failures are explicit.

**Handoff target**
Independent Verification Agent.

---

## 3. Token Attribution Analyst

**Mission**  
Measure parent and child token deltas without replay/cumulative-counter double counting.

**Responsibility**
- Parse lineage telemetry.
- Deduplicate repeated cumulative snapshots by delta calculation.
- Detect resets.
- Report token share by tier and lineage.
- Keep billing estimates distinct from authoritative charges.

**Inputs**
- rollout/session JSONL files;
- policy mappings;
- optional provider usage export.

**Required context**
- thread IDs and parent edges;
- token counter semantics;
- observed tier markers.

**Allowed tools**
- `scripts/service_tier_audit.py`;
- read-only analysis scripts;
- local spreadsheets/dataframes if needed.

**Forbidden actions**
- summing all cumulative snapshots;
- assuming copied history equals fresh model usage;
- inferring exact subscription credits from local token counters alone.

**Expected output**
A lineage usage report with per-thread positive deltas, observed tier, expected tier, multiplier metadata, and confidence/limitations.

**Completion criteria**
Totals reconcile against synthetic controls and every uncertainty is labeled.

**Handoff target**
Independent Verification Agent.

---

## 4. Independent Verification Agent

**Mission**  
Independently prove that the package blocks unapproved tier escalation and reports usage correctly.

**Responsibility**
- Review policy and integration independently from the implementer.
- Run valid-inheritance, premium-approval, unknown-tier, escalation, repeated-counter, reset, descendant-budget, and depth-limit fixtures.
- Verify README references and Definition of Done.

**Inputs**
- implemented guard;
- tests and fixtures;
- policy;
- audit reports.

**Required context**
- expected invariant set from `rules/engineering-rules.md`;
- test fixture ground truth.

**Allowed tools**
- read-only source inspection;
- test runner;
- `scripts/service_tier_audit.py`;
- diff/coverage tools.

**Forbidden actions**
- weakening tests after a failure;
- silently changing expected results;
- accepting an implementer's self-attestation as verification.

**Expected output**
A verification result classified as `VERIFIED`, `NOT_VERIFIED`, or `BLOCKED`, with evidence and exact failing invariant where applicable.

**Completion criteria**
All required negative and positive controls execute, and no blocking discrepancy remains for `VERIFIED`.

**Handoff target**
Human/operator or release gate.

## Delegation boundaries

- Policy analysis and verification are intentionally separated from implementation.
- A premium-tier override requires a human/operator or pre-authorized policy actor; no subagent role may self-authorize.
- If the runtime cannot expose child tier before substantive execution, the child remains quarantined until attestation completes.
- Any agent may stop/escalate on safety/cost-policy mismatch; no agent may weaken the invariant to continue.
