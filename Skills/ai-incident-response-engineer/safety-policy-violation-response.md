# Safety Policy Violation Response

## Purpose
Respond to harmful or policy-violating AI outputs with evidence preservation, containment, scope analysis, and validated mitigation.

## When to use
Use when the system produces disallowed content, unsafe advice, harmful autonomous behavior, or systematic refusal failures.

## Inputs
Conversation traces, policy category, model/prompt versions, moderation decisions, user context, frequency estimates, safety evaluations.

## Preconditions
Handle sensitive examples according to access and retention policy.

## Context to inspect
Safety classifier, system prompt, policy routing, fine-tune/model version, tool access, locale, jailbreak defenses, fallback models.

## Core knowledge
Safety incidents require both content-level and system-level analysis. A single example may be isolated; repeated bypass patterns can indicate systemic weakness.

## Procedure
1. Preserve minimal necessary evidence.
2. Classify the policy boundary crossed.
3. Determine whether harm is ongoing.
4. Contain risky capability or route.
5. Search for similar incidents and affected segments.
6. Reproduce under controlled conditions.
7. Identify bypass mechanism or control failure.
8. Implement layered mitigation.
9. Run targeted and general safety regression tests.
10. Restore only after measurable improvement.

## Decision points
Escalate severity for scalable bypasses, vulnerable-user impact, or agentic side effects.

## Common failure patterns
Overfitting to one jailbreak string, deleting evidence too early, relying on one classifier, and restoring without regression testing.

## Verification
Targeted adversarial tests no longer reproduce the failure and unrelated safe functionality remains available.

## Expected output
Policy classification, impact scope, containment, validated mitigation, and follow-up actions.

## Stop conditions
Escalate when legal, trust-and-safety, or security review is required.