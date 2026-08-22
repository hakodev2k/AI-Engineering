# Lifecycle Hooks

## Pre-task validation
**Trigger:** before cost analysis. **Preconditions:** repository checkout and Python 3.10+. **Action:** `python scripts/verify_package.py`. **Expected:** exit 0. **Failure:** blocks execution.

## Cost gate
**Trigger:** after a usage export is available or after changes affecting prompts, model routing, retries, caching, or tool loops. **Action:** `python scripts/llm_cost_gate.py --events <usage.jsonl> --policy config/budget-policy.yaml --output artifacts/cost-gate.json`. **Expected:** exit 0 for pass/warn, exit 3 for hard-budget approval/block. **Failure:** parser/config errors block execution.

## Strict CI gate
**Trigger:** CI where warning-level anomalies must fail. **Action:** add `--fail-on-warn`. **Expected:** exit 0. **Failure:** exit 4 blocks merge until investigated or policy-reviewed.

## Final verification
**Trigger:** before marking work complete. **Action:** re-run the package verifier and cost gate against representative after-change usage; run the host repository's relevant functional tests. **Expected:** package verifier passes, cost status is `pass` or supported by a valid approved exception, functional tests pass. **Failure:** blocks completion.

No hook deploys, changes billing limits, edits production configuration, or performs destructive actions.
