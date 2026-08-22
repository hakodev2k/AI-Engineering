# Evaluation Rules
## Purpose
Require repeatable evidence for AI quality and regression decisions.
## Scope
Offline evaluation, online evaluation, human review, golden sets, judges, and acceptance thresholds.
## MUST
- Define task-specific success and failure criteria before evaluating changes.
- Use representative datasets that include edge cases and known failure modes.
- Track evaluation versions, model versions, prompts, parameters, and datasets so results are reproducible.
- Separate quality, safety, latency, and cost metrics where trade-offs matter.
## MUST NOT
- Approve a production AI change based only on anecdotal examples or agent confidence.
- Reuse contaminated evaluation examples as hidden proof of generalization.
## SHOULD
- Combine automated metrics with targeted human review for subjective or high-impact behavior.
## Exceptions
Emergency changes require documented risk, limited scope, and post-release evaluation.
## Verification
Inspect evaluation artifacts, datasets, thresholds, experiment metadata, and regression reports.