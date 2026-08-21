# Prompt Design Rules
## Purpose
Make prompts explicit, maintainable, testable, and resistant to unintended behavior.
## Scope
System prompts, developer prompts, templates, few-shot examples, and runtime prompt assembly.
## MUST
- Separate instructions, context, untrusted data, and output requirements clearly.
- Define failure behavior and required constraints for safety-critical tasks.
- Version material prompt changes and evaluate them against representative cases.
## MUST NOT
- Treat user-supplied or retrieved content as trusted instructions by default.
- Hide critical behavioral requirements only in examples when they belong in explicit instructions.
## SHOULD
- Keep prompts concise enough to reduce ambiguity and token cost without removing required constraints.
## Exceptions
Exceptions require rationale, risk analysis, and evaluation evidence.
## Verification
Inspect prompt templates, diff history, injection tests, and regression evaluation results.