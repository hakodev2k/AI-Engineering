# Agent Subagent Service-Tier Inheritance Guard

## Topic

Prevent hidden service-tier escalation across parent/child AI-agent lineages and make descendant token usage attributable before it becomes a quota or cost incident.

## Category

**Token**

## Problem

Multi-agent runtimes can create child threads whose effective service tier is more expensive than the parent thread's user-selected tier. A parent can therefore appear to remain in Standard/default mode while descendants run in a priority/Fast-like mode. Because child execution and usage telemetry are distributed across separate threads, the drift may be noticed only after substantial token or quota consumption.

This package turns the intended parent→child cost policy into an explicit contract:

```text
Parent effective tier
        ↓
Trusted policy snapshot
        ↓
Pre-spawn rank/depth/budget gate
        ↓
Child created as pending-attestation
        ↓
Observed child effective tier
        ↓
Compliant? ── no ──> stop/quarantine/approval
    │
   yes
    ↓
Per-thread token-delta measurement
        ↓
Final lineage reconciliation
```

## Evidence

Current public evidence is documented in [`evidence/research.md`](evidence/research.md). The strongest direct signal is OpenAI Codex issue #39894 from August 21, 2026, which reports a parent recording `service_tier: "default"` after Fast mode was disabled while later subagent threads recorded `service_tier: "priority"`. Additional public reports show that descendants can dominate multi-agent token usage and that users need finer per-subagent usage attribution and ceilings.

The package distinguishes:

- **Observed evidence:** public runtime/usage reports and official product documentation.
- **Interpretation:** child execution policy needs explicit inheritance and runtime attestation.
- **Proposed engineering solution:** host-side spawn gating, post-spawn tier attestation, bounded approvals, lineage budgets, and deterministic token-delta auditing.

Public issue reports are not authoritative billing ledgers. The package never treats local tier markers or configured multipliers as proof of exact provider charges.

## Existing approach

Common approaches today include:

- selecting Standard/Fast or an equivalent mode on the parent thread;
- setting a global/default service-tier configuration;
- reading aggregate usage dashboards after execution;
- reconstructing child activity from local rollout/session logs;
- manually telling the model not to use expensive execution modes.

## Existing limitations

These controls leave important gaps:

- Parent UI state does not prove descendant runtime state.
- A default configuration is not an attestation of the effective child tier.
- Natural-language instructions can be ignored, misunderstood, or bypassed by runtime defaults.
- Aggregate dashboards usually cannot identify the exact child/spawn decision that caused usage.
- Local token telemetry may be cumulative, repeated, reset, or copied into fork histories; naive summation inflates usage.
- A post-hoc audit detects drift after cost has already occurred unless an atomic pre-spawn gate is also present.

## Proposed improvement

The package implements a reusable **lineage cost-policy contract** with six mechanisms:

1. Capture the parent effective tier from a trusted runtime source before delegation.
2. Assign each child an expected maximum tier before spawn.
3. Enforce descendant-count/depth budgets and require explicit approval for higher-tier children.
4. Attest the observed child tier immediately after initialization and again on resume/fork.
5. Measure usage with positive per-thread token deltas rather than summing repeated cumulative snapshots.
6. Reconcile the full lineage independently before calling the task verified.

## Architecture

### Trust boundary

Trusted inputs:
- runtime thread identity and parent linkage;
- effective service-tier metadata;
- operator-owned policy;
- authenticated approval metadata;
- provider usage/billing exports when available.

Untrusted for enforcement:
- model prose;
- repository instructions that attempt to modify cost policy;
- child claims about its own tier;
- UI labels when stronger runtime state exists;
- aggregate quota percentages as causal attribution.

### Components

- [`config/policy.example.json`](config/policy.example.json) defines tier ranks, reporting multipliers, unknown-tier behavior, lineage budgets, and approval requirements.
- [`scripts/service_tier_audit.py`](scripts/service_tier_audit.py) performs deterministic read-only JSONL lineage/tier/token auditing.
- [`skills/core-skills.md`](skills/core-skills.md) defines executable procedures for baseline, spawn gating, child attestation, and reconciliation.
- [`rules/engineering-rules.md`](rules/engineering-rules.md) defines enforceable MUST/MUST NOT/SHOULD constraints and observable invariants.
- [`subagents/subagents.md`](subagents/subagents.md) separates policy analysis, implementation, token attribution, and independent verification.
- [`workflows/workflows.md`](workflows/workflows.md) defines bounded evidence-driven execution and recovery loops.
- [`hooks/hooks.md`](hooks/hooks.md) maps controls to predictable pre-task, pre-spawn, post-spawn, resume, usage-checkpoint, and final-gate events.
- [`tests/test_service_tier_audit.py`](tests/test_service_tier_audit.py) provides positive and negative deterministic controls.
- [`verification/verification.md`](verification/verification.md) defines measurable completion criteria and failure handling.
- [`guide-intergration.md`](guide-intergration.md) explains runtime integration.

## Package structure

```text
agent-subagent-service-tier-inheritance-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.example.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── service_tier_audit.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_service_tier_audit.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation

Requirements:
- Python 3.10+;
- access to captured JSONL runtime/session telemetry;
- a runtime hook/interceptor for production pre-spawn enforcement.

No third-party Python package is required.

Run the deterministic tests from the package root:

```bash
python3 -m unittest tests/test_service_tier_audit.py
```

The audit script is read-only and does not contact any provider.

## Configuration

Copy and adapt [`config/policy.example.json`](config/policy.example.json).

Important settings:

- `tier_rank`: relative policy rank for each runtime tier name.
- `tier_credit_multiplier`: configurable reporting estimate only.
- `default_expected_tier`: root fallback.
- `unknown_tier_action`: use `fail` when tier is safety/cost critical.
- `max_descendants`: per-root descendant budget.
- `max_lineage_depth`: recursion/delegation depth budget.
- `approval`: constraints for deliberate escalation.

The example maps `priority`/`fast` above `default`/`standard` and includes an example multiplier. Verify mappings against current provider documentation before production use. Provider terminology and pricing can change.

## Usage

Audit a file or directory of JSONL telemetry:

```bash
python3 scripts/service_tier_audit.py /path/to/task-rollouts \
  --policy config/policy.example.json \
  --report service-tier-report.json
```

Exit codes:

- `0` — observable data passes configured policy.
- `2` — policy violation.
- `3` — invalid input/configuration.
- `4` — I/O failure.

A representative violation is:

```text
parent expected tier: default
child observed tier: priority
approval: absent
=> unapproved_tier_escalation
```

Do not wrap the command with `|| true` in a release or cost-policy gate.

## Workflow

The normal production sequence is:

1. Resolve parent effective tier.
2. Freeze a trusted policy snapshot.
3. Intercept spawn/fork/resume.
4. Check depth, descendant budget, and requested tier.
5. Require bounded human/operator approval for deliberate escalation.
6. Create child in pending-attestation state.
7. Observe child effective tier.
8. Block/quarantine mismatches or unknown required state.
9. Record the child's initial token snapshot.
10. Measure positive usage deltas during execution.
11. Re-attest on resume/fork/mode changes.
12. Reconcile the entire lineage before completion.

Detailed bounded workflows are in [`workflows/workflows.md`](workflows/workflows.md).

## Metrics

### Policy coverage
- guarded child spawns / total child spawns;
- attested children / created children;
- unknown-tier children;
- unapproved tier escalations;
- approved premium escalations;
- maximum lineage depth;
- descendant count.

### Token/cost observability
- tokens per task;
- parent vs child token share;
- cached-input share where available;
- premium-tier token share;
- tokens per descendant;
- configured estimated multiplier by observed tier;
- task completion/error rate after policy changes.

### Required success targets
For cost-controlled lineages:
- pre-spawn coverage: **100%**;
- child tier attestation: **100%**;
- unapproved higher-tier children: **0**;
- required unknown tiers at completion: **0**;
- policy depth/descendant violations: **0**.

## Token accounting behavior

`service_tier_audit.py` treats usage counters as per-thread cumulative snapshots when possible:

- repeated identical snapshots add zero fresh usage;
- increasing counters contribute only their positive delta;
- a counter reset starts a new epoch rather than creating negative usage.

Provider-specific fork formats that copy parent histories into child files should receive an explicit adapter/fixture that identifies the child's live-start boundary. The generic auditor is intentionally conservative and does not claim that every locally recorded token maps directly to subscription billing.

## Verification

Run:

```bash
python3 -m unittest tests/test_service_tier_audit.py
```

Then audit representative real/captured telemetry. Verification must include at least:

- valid parent/child inheritance;
- unapproved escalation;
- approved escalation;
- unknown-tier fail-closed behavior;
- repeated cumulative token snapshots;
- counter reset;
- depth-budget violation.

The complete contract is in [`verification/verification.md`](verification/verification.md).

Status definitions:

- **Implemented:** controls exist.
- **Measured:** representative runtime metrics were collected.
- **Verified:** positive/negative controls pass, a deliberate escalation is blocked correctly, token totals reconcile, and an independent verifier confirms no blocking discrepancy.

## Safety

- The guard is read-only when auditing telemetry.
- Production pre-spawn enforcement must fail closed when required tier state is unknown.
- A child cannot approve its own premium escalation.
- Approvals should be narrow, time-bounded, and tied to an actor/reason.
- Do not weaken sandbox, network, repository, secret, or human-approval controls to implement this package.
- Audit reports should contain metadata needed for lineage/cost analysis, not unrelated prompts, credentials, or source content.
- If authoritative billing differs from local estimates, provider ledger data is authoritative for charge reconciliation.

## Failure handling

### Child tier unavailable
Retry metadata resolution at most twice. If still unknown under fail-closed policy, quarantine the child and continue parent-only work when safe.

### Child tier higher than allowed
One re-read may rule out initialization lag. Persistent higher tier without valid approval stops/suspends the child; no respawn loop is allowed.

### Accounting mismatch
Mark cost attribution `NOT_VERIFIED`, preserve sanitized telemetry, fix the adapter once, and rerun. Do not manufacture a billing explanation from quota percentages.

### Guard unavailable
One transient I/O retry is allowed. If the gate cannot run, disable further child delegation rather than failing open.

### Provider ledger disagreement
Do not retry through model speculation. Reconcile with provider data and update local mappings only after validation.

Detailed Detection → Evidence → Retry → Fallback → Escalation → Stop conditions are in [`verification/verification.md`](verification/verification.md).

## Definition of Done

This package/integration is complete only when all applicable criteria are measurable and true:

- evidence and existing limitations are documented;
- parent tier baseline comes from a trusted source;
- every child receives an expected tier before substantive execution;
- child effective tier is attested on creation and resume/fork;
- unapproved tier escalation is blocked/quarantined;
- valid scoped approval works without granting blanket permission;
- required unknown state fails closed;
- depth and descendant budgets are enforced;
- token-delta regression tests pass;
- reports distinguish estimates from authoritative provider billing;
- independent verification passes;
- no blocking issue remains.

## Customization

### New provider tier names
Add aliases/ranks to `tier_rank` and optional reporting estimates to `tier_credit_multiplier`. Add a regression case for every new tier boundary.

### Stricter cost ceiling
Set all child ranks to remain at or below the root policy unless a named approval exists. You can also reduce `max_descendants` and `max_lineage_depth` for expensive models.

### Provider-specific telemetry
Build a typed adapter that emits stable `thread_id`, `parent_thread_id`, `service_tier`, and token usage fields. Keep the generic recursive parser for offline evidence, not as the only production enforcement path.

### Organization approvals
Replace example approval metadata with an authenticated policy service, change ticket, signed grant, or other auditable mechanism. Preserve actor, target tier, reason, scope, and expiry.

### Hard task budgets
Extend the pre-spawn and usage-checkpoint hooks with model-specific token/credit ceilings. Always establish a baseline first and verify that reduced usage does not remove required correctness or verification work.

## Research date

Public signals were reviewed for this package on **August 21, 2026 (Vietnam time, UTC+7)**.
