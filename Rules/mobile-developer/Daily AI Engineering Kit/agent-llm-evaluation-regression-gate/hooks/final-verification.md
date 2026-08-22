# Final Verification Hook

## Trigger
After candidate generation and relevant repository tests.

## Preconditions
Validated baseline/candidate JSONL and unchanged or approved gate configuration.

## Action
Run:
`python scripts/eval_gate.py --baseline evals/baseline.jsonl --candidate evals/candidate.jsonl --config config/eval-gate.yaml --out eval-gate-report.json`
Then inspect repository diff and relevant test output.

## Expected result
Exit 0, report status `pass`, zero blocking critical regressions, tests pass, and no unexplained edits to baseline/config/evaluator.

## Failure behavior
Block completion. Semantic failures return to triage; transient command/environment failures may retry twice. Threshold/baseline/evaluator modifications without approval stop immediately.

## Blocking
Yes.
