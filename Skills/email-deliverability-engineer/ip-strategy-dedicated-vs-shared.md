# IP Strategy: Dedicated vs Shared

## Purpose
Choose and operate sending IP pools based on volume, reputation control, workload criticality, and operational maturity.

## When to use
Use when selecting an ESP plan, adding dedicated IPs, segmenting traffic, recovering from reputation issues, or planning scale.

## Inputs
Daily/hourly volume, recipient-domain mix, traffic classes, seasonality, current IP reputation, provider limits, and staffing for warm-up/monitoring.

## Preconditions
Have enough stable volume data to judge whether a dedicated IP can sustain reputation.

## Context to inspect
Review IP ownership, PTR/HELO, shared-pool quality, dedicated-pool history, rate patterns, blocklists, complaint/bounce rates, and mailbox-provider reputation dashboards.

## Core knowledge
Dedicated IPs give control but also make the sender solely responsible for reputation. Shared pools can benefit low-volume senders but inherit pooled risk. More IPs are not automatically better; underutilized IPs can stay cold.

## Procedure
1. Quantify steady-state and peak volume by traffic class.
2. Identify critical streams needing reputation isolation.
3. Evaluate current shared-pool performance and provider governance.
4. Estimate volume per proposed dedicated IP.
5. Verify PTR, HELO, authentication, and monitoring capabilities.
6. Select the smallest pool that meets throughput and risk needs.
7. Define warming and mailbox-provider-specific rate limits.
8. Route critical and bulk traffic intentionally.
9. Monitor reputation and placement per IP and domain.
10. Rebalance only with controlled changes and enough observation time.

## Decision points
Prefer shared IPs for small or irregular volume when the provider maintains a strong pool. Prefer dedicated IPs for sustained volume, strict isolation, or regulated operational control. Add IPs for proven capacity needs, not as a quick fix for poor reputation.

## Common failure patterns
Too many dedicated IPs, sudden full-volume cutover, no PTR/HELO consistency, using new IPs to evade blocks, mixing high-risk acquisition mail with critical transactional traffic, and ignoring domain reputation.

## Verification
Confirm identity configuration, warm-up progression, per-IP throughput, provider acceptance, complaint/bounce trends, and inbox-placement indicators.

## Expected output
An evidence-based IP model with pool assignments, warm-up controls, and monitoring thresholds.

## Stop conditions
Stop if projected volume cannot sustain a dedicated reputation or if proposed routing appears intended to bypass provider enforcement.