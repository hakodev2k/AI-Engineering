# Safety Incident Rules

## Purpose
Respond to AI behavior that creates credible risk of harm while preserving appropriate human oversight.

## Scope
Applies to harmful outputs, unsafe agent actions, guardrail failures, unsafe recommendations, abuse patterns, and failures in high-impact AI workflows.

## MUST
- Safety triage MUST evaluate severity of potential harm, affected population, exploitability, recurrence, and available containment.
- Credible high-severity safety failures MUST be contained before broad feature restoration.
- Safety mitigations MUST be tested for both risk reduction and unacceptable impact on legitimate use.
- Human review MUST be used for consequential safety judgments that exceed automated-policy authority.
- Repeated or systemic safety failures MUST trigger evaluation of underlying model, policy, data, and product design rather than only case-level blocking.
- Residual safety risk after remediation MUST be explicitly documented and accepted by authorized owners when material.

## MUST NOT
- Safety controls MUST NOT be weakened solely to improve engagement, completion rate, or incident closure time.
- Responders MUST NOT expose harmful incident content more widely than necessary for investigation.
- Absence of confirmed harm MUST NOT be treated as proof that a credible near miss was harmless.

## SHOULD
- Preserve sanitized regression cases for future safety evaluation.
- Coordinate with trust, safety, security, product, and legal stakeholders as appropriate.

## Exceptions
Emergency restrictive measures may prioritize safety over availability until a reviewed mitigation is ready.

## Verification
Review safety evaluations, containment evidence, regression tests, approval records, and residual-risk decisions.