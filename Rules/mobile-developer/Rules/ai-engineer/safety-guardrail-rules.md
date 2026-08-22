# Safety Guardrail Rules
## Purpose
Prevent unsafe, prohibited, or uncontrolled AI behavior.
## Scope
Input screening, output controls, policy enforcement, refusal behavior, and high-risk workflows.
## MUST
- Define safety boundaries appropriate to the product and user impact.
- Apply deterministic controls outside the model when consequences require guaranteed enforcement.
- Test guardrails against bypass, prompt-injection, encoding, and context-manipulation attempts.
- Fail closed for high-risk actions when safety checks cannot complete reliably.
## MUST NOT
- Rely only on a system prompt for mandatory authorization or irreversible safety controls.
- Disable safeguards merely to improve completion rate.
## SHOULD
- Layer prevention, detection, logging, and human escalation for sensitive workflows.
## Exceptions
Any weakening of mandatory safeguards requires explicit human approval, risk analysis, scope, and rollback plan.
## Verification
Review adversarial tests, policy checks, bypass tests, logs, and approval records.