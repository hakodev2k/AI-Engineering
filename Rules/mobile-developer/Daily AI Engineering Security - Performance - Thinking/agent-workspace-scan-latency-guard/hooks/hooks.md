# Hooks

## Hook — Pre-Task Workspace Scan Gate
**Trigger:** before an autonomous coding task starts or after switching workspace/runtime version.

**Action:** run bounded measurement, then enforce policy.

**Command:**
```bash
python scripts/measure_workspace_scan.py . --timeout 10 --max-entries 50000 --output .agent-metrics/workspace-scan.json
python scripts/git_scan_guard.py .agent-metrics/workspace-scan.json --policy config/scan-budget.json
```

**Expected result:** exit 0 and JSON status `pass`.

**Failure behavior:** do not start a long autonomous loop. Invoke the Diagnose Workspace Scan Overhead workflow. Never bypass by disabling sandbox/security.

---

## Hook — Baseline Capture
**Trigger:** first performance investigation or before a runtime/agent upgrade.

**Action:** collect 3–5 comparable measurement samples and retain runtime/OS/version metadata.

**Command:**
```bash
mkdir -p .agent-metrics
python scripts/measure_workspace_scan.py . --output .agent-metrics/baseline-1.json
```
Repeat with stable conditions; choose/aggregate a baseline according to team policy.

**Expected result:** bounded measurement completes within probe timeout.

**Failure behavior:** store timeout result and switch to top-level diagnosis rather than increasing recursion without bound.

---

## Hook — Post-Mitigation Regression Check
**Trigger:** after changing ignore/exclude, Git cache configuration, workspace placement, or runtime scan behavior.

**Action:** generate current metrics and compare with stored baseline.

**Command:**
```bash
python scripts/measure_workspace_scan.py . --output .agent-metrics/after.json
python scripts/git_scan_guard.py .agent-metrics/after.json \
  --policy config/scan-budget.json \
  --baseline .agent-metrics/baseline.json
```

**Expected result:** exit 0, no absolute budget breach, no configured regression.

**Failure behavior:** rollback the latest scoped mitigation when appropriate, preserve evidence, and test the next ranked hypothesis within retry limits.

---

## Hook — Runtime Upgrade Check
**Trigger:** Codex/Claude Code/agent runtime, sandbox, Git, WSL, or filesystem-layer upgrade.

**Action:** compare scan metrics against the last verified baseline before allowing unattended long tasks.

**Expected result:** no >50% regression by default and no hard-budget breach.

**Failure behavior:** mark runtime upgrade as performance-regressed for this workspace and require manual review or product issue escalation with trace evidence.

---

## Hook — Security Preservation Check
**Trigger:** before accepting a performance mitigation.

**Action:** verify that sandbox mode, approval policy, antivirus/security posture, and required repository visibility were not weakened merely to achieve speed.

**Expected result:** all security controls preserved or intentionally changed under explicit human approval for independent reasons.

**Failure behavior:** reject the performance result as invalid and restore the previous safe configuration.

---

## Hook — Final Verification
**Trigger:** investigation completion.

**Action:** ensure evidence, baseline, mitigation, rollback, post-change metrics, guard result, and remaining risks are recorded.

**Expected result:** status can be labeled separately as Implemented, Measured, and Verified.

**Failure behavior:** do not claim verified performance improvement if only implementation or a single measurement exists.