# Bounce Handling Rules

## Purpose
Classify delivery failures correctly and prevent repeated sending that harms reputation or recipient experience.

## Scope
SMTP responses, DSNs, provider webhooks, hard/soft bounces, deferrals, suppression, and retry policy.

## MUST
- Bounce processing MUST retain receiver response codes and diagnostic text needed for investigation.
- Permanent invalid-recipient failures MUST suppress the address for the applicable stream or broader scope when warranted.
- Temporary failures MUST use bounded retry behavior appropriate to the SMTP outcome and message value.
- Classification logic MUST distinguish recipient, sender, policy, reputation, content, and infrastructure failures where evidence permits.
- Unknown or changed provider codes MUST be observable rather than silently misclassified.

## MUST NOT
- MUST NOT retry permanent failures indefinitely.
- MUST NOT convert all 4xx or 5xx outcomes into a single generic metric that hides actionable causes.
- MUST NOT suppress large recipient populations based on an unvalidated parser change.

## SHOULD
- Preserve raw provider events for a bounded diagnostic period subject to privacy policy.
- Regression-test parsers against representative receiver responses.

## Exceptions
Retry or suppression exceptions require message criticality, receiver evidence, bounded duration, monitoring, and approval for material risk.

## Verification
Replay representative events, inspect classifications and suppression transitions, compare retry behavior with policy, and reconcile aggregate provider outcomes with internal metrics.