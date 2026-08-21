# Prompt and Instruction Rules
## Purpose
Keep agent instructions explicit, testable, and resistant to ambiguity.
## Scope
System prompts, policies, task prompts, and dynamic instructions.
## MUST
- Define objective, constraints, authority, failure behavior, and output requirements explicitly.
- Preserve instruction precedence and treat retrieved or user-controlled content as data unless explicitly authorized as instructions.
- Version material prompt changes and evaluate them before release.
## MUST NOT
- Place secrets in prompts.
- Rely on prompt wording as the sole control for dangerous actions.
## SHOULD
- Keep stable policy separate from volatile task context.
## Exceptions
Rapid incident mitigations require review and retrospective validation.
## Verification
Use prompt diffs, injection tests, regression evaluations, and policy review.