# Email Lifecycle Marketing

## Purpose
Design permission-based email programs that move customers through onboarding, activation, engagement, retention, expansion, and re-engagement.

## When to use
Use when owned customer communication can improve activation, education, repeat usage, renewal, or conversion.

## Inputs
Lifecycle states, consent records, customer events, segmentation, messaging, product milestones, deliverability data, and business goals.

## Context to inspect
Inspect consent source, suppression rules, sender reputation, bounce and complaint rates, lifecycle event quality, existing automations, frequency, localization, and downstream outcomes.

## Core knowledge
Email performance depends on permission, relevance, timing, deliverability, and customer value. Open rate is an unreliable primary success metric. Lifecycle triggers often outperform arbitrary calendar sends because context is stronger.

## Procedure
1. Map customer lifecycle states and desired transitions.
2. Identify moments where email adds genuine value.
3. Define eligibility, consent, suppression, and frequency rules.
4. Specify trigger events and fallback behavior.
5. Create message hierarchy and calls to action.
6. Build sequences with exit conditions to avoid stale messaging.
7. QA rendering, links, personalization, localization, and tracking.
8. Warm and protect sender reputation where required.
9. Measure delivery, clicks, conversions, complaints, unsubscribes, and downstream outcomes.
10. Experiment on timing, content, cadence, and targeting.
11. Retire low-value automations.

## Decision points
Use triggered messages for contextual behavior; use broadcasts for genuinely shared timely information. Prefer fewer relevant sends when marginal frequency increases fatigue.

## Common failure patterns
Sending without valid consent, no suppression logic, duplicate automations, stale personalization, optimizing opens, aggressive re-engagement, broken preference centers, and measuring email conversions without incrementality awareness.

## Verification
Test eligibility paths, unsubscribe behavior, event triggers, rendering, attribution, deliverability, and holdout performance for important programs.

## Expected output
A lifecycle program map with triggers, audiences, messages, cadence, exit rules, compliance controls, and measurement.

## Stop conditions
Stop when consent is ambiguous, suppression systems fail, deliverability deteriorates materially, or required privacy/legal review is incomplete.