# Prompt Injection Testing

## Purpose
Systematically test whether untrusted instructions can override intended AI behavior, disclose protected context, or trigger unauthorized actions.

## When to use
Use for LLM applications that consume user input, web pages, documents, email, retrieval results, tool output, or other attacker-influenced text.

## Inputs
System prompts, application code, retrieval pipeline, tool schemas, authorization rules, representative content, and security requirements.

## Context to inspect
Identify direct and indirect instruction channels, prompt assembly order, tool-call gates, output consumers, sanitization, provenance metadata, and authorization enforcement outside the model.

## Core knowledge
Prompt injection is an instruction/data-boundary failure, not merely a malicious phrase. Encoding, translation, indirection, multi-turn setup, retrieved content, tool responses, and nested documents can carry attacks. Prompt secrecy is not a security boundary.

## Procedure
1. Establish protected behaviors and forbidden outcomes.
2. Build direct-injection cases targeting instruction hierarchy.
3. Build indirect cases embedded in realistic external content.
4. Test obfuscation, encoding, multilingual, split-message, and multi-turn variants.
5. Attempt data exfiltration and unauthorized tool invocation.
6. Test whether model output can inject downstream interpreters.
7. Record exact preconditions and reproducibility.
8. Validate mitigations at authorization and execution boundaries.
9. Add stable cases to regression suites.

## Decision points
Use deterministic policy enforcement for permissions and high-impact actions. Use content filtering and prompt hardening as defense-in-depth, not sole authorization.

## Common failure patterns
Testing only obvious jailbreak phrases; trusting delimiters as isolation; evaluating only final text; ignoring tool side effects; declaring success after one blocked wording.

## Verification
A mitigation is verified only when representative attack families fail without breaking required benign workflows and privileged actions remain independently authorized.

## Expected output
Reproducible findings with attack path, impact, severity, evidence, mitigation, and regression tests.

## Stop conditions
Stop active exploitation if tests could affect production data, third parties, paid actions, or credentials beyond the authorized test scope.