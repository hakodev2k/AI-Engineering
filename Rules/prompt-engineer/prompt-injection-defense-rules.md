# Prompt Injection Defense Rules

## Purpose
Reduce the risk that untrusted content changes authorized model behavior.

## Scope
Prompts that consume user input, web content, files, retrieved documents, tool results, or other externally controlled text.

## MUST
- Untrusted content MUST be clearly separated from trusted instructions.
- Prompts MUST explicitly prohibit untrusted content from redefining goals, permissions, secrets handling, or tool authority.
- High-impact workflows MUST include adversarial injection evaluations covering direct and indirect attacks.
- Sensitive actions MUST be gated by authorization checks outside prompt wording alone.

## MUST NOT
- MUST NOT treat model refusal text as the only security boundary.
- MUST NOT embed secrets in prompts exposed to untrusted context.
- MUST NOT grant broader tool permissions merely to make injection handling easier.

## SHOULD
- Suspicious instruction-like content SHOULD be surfaced as data for inspection rather than executed.
- Defense tests SHOULD include obfuscation, multilingual attacks, nested quoting, and retrieved-content attacks.

## Exceptions
Any workflow intentionally executing instructions from external content requires an explicit trust model, constrained capability set, monitoring, and human approval for high-risk actions.

## Verification
Run adversarial evaluation suites, inspect tool authorization boundaries, review composed prompts, and verify secrets and privileged instructions remain isolated.