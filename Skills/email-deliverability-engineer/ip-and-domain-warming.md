# IP and Domain Warming

## Purpose
Introduce new IPs or domains gradually so mailbox providers can establish stable reputation from representative, wanted traffic.

## When to use
Use for new infrastructure, new sending domains/subdomains, long-idle identities, or major provider migrations.

## Inputs
Target volume, historical recipient engagement, mailbox-provider mix, complaint/bounce baselines, traffic priorities, and ramp deadline.

## Preconditions
Authentication, suppression, list hygiene, telemetry, PTR/HELO, and rate controls must already be correct.

## Context to inspect
Inspect prior domain reputation, recipient cohorts, active-user recency, mailbox-provider throttles, historical cadence, and peak-volume requirements.

## Core knowledge
Warm-up is reputation establishment, not a fixed calendar. High-quality engaged traffic is more valuable than arbitrary volume. Different mailbox providers may tolerate different ramps. A new IP does not erase poor domain/list reputation.

## Procedure
1. Establish baseline quality and expected provider mix.
2. Select the most recent, engaged, consented recipients for early sends.
3. Define conservative starting volumes by provider and traffic stream.
4. Increase only after acceptance, bounce, complaint, and placement signals remain healthy.
5. Hold or reduce volume when throttling or negative reputation emerges.
6. Keep cadence consistent rather than alternating silence and spikes.
7. Add progressively older/lower-engagement cohorts only after stable results.
8. Preserve transactional priority during shared-capacity ramps.
9. Record each ramp change and observed effect.
10. Declare warm-up complete based on sustained target-volume evidence, not elapsed days.

## Decision points
Slow the ramp when 4xx policy deferrals, complaints, or placement degradation rise. Avoid splitting tiny volume over many IPs. If migration deadline conflicts with safe ramping, retain old infrastructure longer rather than forcing volume.

## Common failure patterns
Day-one full volume, random recipient selection, purchased/unverified lists, changing content and infrastructure simultaneously, ignoring provider-specific throttling, and treating warm-up as a way around an existing block.

## Verification
Verify stable acceptance, low hard-bounce/complaint rates, controlled deferrals, representative provider distribution, and sustained target volume without reputation regression.

## Expected output
A measured ramp schedule with gates, rollback criteria, and evidence log.

## Stop conditions
Stop or roll back when complaint/bounce thresholds breach, provider blocking appears, telemetry is incomplete, or recipient quality cannot be established.