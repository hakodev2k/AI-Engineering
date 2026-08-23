# Tool Use Rules

## Purpose
Constrain model-driven tool use to authorized, validated, observable actions.

## Scope
Function calling, connectors, APIs, code execution, file operations, and other tools exposed to model workflows.

## MUST
- Tool permissions MUST follow least privilege for the specific workflow.
- Prompts MUST distinguish read, recommend, prepare, and execute authority.
- Tool arguments MUST be validated independently before high-impact execution.
- Destructive, irreversible, security-sensitive, financial, or externally visible actions MUST require explicit authorization appropriate to risk.
- Tool errors MUST be surfaced to the model in a way that supports safe recovery without fabricating success.

## MUST NOT
- MUST NOT grant write capability when read-only access satisfies the task.
- MUST NOT let model-generated text bypass application-level authorization.
- MUST NOT report an action as completed without tool evidence of success.

## SHOULD
- Tools SHOULD have narrow schemas and bounded side effects.
- Idempotency protections SHOULD be used where retries could duplicate effects.

## Exceptions
Autonomous execution may be allowed for low-risk, reversible actions inside a documented authority boundary.

## Verification
Inspect tool scopes, authorization checks, argument validation, failure tests, retry behavior, and audit logs.