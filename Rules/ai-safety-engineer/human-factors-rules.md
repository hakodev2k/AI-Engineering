# Human Factors Rules

## Purpose
Design safety controls around realistic human behavior, workload, comprehension, and failure modes.

## Scope
Covers warnings, approvals, handoffs, operator interfaces, escalation, and user-facing safety interactions.

## MUST
- Present material risk and uncertainty in a form the responsible human can understand before consequential approval.
- Ensure approval interfaces identify the actual action, target, scope, and irreversible effects.
- Test critical workflows for automation bias, alert fatigue, and ambiguous responsibility.
- Provide escalation paths when users cannot safely resolve uncertainty.

## MUST NOT
- Use generic confirmation dialogs as meaningful approval for high-impact actions.
- Assume a human-in-the-loop control is effective without measuring whether humans can detect the relevant failure.
- Hide safety-critical information behind optional detail by default.

## SHOULD
- Minimize repeated low-value warnings that train users to click through.
- Use progressive disclosure while keeping critical consequences prominent.

## Exceptions
Alternative interaction patterns require usability evidence and documented safety rationale.

## Verification
Review usability studies, approval screenshots or specifications, operator exercises, error rates, and escalation outcomes.
