# Evaluation Safety Rules

## MUST
- Compare candidate and baseline using the same case IDs and scoring dimensions.
- Preserve raw evaluation evidence needed to reproduce every blocking failure.
- Treat any failed `critical=true` case as release blocking.
- Validate result JSONL before computing aggregate metrics.
- Record evaluator/model/prompt/tool versions outside secrets.
- Require independent verification after implementation changes.
- Require explicit human approval before baseline replacement, threshold weakening, evaluator changes, production model changes, deployment, secret/config changes, or breaking contracts.

## MUST NOT
- Delete or exclude failing cases merely to make the gate pass.
- Convert semantic failures into retries until a favorable sample appears.
- Expose secrets, credentials, private customer payloads, or unsanitized PII in evaluation artifacts.
- Let the implementing agent be the only verifier.
- Claim success from aggregate scores when a critical case fails.
- Silently increase tool permissions or execute production writes.

## SHOULD
- Prefer deterministic assertions over LLM judges where behavior can be checked deterministically.
- Keep hidden holdout cases for changes likely to overfit a visible corpus.
- Review score distribution and concrete failures, not only averages.
- Use repeated sampling only when nondeterminism is itself part of the evaluation design and the sample count is fixed in advance.
