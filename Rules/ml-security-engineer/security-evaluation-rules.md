# Security Evaluation Rules

## Purpose
Require repeatable evidence that ML security controls address the intended threats.

## Scope
Applies to pre-release evaluation, regression testing, adversarial testing, and security acceptance criteria.

## MUST
- Define security test objectives from the current threat model.
- Use held-out or independently constructed attack cases where practical.
- Preserve test configurations, model versions, datasets, thresholds, and results for reproducibility.
- Fail promotion when mandatory security acceptance criteria are not met unless explicit risk acceptance is recorded.

## MUST NOT
- Select only favorable attacks or thresholds to support a release claim.
- Reuse compromised or overfit security test sets as sole acceptance evidence.
- Treat absence of observed exploit as proof of absence of vulnerability.

## SHOULD
- Include adaptive attacker testing for high-risk defenses.
- Track security regressions across model and pipeline versions.

## Exceptions
Reduced evaluation scope requires documented constraints, compensating evidence, residual risk, and approval.

## Verification
Review test plans, threat mapping, reproducibility artifacts, raw results, acceptance thresholds, and release decisions.