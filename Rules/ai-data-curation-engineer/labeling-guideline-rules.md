# Labeling Guideline Rules
## Purpose
Make human and automated labels consistent, interpretable, and reviewable.
## Scope
Annotation schemas, instructions, adjudication, label definitions, and labeling workflows.
## MUST
- Label definitions MUST include inclusion, exclusion, ambiguity, and edge-case guidance.
- Annotators MUST receive versioned instructions appropriate to the task.
- Guideline changes MUST trigger impact review on already labeled data.
## MUST NOT
- Ambiguous labels MUST NOT be treated as objective ground truth without documented uncertainty.
- Annotators MUST NOT infer protected or sensitive attributes unless the task explicitly requires and authorizes it.
## SHOULD
- Complex tasks SHOULD include examples and counterexamples drawn from realistic cases.
## Exceptions
Exceptions require rationale and evidence that interpretation remains consistent.
## Verification
Inspect guidelines, version history, calibration samples, annotator feedback, and disagreement patterns.