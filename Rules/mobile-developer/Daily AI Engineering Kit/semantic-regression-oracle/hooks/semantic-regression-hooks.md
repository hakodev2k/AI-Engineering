# Semantic Regression Hooks

## Pre-task: validate suite
- Trigger: before baseline/candidate execution
- Command: `python scripts/validate-scenario-suite.py <suite.json>`
- Expected: exit 0
- Failure: blocking

## Pre-compare: validate result identity
- Trigger: after baseline and candidate runs
- Action: comparator validates scenario coverage and suite hash before comparing.
- Command: `python scripts/compare-semantic-results.py --suite <suite.json> --baseline <baseline.json> --candidate <candidate.json> --out <report.json>`
- Expected: report generated; exit 0 for comparable inputs. Regression may be represented in report, not hidden as execution failure.
- Failure: blocking if inputs are malformed or non-comparable.

## Final gate
- Trigger: after independent semantic review
- Command: `python scripts/evaluate-semantic-gate.py --report <report.json> --review <review.json> --policy config/semantic-policy.json`
- Expected: `verified` only when no blocking/unapproved semantic difference remains.
- Failure: blocking.

## Lifecycle behavior
- Preserve first failing evidence.
- Retry only transient scenario execution once; hooks themselves are deterministic and not blindly retried.
- Never modify implementation, baseline, or expectations automatically from hook failures.