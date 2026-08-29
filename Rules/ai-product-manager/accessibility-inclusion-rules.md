# Accessibility and Inclusion Rules

## Purpose
Ensure AI product behavior remains usable and equitable across materially different user capabilities and contexts.

## Scope
Applies to interaction design, generated content, accessibility support, language coverage, assistive technology, and exclusion risk.

## MUST
- Product requirements MUST identify accessibility needs relevant to the target workflow.
- Critical user journeys MUST remain operable when generated output is incorrect, incomplete, or poorly formatted.
- Accessibility claims MUST be validated with appropriate tooling and human review where automation is insufficient.
- Language or demographic coverage limitations MUST be documented when model quality differs materially across groups.

## MUST NOT
- MUST NOT make accessibility-dependent users rely on unverified AI output when deterministic alternatives are required for safe operation.
- MUST NOT infer protected or sensitive traits for personalization without a justified and approved purpose.
- MUST NOT hide known quality gaps for underrepresented users behind global averages.

## SHOULD
- Evaluations SHOULD include representative accessibility and language slices.
- Interfaces SHOULD expose correction and recovery paths that do not require expert prompting.

## Exceptions
Exceptions require documented scope, affected users, mitigation, evidence, and a remediation plan.

## Verification
Inspect accessibility tests, evaluation slices, user research, UI recovery paths, and documented coverage limitations.