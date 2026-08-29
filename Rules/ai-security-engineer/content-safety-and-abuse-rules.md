# Content Safety and Abuse Rules

## Purpose
Reduce harmful, prohibited, or abusive use of AI capabilities while preserving legitimate use.

## Scope
Applies to user-facing generation, automated actions, high-risk domains, account abuse, and platform misuse controls.

## MUST
- High-risk AI capabilities MUST define abuse cases, prohibited behaviors, and measurable guardrails before broad release.
- Safety controls MUST be applied at the system boundary appropriate to the risk and MUST NOT rely exclusively on model refusal behavior.
- Abuse signals MUST be logged with privacy-aware evidence sufficient for investigation.
- Repeated or high-impact abuse MUST have escalation and containment procedures.
- Safety-control changes MUST be evaluated against representative benign and adversarial cases.

## MUST NOT
- MUST NOT silently weaken safety controls to improve conversion, latency, or test pass rates without approved risk review.
- MUST NOT treat a single classifier or prompt as infallible.
- MUST NOT block legitimate users solely on opaque model confidence when deterministic evidence is available.

## SHOULD
- Use defense in depth: account controls, policy checks, rate limits, classifiers, human review, and monitoring as appropriate.
- Track false positives and false negatives separately.

## Exceptions
Exceptions require documented user value, abuse risk, compensating controls, monitoring, expiry, and accountable approval.

## Verification
Review abuse-case coverage, safety evaluations, moderation configuration, incident records, false-positive metrics, escalation procedures, and change approvals.