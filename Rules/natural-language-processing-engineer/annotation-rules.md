# Annotation Rules

## Purpose
Make human labels reliable, interpretable, and reproducible.

## Scope
Annotation guidelines, annotator qualification, disagreement, adjudication, quality control, and label revisions.

## MUST
- Label definitions MUST include positive, negative, ambiguous, and boundary examples.
- Annotators MUST receive task-appropriate instructions and qualification checks before labels are accepted.
- Material disagreement MUST be measured and investigated rather than hidden by majority vote alone.
- Guideline and label-schema versions MUST be traceable to produced labels.

## MUST NOT
- MUST NOT infer annotator consensus from a single labeler on inherently subjective high-impact tasks without justification.
- MUST NOT retroactively change label semantics without versioning and impact analysis.
- MUST NOT expose annotators to unnecessary sensitive information.

## SHOULD
- Ambiguous cases SHOULD have an explicit abstain, uncertain, or adjudication path when the task permits it.
- Quality checks SHOULD include seeded cases and periodic drift review.

## Exceptions
Reduced annotation rigor requires evidence that task risk is low, plus documented limitations and reviewer acceptance.

## Verification
Review guidelines, qualification results, agreement metrics, adjudication logs, schema history, seeded-case accuracy, and sampled annotations across languages and classes.