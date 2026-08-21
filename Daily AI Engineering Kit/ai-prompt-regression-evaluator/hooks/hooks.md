# Hooks

## PreEval
**Trigger:** before any baseline/candidate execution.

**Preconditions:** suite and policy exist.

**Action:** validate suite and policy inputs.

**Command:**
```bash
python scripts/validate-suite.py --suite evals/suite.json --policy config/eval-policy.json
```

**Expected result:** exit 0.

**Failure:** block execution.

---

## PostRun
**Trigger:** after a runner finishes producing normalized JSONL results.

**Action:** aggregate each side independently.

**Commands:**
```bash
python scripts/aggregate-results.py --suite evals/suite.json --runs results/baseline.jsonl --side baseline --output results/baseline-aggregate.json
python scripts/aggregate-results.py --suite evals/suite.json --runs results/candidate.jsonl --side candidate --output results/candidate-aggregate.json
```

**Expected result:** aggregates contain every required case and configured repeat count.

**Failure:** block comparison; never drop missing/failed runs silently.

---

## PreDecision
**Trigger:** before semantic review or promotion decision.

**Action:** evaluate deterministic regression thresholds.

**Command:**
```bash
python scripts/evaluate-regression.py --suite evals/suite.json --policy config/eval-policy.json --baseline results/baseline-aggregate.json --candidate results/candidate-aggregate.json --output results/regression-report.json
```

**Expected result:** report status is one of `verified`, `regressed`, `inconclusive`, `blocked`.

**Failure:** block promotion.

---

## PreComplete
**Trigger:** before declaring the evaluation complete.

**Action:** confirm the regression report exists, all critical cases are represented, and required reviewer approval is recorded externally when policy requires it.

**Failure behavior:** block completion. Evaluation execution is not verification.
