# Core Skills

## Skill 1 — Establish Oracle Baseline

**Purpose:** Capture which files and checks define correctness before an agent starts changing code.

**Trigger:** Any coding task where automated tests, snapshots, fixtures, CI checks, or golden outputs influence completion.

**Inputs:** repository tree, task requirements, test commands, policy config.

**Preconditions:** clean or explicitly recorded working tree; target branch/ref known.

**Required context:** acceptance criteria, protected test paths, CI entry points, test framework config.

**Tools:** git, repository search, `scripts/oracle_guard.py`.

**Procedure:**
1. Translate the user request into externally observable acceptance criteria.
2. Identify visible tests and all files that alter test semantics: fixtures, snapshots, golden data, test discovery, CI filters, coverage/quality thresholds.
3. Record the baseline commit/ref and protected path set.
4. Run the baseline suite once; record pass/fail counts and known failures.
5. Classify work as low or high risk. High risk includes broad test edits, migrations, auth/security behavior, release-critical changes, or more protected-file changes than policy allows.
6. Decide whether protected or held-out tests are available outside the implementation agent's write scope.

**Decisions:** If baseline tests already fail, preserve them as known failures; do not authorize skips automatically. If no meaningful oracle exists, create an acceptance test outside the implementation agent's writable scope or require human verification.

**Constraints:** Never claim a clean baseline without executing the configured baseline checks. Never give the implementation agent write access to held-out verification artifacts.

**Expected output:** baseline record with commit, protected paths, test commands, known failures, acceptance criteria, risk level.

**Metrics:** baseline coverage ratio; number of protected paths; known-failure count.

**Verification:** independent agent or host confirms the recorded test commands and protected path classification.

**Failure handling:** If baseline cannot run, mark verification blocked and preserve the error; do not weaken policy.

**Stop conditions:** baseline captured or task explicitly blocked.

---

## Skill 2 — Detect Oracle Weakening

**Purpose:** Detect edits that can make tests easier to pass without improving product behavior.

**Trigger:** After every implementation diff and before final completion.

**Inputs:** unified diff, oracle policy, approved protected-path changes.

**Preconditions:** baseline exists.

**Required context:** legitimate reasons, if any, for test changes.

**Tools:** `git diff`, `scripts/oracle_guard.py`, optional language-aware linters.

**Procedure:**
1. Generate the complete diff against the baseline, not only staged files.
2. Run `oracle_guard.py`.
3. Review every protected-file change and every finding.
4. Classify each finding as: legitimate test evolution, suspicious weakening, or false positive.
5. For legitimate changes, require explicit approval and a separate behavioral proof demonstrating why the old oracle was wrong or incomplete.
6. For suspicious weakening, revert the oracle change and fix implementation behavior instead.
7. Re-run guard and tests.

**Decisions:** A green suite is insufficient when the oracle changed. Assertion reductions, skip additions, test deletions, expected-value rewrites, and test-discovery changes require separate justification.

**Constraints:** The implementation agent must not self-approve high-risk oracle changes.

**Expected output:** audit report with findings, dispositions, approvals, and unresolved blockers.

**Metrics:** unapproved protected changes; weakening findings; false-positive rate; approved oracle-change count.

**Verification:** final diff audit returns zero unresolved findings.

**Failure handling:** Maximum two remediation attempts; then escalate as blocked.

**Stop conditions:** zero unresolved findings or retry budget exhausted.

---

## Skill 3 — Independent Behavioral Verification

**Purpose:** Verify the requested behavior without trusting only the mutable visible suite.

**Trigger:** High-risk change, any legitimate oracle edit, or visible-test/acceptance mismatch.

**Inputs:** acceptance criteria, implementation diff, baseline tests, protected/held-out checks.

**Preconditions:** implementation complete enough to test.

**Required context:** what the user actually asked for, not implementation-agent claims.

**Tools:** CI, clean checkout/worktree, protected tests, integration/E2E tests, static diff audit.

**Procedure:**
1. Use a verifier identity distinct from the implementation agent for high-risk work.
2. Run visible regression tests from a clean state.
3. Run protected/held-out/integration checks unavailable for modification by the implementation agent when possible.
4. Compare outputs to acceptance criteria.
5. Inspect oracle diff independently.
6. Record Facts, Evidence, Result, Risks, Verification status.
7. If visible tests pass but behavioral checks fail, treat it as oracle insufficiency/reward-hacking risk, not success.

**Decisions:** Completion requires both oracle integrity and behavioral evidence.

**Constraints:** Do not expose hidden chain-of-thought; record only observable facts, decisions, and evidence.

**Expected output:** independent verifier record with pass/fail per acceptance criterion.

**Metrics:** visible-pass/held-out-fail rate; independent verification coverage; escaped oracle-regression count.

**Verification:** verifier evidence is current against the final diff.

**Failure handling:** Return to implementation with named failing criteria; maximum two fix/retest cycles.

**Stop conditions:** verified, blocked, or bounded retries exhausted.
