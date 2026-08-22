# Safety Guardrail Rules
## Purpose
Bound harmful or unacceptable agent behavior with enforceable controls.
## Scope
Input controls, action policies, output controls, and escalation.
## MUST
- Define prohibited and approval-gated actions according to system risk.
- Enforce critical guardrails outside model self-compliance where feasible.
- Fail closed for ambiguous authorization on high-impact actions.
## MUST NOT
- Use a single natural-language prompt as the only protection for dangerous capabilities.
- silently bypass a guardrail after repeated failure.
## SHOULD
- Layer preventive, detective, and recovery controls.
## Exceptions
Guardrail changes that reduce protection require explicit human approval, evidence, and rollback plan.
## Verification
Use policy tests, adversarial evaluations, configuration inspection, and approval-log review.