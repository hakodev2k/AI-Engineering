# Sender Reputation Management

## Purpose
Operate domain and IP reputation as measurable production assets and prevent short-term sending goals from creating long-lived mailbox-provider distrust.

## When to use
Use for routine deliverability operations, reputation degradation, volume changes, new acquisition channels, or executive review of delivery health.

## Inputs
Mailbox-provider reputation data, complaint/bounce rates, engagement trends, placement tests, volume/cadence, blocklists, and traffic segmentation.

## Preconditions
Metrics must be segmented by identity, provider, and traffic class rather than only globally.

## Context to inspect
Review domain/IP history, spikes, cohort quality, authentication, complaint sources, trap-like behavior, opt-out latency, and changes to links/content.

## Core knowledge
Reputation is provider-specific and multi-signal. Positive engagement cannot safely compensate for poor consent. Sudden volume/cadence changes can resemble abuse. Domain reputation often persists across IP moves.

## Procedure
1. Baseline reputation by major mailbox provider and sending identity.
2. Correlate changes with volume, cohorts, campaigns, infrastructure, and complaints.
3. Isolate the smallest harmful stream or source.
4. Reduce or pause risky cohorts before increasing infrastructure complexity.
5. Repair acquisition, suppression, authentication, or cadence causes.
6. Protect critical transactional traffic through routing isolation where needed.
7. Recover gradually with wanted, engaged traffic.
8. Track leading and lagging indicators until stable.
9. Document causal evidence and preventive controls.

## Decision points
Prefer reducing questionable volume over rotating identities. Isolate streams when reputation coupling is material, but do not use new identities to evade enforcement.

## Common failure patterns
IP hopping, averaging away provider-specific problems, optimizing opens while ignoring complaints, sending through reputation incidents, and confusing campaign performance with deliverability.

## Verification
Confirm sustained improvement across provider reputation, acceptance/deferral, complaints, bounces, and placement—not merely one dashboard metric.

## Expected output
A reputation diagnosis, prioritized remediation plan, and monitored recovery trajectory.

## Stop conditions
Stop high-risk sending when evidence suggests abuse, compromised lists, or provider enforcement that requires remediation before further traffic.