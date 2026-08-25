# Human-Robot Interaction Rules
## Purpose
Make robot intent, authority, and operator interaction understandable and safe.
## Scope
Operator controls, mode indicators, teach interfaces, remote operation, warnings, and handoff.
## MUST
- Make current mode, motion authority, faults, and consequential pending actions visible to the operator.
- Require deliberate confirmation for high-consequence actions not safely reversible.
- Define behavior for lost operator link, conflicting commands, and ambiguous control ownership.
- Design controls so emergency and protective actions remain accessible under foreseeable stress.
## MUST NOT
- Use ambiguous indicators for materially different safety states.
- Allow background automation to silently override explicit operator safety actions.
## SHOULD
- Validate workflows with representative users and realistic failure scenarios.
## Exceptions
Reduced interaction affordances require documented operating constraints and training/administrative controls.
## Verification
Perform usability tests, mode-confusion scenarios, remote-link loss tests, control-authority tests, and human-factors review.