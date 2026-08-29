# Prompt Injection Defense Rules

## Purpose
Prevent untrusted instructions from overriding trusted application policy or causing unauthorized actions and disclosure.

## Scope
Applies to system prompts, user prompts, retrieved content, tool outputs, files, web content, memory, and any text interpreted by an AI model.

## MUST
- Untrusted content MUST be treated as data, not authority, regardless of how confidently it instructs the model.
- Security-sensitive actions MUST be enforced by application controls outside the model.
- Retrieved or tool-supplied text MUST NOT gain higher instruction priority merely because it appears in model context.
- Systems with tools or privileged data MUST test direct and indirect prompt-injection scenarios before release.
- Sensitive operations MUST validate authorization at execution time.

## MUST NOT
- MUST NOT rely only on prompt wording to protect secrets, permissions, destructive actions, or tenant boundaries.
- MUST NOT expose hidden instructions, credentials, or privileged context to untrusted outputs without necessity.

## SHOULD
- Minimize privileged context and isolate untrusted data with explicit structure.
- Use deterministic policy checks for operations with meaningful impact.

## Exceptions
Any relaxation requires a documented threat scenario, compensating control, test evidence, and approval proportional to impact.

## Verification
Run adversarial prompt suites, inspect tool authorization paths, review context construction, verify secret minimization, and confirm protected actions fail closed when model output is malicious.