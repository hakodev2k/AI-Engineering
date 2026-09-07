# SMTP Protocol and Delivery Path

## Purpose
Diagnose and design the SMTP delivery path from sender to recipient MX using protocol evidence instead of provider-dashboard assumptions.

## When to use
Use for deferrals, unexplained bounces, TLS negotiation issues, recipient-domain failures, or MTA/provider integration review.

## Inputs
Message IDs, SMTP transcripts or provider events, timestamps, sending IP/HELO, recipient domain, MX/DNS data, retry history, and relevant headers.

## Preconditions
Use test recipients or authorized production evidence. Preserve timestamps and exact enhanced status codes.

## Context to inspect
Inspect DNS resolution, connection establishment, EHLO capabilities, STARTTLS, MAIL FROM, RCPT TO, DATA acceptance, response codes, retry scheduling, and final DSN generation.

## Core knowledge
SMTP success is hop-specific. 4xx responses are normally transient; 5xx normally permanent, but mailbox providers sometimes use provider-specific semantics. Enhanced status codes add meaning beyond the three-digit code. Queue age and retry behavior can turn temporary throttling into user-visible failure.

## Procedure
1. Build a timestamped delivery timeline.
2. Resolve recipient MX records and identify the responding provider.
3. Confirm source IP, PTR, HELO/EHLO, envelope sender, and TLS behavior.
4. Capture the exact response at each SMTP stage.
5. Separate connection, recipient validation, content acceptance, throttling, policy, and mailbox errors.
6. Compare retries with provider guidance and queue lifetime.
7. Correlate the failure with sending rate, reputation, authentication, and concurrent provider incidents.
8. Reproduce with a controlled test only when it will not worsen reputation.
9. Fix the narrowest proven cause rather than changing multiple variables.
10. Verify subsequent deliveries and watch for recurrence across recipient cohorts.

## Decision points
- Retry 4xx failures with bounded exponential scheduling unless provider guidance indicates a different cadence.
- Do not retry hard recipient failures indefinitely.
- Escalate provider-specific opaque policy blocks when protocol evidence cannot identify a controllable cause.

## Common failure patterns
Ignoring enhanced status codes; treating every 4xx as infrastructure outage; repeatedly probing a throttled provider; losing original SMTP responses during event normalization; assuming TLS success proves message acceptance.

## Verification
Confirm the complete SMTP timeline, exact response classification, bounded retry behavior, final disposition, and successful controlled delivery after remediation.

## Expected output
A protocol-grounded diagnosis with affected stage, evidence, remediation, and verification results.

## Stop conditions
Stop when required SMTP evidence is unavailable, testing would create abusive traffic, or remediation requires DNS/MTA changes outside authorized scope.