# Safety Policy Routing Rules

## Purpose
Ensure routing never weakens required safety controls or sends requests to targets unsuitable for the risk profile.

## Scope
Safety classification, target eligibility, moderation dependencies, refusal behavior, high-risk workloads, and policy fallbacks.

## MUST
- Safety-sensitive request classes MUST have explicit eligibility requirements for models, providers, and supporting controls.
- Hard safety requirements MUST be enforced before cost or latency optimization.
- Fallback targets MUST preserve mandatory safety behavior.
- Material policy or target changes MUST be tested against known high-risk and boundary cases.
- Safety-routing decisions MUST be auditable without storing prohibited sensitive content.

## MUST NOT
- MUST NOT disable, bypass, or weaken safety controls merely to restore availability.
- MUST NOT route high-risk traffic to unvalidated targets.
- MUST NOT treat a successful model response as proof of policy compliance.

## SHOULD
- Keep safety eligibility rules independent from commercial routing preferences.
- Add regression cases for confirmed policy-routing failures.

## Exceptions
Exceptions require authorized human approval, bounded scope, documented risk, and compensating controls.

## Verification
Inspect policy gates, eligibility tests, adversarial evaluations, decision logs, and fallback tests.