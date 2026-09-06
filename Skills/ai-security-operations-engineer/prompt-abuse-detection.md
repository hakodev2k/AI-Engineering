# Prompt Abuse Detection

## Purpose
Detect prompt-based attempts to bypass policy, manipulate model behavior, exfiltrate hidden context, or induce unsafe tool use in production AI systems.

## When to use
Use for chat systems, copilots, RAG applications, agents, and any service accepting untrusted natural-language input.

## Inputs
Prompt and response telemetry, moderation outcomes, system prompts, tool-call metadata, identity context, rate data, known attack patterns, and incident history.

## Preconditions
Telemetry can associate user/session identity with model requests while respecting privacy requirements.

## Context to inspect
Inspect input preprocessing, system/developer instructions, model gateway, retrieval augmentation, moderation filters, tool execution, session memory, and policy enforcement points.

## Core knowledge
Prompt abuse is contextual. A suspicious phrase alone rarely proves malicious intent. Reliable detection combines lexical or classifier signals with repeated probing, privilege-seeking behavior, hidden-instruction extraction attempts, tool targeting, and policy-boundary traversal.

## Procedure
1. Define abuse outcomes rather than keyword lists.
2. Collect representative benign and malicious examples.
3. Identify features observable without unnecessary content retention.
4. Build layered detections using classifiers, rules, rate patterns, and behavioral correlation.
5. Distinguish curiosity, accidental triggering, automation, and deliberate adversarial probing.
6. Add tenant, account, session, IP, and tool context where lawful.
7. Assign severity based on achieved impact, not merely attempted language.
8. Route high-confidence events to investigation and lower-confidence events to aggregation.
9. Test against paraphrases, multilingual inputs, encoding, role-play, indirect injection, and multi-turn escalation.
10. Tune using false-positive and false-negative evidence.

## Decision points
Use blocking controls only when confidence and consequence justify user impact. Prefer observation and correlation when a single prompt is ambiguous. Escalate successful hidden-context or tool-boundary violations immediately.

## Common failure patterns
Static jailbreak keyword lists, ignoring multi-turn behavior, classifying policy-allowed security research as abuse, storing full sensitive prompts unnecessarily, and alerting on failed attempts with the same severity as successful compromise.

## Verification
Implemented means detections run on relevant traffic. Verified means adversarial test cases trigger expected outcomes, benign test suites remain usable, and response teams receive enough context to reproduce the event.

## Expected output
Detection rules or models, severity criteria, test corpus, tuning evidence, response routing, and documented blind spots.

## Stop conditions
Stop and escalate if reliable classification requires prohibited data collection, if model/provider telemetry is unavailable, or if successful compromise indicates an active incident requiring containment.