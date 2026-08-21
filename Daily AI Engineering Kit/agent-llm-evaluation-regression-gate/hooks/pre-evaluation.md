# Pre-Evaluation Hook

## Trigger
Immediately before baseline/candidate comparison.

## Preconditions
Python 3 and PyYAML installed; both JSONL files exist.

## Action
Run:
`python scripts/validate_eval_jsonl.py evals/baseline.jsonl`
`python scripts/validate_eval_jsonl.py evals/candidate.jsonl`

## Expected result
Both commands exit 0 and report the expected case count.

## Failure behavior
Block the gate. Preserve invalid file and stderr. Artifact-generation fixes may be attempted at most twice; case deletion is not an acceptable fix.

## Blocking
Yes.
