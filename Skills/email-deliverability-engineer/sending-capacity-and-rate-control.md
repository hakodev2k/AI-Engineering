# Sending Capacity and Rate Control

## Purpose
Control outbound concurrency and throughput so queues meet business latency goals without triggering mailbox-provider throttling or allowing bulk traffic to starve critical mail.

## When to use
Use for high-volume systems, recurring 4xx deferrals, campaign peaks, provider migrations, or queue-latency incidents.

## Inputs
Volume forecasts, queue depth/age, provider response codes, recipient-provider distribution, IP pools, connection limits, criticality classes, and historical throughput.

## Preconditions
Metrics must distinguish source queues, traffic classes, mailbox providers, and sending identities.

## Context to inspect
Inspect connection concurrency, messages per connection, provider throttles, retry schedules, IP/domain reputation, burst patterns, queue TTL, and provider/API quotas.

## Core knowledge
Maximum provider API throughput is not the same as safe mailbox-provider throughput. 4xx policy deferrals are feedback signals. Retries consume capacity and can amplify overload. Priority queues need starvation safeguards and explicit budgets.

## Procedure
1. Forecast steady and peak volume by message class and mailbox provider.
2. Measure current queue latency and SMTP/provider responses under load.
3. Set per-provider and per-identity concurrency/rate ceilings.
4. Reserve capacity for critical transactional streams.
5. Implement bounded backoff with jitter for transient deferrals.
6. Prevent synchronized retry waves and unlimited queue growth.
7. Adapt rates downward on sustained throttling and upward only after stable evidence.
8. Define queue-age alerts and terminal expiry policy.
9. Load-test internal queueing without generating abusive external traffic.
10. Review capacity before known seasonal events.

## Decision points
Scale out only when reputation and provider limits, not internal compute, justify it. Prefer smoothing bursts over adding IPs. Shed or delay discretionary bulk work before critical messages breach latency SLOs.

## Common failure patterns
Unbounded retries, global rate limits masking provider-local issues, full-speed recovery after throttling, too many cold IPs, no queue TTL, and priority inversion.

## Verification
Demonstrate stable queue age, bounded retries, provider-specific throttle response, protected critical latency, and no reputation regression at target load.

## Expected output
A capacity model, rate-control policy, retry configuration, and tested overload behavior.

## Stop conditions
Stop rate increases when provider throttling, complaint/bounce deterioration, or reputation decline indicates external trust—not internal capacity—is the bottleneck.