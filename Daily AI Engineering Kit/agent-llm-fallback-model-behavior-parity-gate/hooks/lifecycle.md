# Lifecycle Hooks

## Pre-evaluation validation
Trigger: before either model run. Preconditions: repository root and frozen scenario suite exist. Action: validate fixture identity and record prompt/tool/schema/evaluator versions. Expected: immutable run metadata. Failure: block; do not compare unmatched runs.

## Post-run result validation
Trigger: after each model run. Command: `python scripts/validate_results.py <result.json> --required structured-output tool-selection refusal-boundary context-grounding`. Expected: exit 0. Failure: block; preserve invalid result and stderr.

## Parity comparison
Trigger: after both validated runs. Command: `python scripts/compare_results.py primary.json fallback.json --max-score-drop 0.05 --max-cost-multiplier 1.50 --max-latency-multiplier 1.75`. Expected: exit 0 and `fallback-parity-report.json`. Exit 2 blocks completion.

## Post-edit rerun
Trigger: after any compatibility edit. Action: rerun both models against the complete frozen suite, not only failed scenarios. Maximum: two corrective iterations. Failure after limit: stop and escalate.

## Final verification
Trigger: before completion. Action: independent verifier reproduces validation/comparison and inspects diff. Expected: `verified-pass`. Any other status blocks completion.
