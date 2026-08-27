# Adversarial Robustness Rules

## Purpose
Bound NLP failure under malformed, manipulative, or distribution-shifted text.

## Scope
Prompt injection, Unicode tricks, obfuscation, adversarial examples, malformed input, denial-of-service text, and robustness testing.

## MUST
- Threat models MUST identify text-controlled attack surfaces and downstream privileges.
- Untrusted text MUST be treated as data, not authority, when combined with instructions or tools.
- Input size, recursion, expansion, and resource limits MUST be enforced where text can cause excessive computation.
- Security-critical NLP behavior MUST be adversarially tested before release.

## MUST NOT
- MUST NOT rely solely on model refusal behavior as an authorization control.
- MUST NOT execute instructions extracted from untrusted documents without independent policy checks.
- MUST NOT disable validation or safety controls to improve benchmark scores.

## SHOULD
- Tests SHOULD include encoding tricks, homoglyphs, instruction conflicts, long inputs, jailbreak-like content, and domain-specific attacks.
- Robustness failures SHOULD become regression fixtures.

## Exceptions
Accepted residual risk requires documented exploitability, impact, compensating controls, monitoring, and security approval.

## Verification
Run adversarial suites, fuzzing where applicable, permission-boundary tests, resource-limit tests, security review, and regression checks on known attacks.