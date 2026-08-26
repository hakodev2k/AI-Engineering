# Prompt Injection Resilience

## Purpose
Reduce the chance that untrusted content redirects model behavior or causes unauthorized data/tool actions.

## When to use
Use whenever prompts process user text, webpages, documents, emails, retrieved content, tool output, or other externally controlled data.

## Inputs
Trust boundaries, prompt assembly, tool permissions, sensitive data paths, attack cases, and product security policy.

## Context to inspect
Map every untrusted input and every privileged capability reachable from the model.

## Core knowledge
Prompt injection is a systems problem, not solvable by a magic sentence. Effective defenses combine instruction/data separation, least privilege, validation, authorization, confirmation, and monitoring.

## Procedure
1. Identify protected instructions, secrets, and actions.
2. Classify all context by trust source.
3. Delimit untrusted content and state its allowed purpose.
4. Prevent retrieved text from granting permissions.
5. Restrict tools to least privilege and validate arguments externally.
6. Require deterministic authorization for sensitive actions.
7. Add confirmation for consequential user-visible actions where appropriate.
8. Test direct, indirect, encoded, multilingual, and nested attacks.
9. Test data-exfiltration attempts across available tools/context.
10. Record residual risk and monitoring signals.

## Decision points
Use isolation or separate model calls when untrusted interpretation and privileged action need not share context. Remove capabilities when prompt defenses would otherwise carry the security boundary.

## Common failure patterns
Relying on “ignore previous instructions”; exposing secrets to the model unnecessarily; allowing model text to authorize tools; treating trusted-looking documents as trusted instructions; testing only direct jailbreak phrases.

## Verification
Red-team attack suites fail safely, tool authorization is enforced outside the model, secrets are absent from unnecessary context, and logs capture attempted boundary violations.

## Expected output
Threat model, layered controls, attack tests, residual-risk assessment, and escalation paths.

## Stop conditions
Stop if sensitive actions lack deterministic authorization, secret exposure cannot be prevented, or required security policy is unknown.