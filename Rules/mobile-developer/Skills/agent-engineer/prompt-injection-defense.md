# Prompt Injection Defense

## Purpose
Prevent untrusted content from overriding agent policy or manipulating privileged tool use.

## When to use
Use whenever agents process webpages, email, documents, search results, user uploads, tool output, or other untrusted text.

## Inputs
Trust boundaries, content sources, tools, credentials, policy, threat scenarios.

## Context to inspect
Retrieval pipeline, prompt construction, tool permissions, content rendering, approval gates, and data exfiltration paths.

## Core knowledge
Prompt injection is a trust-boundary problem. Treat external text as data. Strong defenses minimize privilege and independently validate actions rather than trying to detect every malicious phrase.

## Procedure
1. Classify instruction sources by authority.
2. Mark retrieved/external content as untrusted data.
3. Prevent content from dynamically granting permissions.
4. Restrict tools to task-required capabilities.
5. Validate destinations, parameters, and data disclosure.
6. Add approval for sensitive cross-boundary actions.
7. Limit secret visibility to the smallest runtime component.
8. Test direct, indirect, encoded, and multi-step injection attempts.
9. Monitor unusual tool sequences and exfiltration attempts.
10. Reassess controls when new tools or data sources are added.

## Decision points
Prefer architectural isolation over keyword filters. Use content detection as a signal, not the sole barrier.

## Common failure patterns
Trusting quoted text, exposing secrets in context, allowing arbitrary URLs, model-controlled authorization, and assuming delimiters are a sandbox.

## Verification
Red-team representative injection paths and prove sensitive actions remain policy-bound.

## Expected output
A documented trust model with enforceable controls and adversarial tests.

## Stop conditions
Stop if untrusted content can directly influence privileged execution without independent enforcement.