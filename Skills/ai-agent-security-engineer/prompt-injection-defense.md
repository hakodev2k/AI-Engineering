# Prompt Injection Defense

## Purpose
Reduce the probability that untrusted content can redirect an agent, leak sensitive context, or trigger unauthorized tool use.

## When to use
Use when agents process webpages, email, documents, tickets, retrieved text, user uploads, API responses, or any content that may contain instructions.

## Inputs
Prompt pipeline, tool schemas, retrieval paths, representative malicious inputs, authorization rules, and target actions.

## Preconditions
Treat external content as data, not authority. Know which instructions are trusted and which effects require deterministic enforcement.

## Context to inspect
System/developer prompts, message ordering, tool descriptions, retrieval formatting, browser output, memory writes, model-to-tool adapter, and approval gates.

## Core knowledge
Prompt injection is an instruction/data-boundary problem. No prompt wording alone creates a hard security boundary. Effective defense combines context separation, least privilege, output validation, action authorization, isolation, and monitoring.

## Procedure
1. Enumerate all untrusted content sources.
2. Mark trusted instruction channels explicitly.
3. Remove unnecessary secrets and capabilities from model context.
4. Separate retrieved data from agent policy structurally where possible.
5. Minimize tool scopes and parameters.
6. Require deterministic authorization before sensitive actions.
7. Add confirmation for high-impact external side effects.
8. Validate model-produced tool arguments against schemas and policy.
9. Detect suspicious instruction-like content without relying on detection as the sole control.
10. Test direct, indirect, encoded, multilingual, and multi-step injection variants.
11. Test attacks that combine retrieval, memory, and tools.
12. Log blocked and successful policy decisions for review.

## Decision points
Prefer removing a tool over filtering prompts when the capability is unnecessary. Use human approval when consequences are high and reliable machine policy cannot decide safely.

## Common failure patterns
Keyword blocklists as primary defense, putting secrets in prompts, trusting sanitized HTML as safe, allowing the model to decide its own authorization, and testing only direct user injections.

## Verification
Verify malicious content cannot bypass deterministic policy, access unavailable secrets, or invoke restricted capabilities. Confirm benign workflows still function.

## Expected output
A layered injection-defense design plus adversarial tests and evidence of enforced authorization boundaries.

## Stop conditions
Escalate when sensitive actions lack an enforceable policy layer or the design requires the model to hold secrets it does not need.