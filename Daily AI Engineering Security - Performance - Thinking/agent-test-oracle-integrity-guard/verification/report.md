# Verification Report

## Scope

This report distinguishes what the package implements from what must still be measured in a target coding-agent harness.

## Implemented

- deterministic unified-diff parser;
- configurable protected-oracle globs;
- explicit approval requirement for protected paths;
- known weakening-pattern detection;
- protected-file deletion detection;
- conservative assertion-count decrease detection;
- conservative test-declaration decrease detection;
- machine-readable JSON report and meaningful exit codes;
- bounded remediation rules/workflows;
- independent verifier requirement for high-risk work;
- documented integration and human-approval boundaries;
- regression test suite covering core guard behaviors.

## Package-level verification criteria

The supplied `tests/test_oracle_guard.py` covers:

1. production-code-only diff passes;
2. unapproved test change is detected;
3. explicit protected-path approval removes only the approval finding;
4. adding a skip marker remains detected even on an approved path;
5. assertion-count decrease is detected;
6. protected-file deletion is detected;
7. CI `continue-on-error` addition is detected;
8. test-declaration decrease is detected.

Run:

```bash
python -m unittest tests/test_oracle_guard.py
```

Then run the script against a real unified diff:

```bash
python scripts/oracle_guard.py \
  --diff agent-final.diff \
  --policy config/oracle-policy.json \
  --report oracle-report.json
```

## Measured

The package itself defines measurable counters but does not fabricate production measurements. In the target harness, capture at minimum:

- protected-file changes per agent task;
- unapproved protected-file changes blocked;
- skip/disable findings;
- assertion/test-declaration decrease findings;
- visible-suite pass rate;
- protected/held-out pass rate;
- visible-pass/held-out-fail rate;
- legitimate oracle-change approvals;
- false-positive review rate;
- remediation attempts per task;
- escaped test-oracle regressions after merge.

A before/after comparison is required before claiming that the package reduces reward hacking or regression rates in a specific environment.

## Verified security/thinking properties

When integrated as documented and enforced externally to the implementation agent:

- a protected oracle path cannot change silently without producing an audit finding;
- approval of a path does not automatically suppress skip/assertion/test-count weakening signals;
- the guard never rewrites tests or source code;
- a green visible suite alone is not the Definition of Done for high-risk work;
- held-out/protected verification can remain outside implementation-agent write scope;
- later edits require a fresh final audit and test run;
- failures do not trigger weaker criteria or unlimited retries.

These are control properties of the package. They are not claims that all possible reward-hacking strategies are detected.

## Known limitations

- Diff heuristics are not language-complete and can produce false positives/negatives.
- Assertion semantics cannot be fully inferred from line counts.
- An agent may weaken behavior through production code or helpers outside configured protected paths; path policy must reflect the repository.
- If the same agent can modify the guard, policy, verifier, or held-out tests, the trust boundary collapses. Enforce filesystem/CI permissions externally.
- A flawed test suite can remain incomplete without being modified; independent behavioral/held-out verification is still required.
- Generated snapshots can be legitimately large; approval should evaluate behavior, not just diff size.

## Production rollout gate

Do not move from report-only to blocking mode until:

1. protected globs cover the repository's actual oracle surfaces;
2. baseline commands are reproducible;
3. reviewers understand approval semantics;
4. verifier-only artifacts have an external permission boundary where required;
5. the false-positive rate is measured on representative tasks;
6. high-risk task classification is defined;
7. CI preserves reports and negative evidence.

## Definition of Done for an integrated task

- baseline recorded;
- final complete diff audited;
- no unresolved protected-oracle finding;
- legitimate oracle changes explicitly approved and independently justified;
- required regression tests pass on final state;
- high-risk work has independent behavioral verification;
- visible-pass/held-out-fail mismatch is zero for required checks;
- evidence is fresh after the last edit;
- retry budget is not exceeded;
- no unresolved human approval remains.
