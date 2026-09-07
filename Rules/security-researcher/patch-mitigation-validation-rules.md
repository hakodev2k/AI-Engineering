# Patch and Mitigation Validation Rules

## Purpose
Verify that security fixes and mitigations remove the relevant attack path without introducing regressions, bypasses, or unsupported confidence.

## Scope
Applies to source patches, configuration mitigations, feature disablement, WAF or policy controls, dependency upgrades, firmware fixes, and compensating controls.

## MUST
- Validation MUST retest the original reproducer against the exact fixed build or configuration.
- The researcher MUST identify whether the change removes root cause, blocks one exploit path, reduces impact, or only detects activity.
- Variant inputs and neighboring code paths MUST be considered when the original root cause can manifest through multiple entry points.
- Security regressions introduced by the fix MUST be evaluated proportionally to the change.
- Temporary mitigations MUST document residual risk, operational assumptions, and conditions for removal.
- Fix validation MUST record affected and tested versions, configuration, and relevant evidence.
- A failed reproducer caused by environmental drift MUST NOT be interpreted as proof of remediation.
- Changes to production defenses MUST follow the owning team's approval and deployment process.

## MUST NOT
- MUST NOT declare a vulnerability fixed solely because a single proof of concept no longer works.
- MUST NOT equate a monitoring rule with prevention unless prevention is demonstrated.
- MUST NOT weaken unrelated security controls to make a patch pass testing.
- MUST NOT approve irreversible or high-risk production changes without the required human authority.
- MUST NOT hide residual exploit paths discovered during validation.

## SHOULD
- Prefer root-cause fixes over brittle input signatures where feasible.
- Add targeted regression tests that survive refactoring and exercise the violated security invariant.
- Validate both positive behavior and rejection/failure behavior after remediation.

## Exceptions
When full validation is impossible because the affected environment cannot be safely reproduced, use the strongest available evidence and document the untested assumptions, residual risk, and responsible acceptance authority.

## Verification
Review the original reproducer, fixed diff or configuration, regression tests, variant analysis, deployment evidence, and before/after observations. Confirm the conclusion precisely states what was fixed and what remains uncertain.