# Core Skills

## Skill 1 — Build a permission conformance matrix

### Purpose
Convert ambiguous permission expectations into explicit, executable scenarios.

### Trigger
Run when onboarding an agent runtime, changing permission mode, adding hooks/MCP servers, enabling subagents, or preparing unattended execution.

### Inputs
- documented permission modes and precedence;
- project/team security policy;
- sandbox and network boundaries;
- available tools and side-effect annotations;
- delegation topology;
- representative low/high/critical-risk actions.

### Preconditions
- Do not use production credentials or destructive production resources for tests.
- Use a disposable repository/sandbox for state-changing scenarios.
- Know which actions are supposed to allow, ask, or deny.

### Required context
Capture runtime/product version, OS/surface, configured permission mode, sandbox mode, active hooks, MCP/app tools, policy files, and whether the actor is parent or subagent.

### Tools
Documentation, config inspection, sanitized transcript/event logs, `config/policy-matrix.example.json`, and `scripts/permission_consistency_verifier.py`.

### Procedure
1. Enumerate trust boundaries: filesystem, network, shell, MCP/app tools, credentials, repository writes, deployment/production.
2. Create at least one `allow`, one `ask`, and one `deny` scenario for each relevant high-risk boundary.
3. Add paired parent/subagent scenarios for every delegated capability.
4. Add paired CLI/desktop/SDK scenarios when multiple surfaces are used.
5. Assign stable scenario IDs and reason classes.
6. Mark critical scenarios whose absence must fail verification.
7. Review the matrix independently before execution.
8. Freeze the matrix for the test run; changes require review and a new baseline.

### Decisions
- If expected behavior is not documented or owned by policy, mark the scenario `ask` until clarified rather than assuming `allow`.
- If a test cannot be performed safely, create a synthetic/mock boundary rather than weakening controls.

### Constraints
Never change expected outcomes merely to match observed runtime behavior. Expected policy is the oracle; observations are evidence.

### Expected output
A complete policy matrix with scenario IDs, actors, surfaces, risk, expected decisions, and reason classes.

### Metrics
Scenario coverage by boundary and risk, percentage of critical scenarios represented, parent/subagent coverage.

### Verification
A security reviewer confirms that critical actions cannot silently become `allow` through matrix omission.

### Failure handling
If expected policy is ambiguous, stop the affected scenario and escalate for policy ownership. Do not infer authorization from prior prompts or UI labels.

### Stop conditions
Stop when every relevant boundary has explicit representative scenarios and all critical scenarios have approved expectations.

---

## Skill 2 — Collect effective runtime decisions

### Purpose
Observe what the runtime actually does rather than trusting configuration strings.

### Trigger
After matrix approval and whenever an agent/runtime version or permission layer changes.

### Inputs
Approved scenario matrix and a safe test environment.

### Preconditions
- Test environment is isolated from production.
- Dangerous scenarios use no-op/simulated targets where possible.
- Audit/transcript collection is enabled without collecting secrets.

### Required context
For each observation record: scenario ID, effective actor, surface, observed decision, reason class, source, timestamp, and runtime version outside the observation file if needed.

### Tools
Runtime UI/CLI/SDK, hooks, sanitized event logs, transcript parser or manual recording.

### Procedure
1. Start from a fresh session to avoid stale approvals.
2. Record configured modes and active policy layers.
3. Run low-risk parent scenarios first.
4. Run corresponding subagent scenarios.
5. Exercise ask/deny boundaries using safe targets.
6. Record the *actual* allow/ask/deny result and effective reason, not what the model claimed would happen.
7. Repeat intermittent-risk scenarios at least three times or across long-session checkpoints when feasible.
8. Save observations as JSONL.

### Decisions
If the product does not expose a reason, classify it as `unknown-gate` rather than guessing. Unknown reason on a critical scenario is a verification failure.

### Constraints
Never approve a dangerous prompt merely to complete the matrix. Use safe synthetic equivalents.

### Expected output
Sanitized observation JSONL suitable for deterministic comparison.

### Metrics
Observation coverage, unknown-reason rate, repeatability rate, parent/subagent agreement.

### Verification
Cross-check a sample against raw UI/transcript evidence with secrets removed.

### Failure handling
For intermittent behavior, preserve multiple observations and treat any unexpected allow as blocking until root cause is understood.

### Stop conditions
Stop when all required scenarios have evidence or a documented safe-test blocker.

---

## Skill 3 — Reconcile expected vs effective permission state

### Purpose
Detect security and reliability regressions deterministically.

### Trigger
After observations are collected, before unattended execution, and in upgrade regression tests.

### Inputs
Policy matrix and observation JSONL.

### Tools
`python scripts/permission_consistency_verifier.py`.

### Procedure
1. Run the verifier with `--require-all` for release gates.
2. Separate security mismatches from reliability mismatches.
3. For unexpected allows, stop deployment/use immediately and identify which layer overrode policy.
4. For unexpected asks/denies, identify whether the cause is sandbox, classifier, hook, tool annotation, surface-specific behavior, or inheritance drift.
5. Correct configuration/integration or update runtime only when evidence supports the change.
6. Re-run the exact matrix.
7. Require independent verification for any critical mismatch resolution.

### Decisions
- Expected `deny|ask` → observed `allow`: blocking security failure.
- Expected `allow` → observed `ask|deny`: reliability failure; blocking for unattended workflows if scenario is required.
- Expected decision matches but reason differs: diagnostic failure because hidden gate drift can later change behavior.

### Constraints
Maximum two configuration-fix/retest cycles per incident before escalation. Do not disable security controls just to make the matrix pass.

### Expected output
Machine-readable comparison report plus a disposition for every mismatch.

### Metrics
Decision agreement rate, security mismatch count, reliability mismatch count, unexplained reason count, rerun stability.

### Verification
Pass requires zero blocking mismatches and complete required-scenario coverage.

### Failure handling
Preserve the failed report, configuration snapshot, runtime version, and minimal reproduction. Escalate rather than broadening permissions.

### Stop conditions
Stop when the matrix passes or when two bounded remediation cycles fail.
