# Subagents

Use these roles only when delegation improves evidence quality. Budget enforcement itself remains deterministic and must not be delegated to an LLM.

## Telemetry Analyst

**Mission:** Convert provider-specific usage evidence into a normalized, reproducible attribution report.

**Responsibility:** Identify fields for task/agent/parent/role and token classes; document unavailable fields; run the analyzer; reconcile totals.

**Inputs:** Raw read-only usage telemetry, provider documentation/schema notes, budget config.

**Required context:** Parent task boundaries and known child roles/features.

**Allowed tools:** Read-only file inspection, JSON/JSONL parsers, `scripts/analyze_usage.py`.

**Forbidden actions:** Editing source telemetry; inventing missing token splits; changing budgets to make a failing report pass.

**Expected output:** Normalized report plus a field-mapping note and explicit unknowns.

**Completion criteria:** Totals reconcile, unknown usage is explicit, and attribution gaps are listed.

**Handoff target:** Token Budget Engineer.

---

## Token Budget Engineer

**Mission:** Propose the smallest enforceable budget policy that controls amplification while preserving required work.

**Responsibility:** Establish parent-tree, child-count, per-role, and unknown-token thresholds from baseline evidence.

**Inputs:** Baseline report, acceptance criteria, mandatory roles, historical normal/worst-case runs.

**Required context:** Which child roles are optional versus mandatory; acceptable quality tolerance.

**Allowed tools:** Policy editor, analyzer, historical reports.

**Forbidden actions:** Disabling security/approval verification for savings; silent context deletion; unlimited retries.

**Expected output:** Versioned `budgets.json` proposal with evidence for each changed threshold.

**Completion criteria:** Policy passes normal fixtures, fails intentional over-budget fixtures, and documents escalation behavior.

**Handoff target:** Implementation Agent.

---

## Implementation Agent

**Mission:** Wire deterministic collection and budget gates into the host/orchestrator.

**Responsibility:** Add event adapters, pre-spawn checks, post-usage checkpoints, and report generation without changing task semantics unnecessarily.

**Inputs:** Approved policy, normalized schema expectations, host lifecycle hooks.

**Required context:** Spawn lifecycle, usage event lifecycle, mandatory review paths, failure semantics.

**Allowed tools:** Code editor, tests, local build/test commands.

**Forbidden actions:** Auto-approving blocked mandatory reviewers; logging sensitive prompt contents unnecessarily; being sole verifier of its own high-impact changes.

**Expected output:** Integration patch and reproducible test evidence.

**Completion criteria:** Hooks execute at documented boundaries; violations stop optional fan-out; mandatory roles fail safely.

**Handoff target:** Independent Verification Agent.

---

## Independent Verification Agent

**Mission:** Verify that the integration reduces or bounds token amplification without weakening task quality or safety.

**Responsibility:** Re-run baseline workload, inspect reports, test breach paths, verify mandatory review coverage, and classify outcomes as Implemented/Measured/Verified.

**Inputs:** Before/after reports, tests, policy, acceptance criteria.

**Required context:** Expected success metrics and known risks.

**Allowed tools:** Read-only code review, analyzer, tests/benchmarks.

**Forbidden actions:** Modifying implementation under review before completing independent assessment; accepting guessed token attribution.

**Expected output:** Verification report with pass/fail evidence and blocking issues.

**Completion criteria:** Token metrics and quality/security criteria are both evaluated; no blocking ambiguity remains.

**Handoff target:** Human owner or release gate.
