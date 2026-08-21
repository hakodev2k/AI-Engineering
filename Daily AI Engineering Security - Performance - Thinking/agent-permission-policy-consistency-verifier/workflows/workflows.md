# Workflows

## Workflow 1 — Establish permission baseline

### Trigger
Before enabling unattended execution, after onboarding a new coding-agent runtime, or after introducing subagents/MCP/hooks.

### Goal
Create a reproducible baseline of expected vs effective permission behavior.

### Inputs
Security policy, runtime documentation, active configuration, safe test environment.

### Baseline
No permission behavior is assumed correct until observed. Record product/runtime version, OS, execution surface, session mode, sandbox/network mode, hooks, and delegation topology.

### Context
Use `config/policy-matrix.example.json` as a shape, not as an authorization source. Environment owners define actual expectations.

### Stages
1. **Boundary inventory — Permission Policy Analyst**
   - Enumerate filesystem, network, shell, repository, credential, MCP/app and production boundaries.
   - Output: boundary inventory.
2. **Scenario design — Analyst + Security Reviewer**
   - Define allow/ask/deny scenarios, parent/subagent pairs, and critical IDs.
   - Checkpoint: expected outcomes approved before runtime testing.
3. **Safe observation — Permission Evidence Collector**
   - Exercise matrix in disposable/synthetic targets.
   - Output: observations JSONL.
4. **Deterministic comparison — Analyst**
   - Run verifier with `--require-all`.
   - Output: JSON report.
5. **Independent review — Independent Permission Verifier**
   - Confirm zero unexpected allows and complete critical coverage.

### Tools
Vendor docs, safe runtime, event/transcript logs, verifier script.

### Outputs
Frozen matrix, observation JSONL, conformance report, environment metadata.

### Checkpoints
- Matrix approved before testing.
- No destructive real-world test action.
- Any unexpected allow immediately stops further state-changing scenarios.

### Metrics
Decision agreement rate, security mismatch count, reliability mismatch count, unknown-reason count, required-scenario coverage.

### Retry policy
One repeat is allowed for suspected recording/tooling error. If the mismatch reproduces, enter Workflow 2. Do not repeatedly rerun until a failure disappears.

### Stop conditions
Pass when verifier exits 0 with complete required coverage. Stop immediately on a critical unexpected allow.

### Failure path
Preserve evidence, isolate the environment, disable unattended use of the affected capability, and enter remediation workflow.

### Verification
Independent verifier confirms the exact frozen matrix was used.

### Definition of Done
- baseline metadata captured;
- all critical scenarios observed;
- verifier report saved;
- zero blocking security mismatches;
- unresolved reliability mismatches explicitly block unattended use where relevant.

---

## Workflow 2 — Diagnose and remediate permission drift

### Trigger
Any matrix mismatch, unexplained gate, repeated prompt, inheritance mismatch, or unexpected execution.

### Goal
Locate the effective control layer and restore intended semantics without broadening unrelated permissions.

### Inputs
Failed report, matrix, observations, configuration snapshot, runtime version.

### Baseline
The failed observation is the baseline. Do not modify expected policy.

### Stages
1. **Classify failure — Permission Policy Analyst**
   - Unexpected allow / ask / deny / reason mismatch / missing observation.
2. **Layer isolation — Analyst**
   - Evaluate, in order: execution surface → session mode → sandbox/network → allow/ask/deny policy → hook → classifier/reviewer → tool annotation → delegation inheritance → command segmentation/prefix scope.
   - Build a fact/evidence table; do not infer from UI alone.
3. **Hypothesis — Analyst**
   - Select one minimal causal hypothesis.
4. **Safe experiment — Evidence Collector**
   - Reproduce using the smallest safe scenario.
5. **Minimal remediation — Integration Implementer**
   - Apply only the policy wiring/configuration change supported by evidence.
6. **Full regression — Independent Permission Verifier**
   - Re-run the frozen matrix, not just the failing scenario.

### Tools
Verifier, config diff, vendor docs, sanitized transcript/event records.

### Outputs
Root-cause record, minimal patch/config change, before/after reports.

### Checkpoints
- Human approval required for any change that broadens real permissions.
- Security reviewer required before converting expected `ask/deny` to `allow` for legitimate policy reasons.

### Metrics
Mismatch eliminated, no new unexpected allows, number of changed policy rules, regression coverage.

### Retry policy
Maximum two remediation cycles. Each cycle must test a different evidence-backed hypothesis.

### Stop conditions
Stop after two failed cycles and escalate with evidence. Stop immediately if remediation introduces a new unexpected allow.

### Failure path
Rollback remediation, restore last known-safe policy, disable affected unattended capability, file upstream issue/minimal reproduction when platform behavior appears inconsistent.

### Verification
Independent verifier confirms full matrix pass and checks critical boundaries manually from evidence.

### Definition of Done
Root cause is evidenced; change is minimal and reversible; full regression passes; no security boundary was weakened merely to remove prompts.

---

## Workflow 3 — Upgrade regression gate

### Trigger
Agent runtime upgrade, desktop/CLI/SDK change, model-agent harness update, new hook, new MCP server, permission config change, or subagent topology change.

### Goal
Prevent permission semantic drift from reaching unattended or sensitive workflows.

### Inputs
Last passing matrix, new environment metadata, safe test target.

### Baseline
Last verified report and decision matrix.

### Stages
1. Confirm matrix still represents current policy.
2. Collect fresh observations on new runtime.
3. Run verifier with `--require-all`.
4. Compare mismatch counts and reason classes with prior baseline.
5. Independently review any changed decision.

### Responsible agent
Evidence Collector runs tests; Independent Permission Verifier owns final gate.

### Tools
Verifier and version-controlled matrix.

### Outputs
New versioned report and pass/fail decision.

### Checkpoints
Any unexpected allow blocks rollout.

### Metrics
Agreement rate vs last baseline; count of decision/reason changes.

### Retry policy
One clean-session retry for possible stale session state. Persistent mismatch moves to Workflow 2.

### Stop conditions
Pass on zero blocking mismatches and full required coverage.

### Failure path
Keep previous runtime/policy version where feasible and document blocked upgrade.

### Verification
Exact matrix checksum/version and runtime version are recorded with the report.

### Definition of Done
Upgrade is either verified safe or explicitly blocked with reproducible evidence.
