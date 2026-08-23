# Lifecycle Messaging Rules

## Purpose
Use messaging to deliver relevant value without spam, manipulation, or compliance risk.

## Scope
Email, push, SMS, in-product messages, reminders, and re-engagement campaigns.

## MUST
- Define audience, trigger, frequency, suppression rules, consent requirements, and success/guardrail metrics.
- Honor opt-outs and channel preferences promptly and consistently.
- Test duplicate sends, retries, timezone behavior, and stale-trigger scenarios.

## MUST NOT
- Send sensitive information through channels inappropriate for its confidentiality.
- Optimize clicks while ignoring complaints, unsubscribes, delivery reputation, or downstream value.

## SHOULD
- Coordinate messaging across channels to avoid overlapping or contradictory communication.

## Exceptions
Transactional or legally required messages may bypass marketing suppression only when their purpose genuinely requires it.

## Verification
Inspect audience queries, consent filters, send logs, retry behavior, suppression lists, complaint rates, and downstream metrics.