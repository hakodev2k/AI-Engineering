# Bot, Rate Limit, and Abuse Control

## Purpose
Control automated and abusive traffic while preserving legitimate users, integrations, crawlers, and accessibility tools.

## When to use
Use for scraping, credential stuffing, expensive endpoint abuse, API floods, or bot-management design.

## Inputs
Request logs, identity signals, endpoint costs, known clients, abuse indicators, business tolerance, rate-limit capabilities.

## Context to inspect
IP/client identification, authentication, tokens, bot scores, WAF rules, API quotas, NAT patterns, retry behavior.

## Core knowledge
IP alone is a weak identity. Robust controls combine authenticated identity, device/session signals, behavioral patterns, endpoint cost, and progressive responses.

## Procedure
1. Classify legitimate automation and abusive behaviors.
2. Establish per-endpoint cost and normal request distributions.
3. Choose stable identity keys where available.
4. Define burst and sustained limits separately.
5. Use progressive actions: observe, throttle, challenge, then block.
6. Exempt trusted integrations narrowly and audibly.
7. Return clear retry semantics for APIs.
8. Monitor false positives and attacker adaptation.
9. Revisit limits after traffic/product changes.

## Decision points
Use token/user limits for authenticated APIs, IP/network limits as secondary protection, and behavioral controls for anonymous abuse. Avoid CAPTCHAs where machine clients must operate.

## Common failure patterns
Single global IP limit, ignoring carrier NAT, permanent allowlists, attacker-controlled identity headers, synchronized retries, and no visibility into challenged traffic.

## Verification
Replay representative legitimate and abusive patterns, confirm limits and retry behavior, and measure false-positive rates.

## Expected output
A documented abuse-control policy with identity hierarchy, thresholds, progressive actions, exceptions, and metrics.

## Stop conditions
Escalate when controls materially affect contractual API clients or require collection of new privacy-sensitive signals.