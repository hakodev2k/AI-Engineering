# NLP Safety and Abuse Resistance

## Purpose
Identify and mitigate harmful, manipulative, privacy-invasive, or policy-violating language behavior across NLP pipelines.

## When to use
Use for public-facing generation, moderation, RAG, conversational systems, user-generated content, or high-impact text automation.

## Inputs
Threat model, task contract, policy constraints, user/input channels, model behavior, red-team cases, incident history.

## Preconditions
Product owners can define unacceptable outcomes and escalation paths.

## Context to inspect
Prompt/input boundaries, retrieved content, moderation layers, logging, permissions, model outputs, abuse reports, sensitive-data paths.

## Core knowledge
Language systems face prompt injection, jailbreaks, toxic or biased outputs, data exfiltration, indirect instruction attacks, unsafe automation, and adversarial obfuscation. Safety controls should be layered and measurable.

## Procedure
1. Identify actors, assets, trust boundaries, and abuse goals.
2. Classify inputs as trusted instructions, untrusted data, or tool results.
3. Enumerate harmful output and data-exposure scenarios.
4. Add least-privilege access and content boundaries.
5. Define moderation, refusal, review, and rate-limit controls where appropriate.
6. Build adversarial cases using realistic obfuscation and multilingual inputs.
7. Test retrieved documents for indirect instruction attacks.
8. Validate that logging does not expose sensitive text unnecessarily.
9. Measure false positives and false negatives on safety controls.
10. Add incident feedback into regression tests.

## Decision points
Use deterministic blocking for hard policy constraints; model-based moderation where semantic context is necessary; human review when consequences are high and uncertainty remains.

## Common failure patterns
One safety prompt as the only defense, trusting retrieved text as instructions, unrestricted tool access, logging secrets, and red-teaming only obvious English attacks.

## Verification
Threat scenarios, adversarial suites, permission tests, moderation metrics, and escalation paths are validated.

## Expected output
Threat model, safety control map, adversarial test suite, operating thresholds, and residual-risk record.

## Stop conditions
Stop and escalate when the system can perform high-impact actions without enforceable authorization or when critical safety requirements cannot be tested.