# Hooks

## Hook 1 — Pre-run permission baseline check

### Trigger
Before an unattended or high-impact agent run.

### Action
Verify that the current runtime version, permission config hash/version, hook set, MCP/tool inventory, and policy matrix version match the last verified baseline.

### Command/script
Use your host's config/version collection plus:

`python scripts/permission_consistency_verifier.py --matrix config/policy-matrix.json --observations artifacts/permission-observations.jsonl --require-all --report artifacts/permission-report.json`

### Expected result
Exit code `0` and report status `PASS` from evidence collected on the current effective environment.

### Failure behavior
Do not start unattended execution. Route to upgrade/baseline workflow. Never change permissions automatically to force a pass.

---

## Hook 2 — Post-permission-decision recorder

### Trigger
Whenever the host emits an allow/ask/deny decision for a conformance scenario.

### Action
Append a sanitized record containing `scenario_id`, `observed_decision`, `observed_reason_class`, source, and timestamp. Do not include command output, secret values, credentials, or unnecessary prompt text.

### Command/script
Host-specific adapter writes JSONL compatible with `scripts/permission_consistency_verifier.py`.

### Expected result
One valid observation object per exercised scenario with a stable scenario ID.

### Failure behavior
Mark the scenario unobserved. For critical scenarios, fail verification rather than inferring the outcome from UI text or agent narration.

---

## Hook 3 — Unexpected-allow circuit breaker

### Trigger
A runtime decision is observed as `allow` while the matrix expects `ask` or `deny`.

### Action
Stop further state-changing conformance tests, preserve sanitized evidence, and disable the affected unattended capability until reviewed.

### Command/script
Run the verifier immediately against observations collected so far. A mismatch produces exit code `2`.

### Expected result
A blocking security mismatch recorded with scenario ID and expected/observed decisions.

### Failure behavior
Fail closed. Do not automatically downgrade the expected policy or retry the dangerous action.

---

## Hook 4 — Delegation inheritance checkpoint

### Trigger
Before enabling subagents for unattended work or after a runtime upgrade.

### Action
Run paired parent/subagent low-risk and high-risk scenarios to prove intended permission inheritance.

### Command/script
Record both variants under distinct scenario IDs, then invoke the verifier with `--require-all`.

### Expected result
Both actors produce policy-conformant decisions and reasons.

### Failure behavior
Disable unattended subagent delegation for the affected capability and continue only with explicit supervision or a safer constrained policy.

---

## Hook 5 — Final permission verification

### Trigger
Before declaring a permission-policy remediation complete.

### Action
Re-run the full frozen matrix on a clean session and generate a fresh report.

### Command/script
`python scripts/permission_consistency_verifier.py --matrix config/policy-matrix.json --observations artifacts/final-observations.jsonl --require-all --report artifacts/final-report.json`

### Expected result
Exit `0`, no missing scenarios, zero mismatches.

### Failure behavior
Do not mark remediation verified. Maximum two remediation/retest cycles before escalation.
