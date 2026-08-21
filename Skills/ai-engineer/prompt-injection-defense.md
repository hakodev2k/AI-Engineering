# Prompt Injection Defense

## Purpose
Reduce the chance that untrusted content overrides system intent, leaks secrets, or causes unsafe tool actions.

## When to use
Use whenever models consume user text, retrieved documents, web pages, email, files, or tool output.

## Inputs
Instruction hierarchy, data sources, tools, secrets, trust boundaries, attack examples, authorization model.

## Preconditions
Identify trusted instructions, untrusted data, sensitive capabilities, and irreversible actions.

## Context to inspect
Prompt construction, RAG pipeline, tool schemas, secret handling, output rendering, authorization checks, audit logs.

## Core knowledge
Prompt injection is a trust-boundary problem, not a prompt-wording problem. Untrusted text may contain instructions. Security must be enforced in application controls: least privilege, data separation, allowlists, validation, approvals, and output sanitization.

## Procedure
1. Map trusted and untrusted inputs.
2. Keep secrets out of model context unless strictly required.
3. Mark retrieved/tool content as data, never authority.
4. Limit tools and scopes to task-specific capabilities.
5. Validate arguments and authorization outside the model.
6. Require confirmation or policy checks for high-impact actions.
7. Sanitize model output before HTML, SQL, shell, or other execution contexts.
8. Test direct, indirect, encoded, and multi-step injection attacks.
9. Log denied or suspicious actions without exposing secrets.
10. Add discovered attacks to regression evaluations.

## Decision points
Use isolation or a separate model stage for high-risk untrusted content. Disable autonomous writes when safe authorization cannot be enforced deterministically.

## Common failure patterns
Telling the model to ignore attacks and stopping there, putting credentials in prompts, broad tool access, trusting retrieved text, and executing model output directly.

## Verification
Run adversarial tests and confirm unauthorized data/actions remain inaccessible even when the model follows malicious content.

## Expected output
Documented trust boundaries, controls, attack tests, and residual risks.

## Stop conditions
Stop when security depends solely on prompt compliance or tool permissions cannot be constrained.