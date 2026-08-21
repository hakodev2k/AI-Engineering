# Hooks

## Pre-task Oracle Baseline

**Trigger:** before the implementation agent receives write permission.

**Action:** record baseline ref, protected oracle paths, visible test command, known failures, and acceptance criteria.

**Command:** project-specific baseline test command plus repository path inventory.

**Expected result:** immutable baseline record available to later audit.

**Failure behavior:** mark verification blocked; do not proceed as if baseline were clean.

---

## Post-edit Oracle Diff Audit

**Trigger:** after a source edit batch or before handoff.

**Action:** create a unified diff against baseline and scan for protected changes and weakening patterns.

**Command:**

```bash
git diff --no-ext-diff <baseline> -- > agent-final.diff
python scripts/oracle_guard.py --diff agent-final.diff --policy config/oracle-policy.json --report oracle-report.json
```

**Expected result:** exit 0 and zero findings, or explicit review-required findings.

**Failure behavior:** block completion; route findings to Oracle Integrity Reviewer.

---

## Protected-change Approval Hook

**Trigger:** `oracle_guard.py` reports an intended protected-file change.

**Action:** require an external approval record identifying exact path(s), behavioral reason, and verifier.

**Command/script:** host-specific approval mechanism; then pass approved paths individually as `--approved-path` to the guard.

**Expected result:** only reviewed protected paths are exempted from `UNAPPROVED_ORACLE_CHANGE`; all other weakening findings remain active.

**Failure behavior:** no approval means no completion.

---

## Pre-final Independent Verification

**Trigger:** high-risk task, any approved oracle-semantic change, or visible-green/behavioral-red history.

**Action:** execute protected/held-out/integration checks from a clean verifier context.

**Command/script:** repository-specific verifier command or CI job whose artifacts are not writable by implementation agent.

**Expected result:** all mandatory acceptance checks pass against the final diff.

**Failure behavior:** return named failures for bounded remediation; do not alter held-out tests.

---

## Final Freshness Hook

**Trigger:** immediately before reporting task completion.

**Action:** regenerate the final diff and rerun oracle guard and required tests after the last edit.

**Command:** same guard command against final HEAD/workspace plus configured verifier suite.

**Expected result:** final audit/test evidence references the final state.

**Failure behavior:** stale earlier evidence is discarded; task remains incomplete until new checks pass or retry budget is exhausted.
