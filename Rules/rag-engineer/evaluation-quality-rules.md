# Evaluation and Quality Rules

## Purpose
Measure retrieval and answer quality with evidence that reflects production use cases.

## Scope
Golden datasets, relevance labels, recall, precision, groundedness, answer quality, segmentation, and human review.

## MUST
- Production retrieval changes MUST be evaluated against representative query sets before rollout.
- Evaluation datasets MUST document source, labeling method, scope, and known limitations.
- Retrieval quality MUST be measured separately from generation quality where possible.
- Material regressions in critical query classes MUST block release unless explicitly accepted.
- Evaluation conclusions MUST distinguish measured evidence from inference.

## MUST NOT
- MUST NOT rely only on aggregate averages when critical segments can regress.
- MUST NOT tune exclusively against the final test set.
- MUST NOT treat model-based grading as unquestioned ground truth.

## SHOULD
- Track recall, precision, ranking quality, groundedness, citation correctness, and task success as relevant.
- Combine automated evaluation with targeted human review.

## Exceptions
Temporary reduced coverage requires documented risk and remediation ownership.

## Verification
Inspect datasets, label quality, segment metrics, baseline comparisons, and release gates.