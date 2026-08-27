# Rubric Design Rules

## Purpose
Make subjective AI quality judgments explicit, consistent, and reviewable.

## Scope
Applies to human and model-based grading rubrics for correctness, relevance, style, safety, instruction following, reasoning outcomes, and task completion.

## MUST
- Rubrics MUST define each scored dimension in observable terms.
- Ordinal or numeric scales MUST include anchors describing materially different quality levels.
- Critical failure conditions MUST be represented explicitly rather than diluted into an average score.
- Rubrics MUST distinguish independent dimensions when combining them would hide meaningful defects.
- Rubric changes MUST be versioned and revalidated before longitudinal comparisons are made.

## MUST NOT
- MUST NOT use vague criteria such as “good quality” without operational definitions.
- MUST NOT assign graders criteria that require inaccessible information or hidden assumptions.
- MUST NOT change scoring interpretation after seeing comparative results merely to favor a candidate.

## SHOULD
- Rubrics SHOULD include representative positive, borderline, and negative examples.
- Ambiguous cases SHOULD be resolved through calibration and rubric clarification rather than ad hoc grader preference.

## Exceptions
A lightweight rubric may be used for exploratory work when results are clearly marked non-gating and no high-risk decision depends on them.

## Verification
Review rubric definitions, anchors, examples, calibration results, version history, and disagreement patterns. Confirm graders can apply the rubric consistently on a blinded sample.