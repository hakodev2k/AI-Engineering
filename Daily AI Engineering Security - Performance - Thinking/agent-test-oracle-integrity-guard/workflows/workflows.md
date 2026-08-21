# Workflows

## Workflow A — Protected Oracle Change Workflow

**Trigger:** Any coding task evaluated by automated tests.

**Goal:** Prevent the implementation agent from improving its score by weakening the test oracle.

**Inputs:** task requirements, baseline ref, policy, repository, test commands.

**Baseline:** record current protected paths, test results, known failures, and acceptance criteria before edits.

**Context:** production code and visible tests; verifier-only checks remain outside implementation write scope when possible.

### Stages
1. **Observe** — Oracle Baseline Agent inventories oracle surfaces and runs baseline checks.
2. **Plan** — Implementation Agent identifies production changes and flags any anticipated oracle edits before making them.
3. **Implement** — change production code; run focused tests.
4. **Audit** — produce `git diff <baseline>...HEAD` or equivalent workspace diff and run `oracle_guard.py`.
5. **Decision checkpoint** — if protected changes exist, require explicit disposition and approval; if weakening is unexplained, reject and return to implementation.
6. **Regression verify** — run impacted plus broad regression tests appropriate to risk.
7. **Independent verify** — high-risk changes use separate verifier and protected/held-out behavioral checks.
8. **Final audit** — regenerate diff after all fixes; earlier clean audits become stale after later edits.
9. **Complete** — only if integrity findings are resolved and behavioral acceptance is verified.

**Responsible agents:** Baseline Agent → Implementation Agent → Oracle Integrity Reviewer → Independent Verification Agent → Orchestrator.

**Tools:** git, test runner, CI, `scripts/oracle_guard.py`.

**Outputs:** baseline record, audit report, approval records, test evidence, verifier verdict.

**Checkpoints:** pre-edit baseline; pre-approval oracle diff; post-fix final diff; final independent verifier result.

**Metrics:** protected files changed, unresolved findings, test count delta, skipped-test delta, visible/held-out pass rates, remediation count.

**Retry policy:** at most 2 remediation cycles. Every retry must name the integrity or behavioral finding it addresses.

**Stop conditions:** all mandatory gates pass; retry limit reached; required approval denied/unavailable; baseline/held-out verification cannot be executed safely.

**Failure path:** preserve failing audit/test output and return `blocked`/`incomplete`; never alter policy or skip checks to force green.

**Verification:** final audit is against final state and independent tests are current.

**Definition of Done:** zero unresolved integrity findings, required approvals present, required tests pass, acceptance criteria independently verified, no stale evidence.

---

## Workflow B — Legitimate Test Evolution

**Trigger:** The user request genuinely changes behavior and existing tests/snapshots/fixtures must change.

**Goal:** Allow necessary test evolution without conflating it with implementation self-scoring.

**Inputs:** old requirement/oracle, new requirement, proposed protected-file diff.

**Baseline:** preserve old oracle and baseline behavior.

**Stages:**
1. State the requirement change that makes the old oracle invalid.
2. Produce the test/oracle diff separately from the production implementation diff when tooling permits.
3. Review whether the new test would fail against the old implementation for the intended reason.
4. Require explicit approval for protected-path changes.
5. Apply implementation change.
6. Verify new test passes only after behavior changes.
7. Run unaffected regression tests and independent behavioral checks.
8. Re-audit final diff.

**Responsible agent:** Oracle Integrity Reviewer owns approval recommendation; implementation agent cannot be sole approver.

**Tools:** diff, clean checkout/worktree, test runner.

**Outputs:** rationale, approval, old-vs-new behavior evidence, final verification.

**Checkpoints:** test-diff review before acceptance; red-before-green evidence when feasible; post-implementation independent verification.

**Metrics:** approved oracle changes, tests proving new behavior, unrelated regressions.

**Retry policy:** maximum 2 correction cycles.

**Stop conditions:** new requirement is demonstrably represented and verified, or approval/verification fails.

**Failure path:** keep old oracle authoritative until approved change is complete.

**Verification:** verifier confirms changed test reflects requirement rather than current implementation accident.

**Definition of Done:** approved oracle change, behavioral necessity demonstrated, no hidden weakening, regression checks current.

---

## Workflow C — Visible Green / Behavioral Red Investigation

**Trigger:** visible tests pass but integration, held-out, manual acceptance, or production-like check fails.

**Goal:** diagnose proxy mismatch instead of adding more visible-test patches.

**Inputs:** visible suite result, failing independent evidence, task requirements, final diff.

**Baseline:** current visible pass rate and independent failure.

**Stages:**
1. Freeze oracle modifications temporarily.
2. Record the exact acceptance mismatch as a fact.
3. Identify which requirement is missing or under-specified in visible tests.
4. Form at most 2 root-cause hypotheses grounded in code/data flow.
5. Test hypotheses without changing the failing verifier.
6. Fix production behavior.
7. If a new visible regression test is useful, add it through Workflow B.
8. Re-run independent verification.

**Responsible agents:** Independent Verification Agent → Implementation Agent → Oracle Integrity Reviewer.

**Metrics:** visible-pass/held-out-fail rate, number of speculative patches, retries.

**Retry policy:** two bounded hypothesis/fix cycles.

**Stop conditions:** independent check passes or evidence remains insufficient after retry budget.

**Failure path:** report blocked with mismatch evidence; do not redefine success as visible-suite pass.

**Definition of Done:** acceptance behavior and oracle integrity both verified.
