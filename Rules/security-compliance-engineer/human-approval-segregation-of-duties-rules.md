# Human Approval and Segregation of Duties Rules

## Purpose
Prevent unauthorized or self-approved high-risk actions and preserve independent oversight for security and compliance decisions.

## Scope
Applies to production changes, access grants, control exceptions, destructive actions, security-control weakening, evidence approval, and other high-risk activities.

## MUST
- High-risk actions MUST identify which roles may analyze, recommend, prepare, approve, and execute the action.
- Required approvals MUST come from accountable humans with authority appropriate to the risk.
- Segregation-of-duties requirements MUST be enforced where one person or agent could otherwise initiate, approve, and conceal a material action.
- Emergency execution MUST preserve attribution and require retrospective review.

## MUST NOT
- AI agents MUST NOT silently exceed delegated authority or treat recommendation permission as execution permission.
- A person MUST NOT self-approve a control exception or high-risk access grant when independent approval is required.
- Approval evidence MUST NOT be inferred from informal silence or lack of objection.
- Force push, infrastructure destruction, destructive data operations, secret rotation, security-control weakening, or breaking public contracts MUST NOT be executed without required human authorization.

## SHOULD
- Use workflow-enforced approvals and immutable decision records for material actions.
- Design emergency procedures that preserve safety while minimizing approval bottlenecks.

## Exceptions
Emergency deviations require explicit authorized invocation, limited scope, documented reason, compensating safeguards, and post-event review.

## Verification
Inspect approval workflows, role assignments, execution logs, exception records, emergency actions, and samples for self-approval or unauthorized execution.