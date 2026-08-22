# Tool Use Rules
## Purpose
Keep AI tool invocation authorized, bounded, and observable.
## Scope
Function calling, agents, connectors, shell/database actions, external APIs, and side effects.
## MUST
- Validate tool inputs independently of model output before execution.
- Enforce least privilege and explicit authorization outside the model.
- Distinguish read-only analysis from state-changing execution.
- Record material tool calls, outcomes, and failures with sensitive-data redaction.
## MUST NOT
- Let the model grant itself permissions or bypass approval requirements.
- Execute destructive or irreversible actions solely because the model requested them.
## SHOULD
- Use allowlists, schemas, timeouts, idempotency, and bounded retries for tool integrations.
## Exceptions
High-risk execution exceptions require human approval, limited scope, and rollback or recovery planning.
## Verification
Review permission boundaries, tool schemas, approval tests, audit logs, and adversarial tool-use cases.