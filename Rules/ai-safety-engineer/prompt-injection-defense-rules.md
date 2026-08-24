# Prompt Injection Defense Rules

## Purpose
Prevent untrusted content from overriding trusted instructions or inducing unsafe actions.

## Scope
Covers RAG, browsing, documents, email, tool outputs, memory, and other externally supplied model context.

## MUST
- Treat retrieved and external content as untrusted data unless explicitly authenticated as instructions.
- Enforce authorization and action constraints outside the model for consequential operations.
- Minimize privileges and data exposed to contexts influenced by untrusted input.
- Test direct, indirect, encoded, and multi-step injection paths.

## MUST NOT
- Rely on prompt wording as the sole control for privileged actions.
- Allow retrieved text to grant itself permissions.
- Expose secrets to the model when the task does not require them.

## SHOULD
- Separate instruction, data, and tool-result channels structurally where supported.
- Require confirmation or deterministic validation for high-impact actions.

## Exceptions
Any relaxation requires a bounded trust model, compensating controls, adversarial evidence, and approval.

## Verification
Inspect privilege enforcement, context construction, tool authorization, injection test suites, secret exposure paths, and action logs.
