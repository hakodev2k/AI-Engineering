# Evaluation Rules

## Purpose
Require evidence-based evaluation of retrieval and answer quality before significant RAG changes are promoted.

## Scope
Applies to offline benchmarks, human judgments, synthetic test sets, end-to-end evaluations, regression suites, and release gates.

## MUST
- Evaluation MUST separate retrieval quality, grounding quality, citation quality, and generation quality where practical.
- Test sets MUST represent important user intents, difficult edge cases, and known failure modes.
- Baselines MUST be retained so changes can be compared against prior production behavior.
- Significant changes MUST include before/after metrics and qualitative error analysis.
- Evaluation data provenance, labeling criteria, and known limitations MUST be documented.
- Safety-, security-, or compliance-critical scenarios MUST have explicit pass/fail checks rather than aggregate scores alone.

## MUST NOT
- A single aggregate metric MUST NOT be used to conceal regressions in critical slices.
- Evaluation sets MUST NOT contain production-sensitive data without approved handling controls.
- Synthetic labels MUST NOT be treated as unquestioned ground truth when they are model-generated.

## SHOULD
- Use both deterministic checks and human review for nuanced answer-quality dimensions.
- Track slice-level results by query type, source, language, and risk category when relevant.
- Refresh evaluation sets when production traffic or corpus characteristics materially change.

## Exceptions
Exceptions require documented measurement limitations, alternative evidence, risk assessment, and reviewer approval for release-critical changes.

## Verification
Inspect benchmark definitions, versioned datasets, CI evaluation reports, slice metrics, failure examples, and release-gate criteria.