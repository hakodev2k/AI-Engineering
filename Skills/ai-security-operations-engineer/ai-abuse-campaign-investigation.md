# AI Abuse Campaign Investigation

## Purpose
Investigate coordinated or repeated abuse of AI systems across accounts, sessions, credentials, networks, tenants, or time periods and convert isolated alerts into a campaign-level understanding.

## When to use
Use when similar malicious behaviors recur, multiple identities appear related, rate-limit evasion is suspected, or individual alerts understate coordinated activity.

## Inputs
Alert history, identity and credential data, request features, network indicators, model/tool actions, timestamps, tenant context, abuse outcomes, and prior dispositions.

## Preconditions
Cross-event correlation is permitted and relevant telemetry is retained for the investigation window.

## Context to inspect
Inspect registration and authentication patterns, API-key issuance, IP/network data, prompt or derived feature similarity, target resources, timing, tool usage, payment/entitlement context, and prior enforcement.

## Core knowledge
Campaign attribution should be evidence-based and probabilistic. Shared infrastructure or similar prompts do not prove common control. Stronger links come from repeated combinations of identity, timing, behavioral sequence, credentials, targets, and unique operational patterns.

## Procedure
1. Define the seed incidents and suspected common behavior.
2. Normalize indicators and behavioral features.
3. Build a timeline across accounts and systems.
4. Cluster activity using multiple independent signals.
5. Separate strong, moderate, and weak linkage evidence.
6. Identify campaign goals, targets, successful actions, and adaptation to defenses.
7. Search historically for earlier matching activity.
8. Identify currently active identities and infrastructure.
9. Recommend scoped enforcement and new detections.
10. Preserve uncertainty explicitly rather than overstating attribution.
11. Monitor for re-entry after containment.

## Decision points
Use account-level action when evidence is isolated; campaign-level controls are justified when independent linkage signals converge. Avoid broad network blocking if shared infrastructure could affect unrelated users.

## Common failure patterns
Attributing by IP alone, merging unrelated researchers with attackers, ignoring low-and-slow behavior, counting retries as independent actors, and failing to document confidence.

## Verification
Implemented means related events are clustered and assessed. Verified means sampled campaign links have supporting evidence, enforcement targets the intended activity, and post-action monitoring detects likely re-entry.

## Expected output
Campaign timeline, linked entities, confidence levels, objectives, impact, indicators, enforcement recommendations, and detection updates.

## Stop conditions
Escalate when attribution has legal implications, enforcement may affect major customers, or evidence suggests organized criminal or state-linked activity requiring specialist handling.