# Email Header and Message Trace Analysis

## Purpose
Reconstruct how a message moved through mail systems using raw headers and correlated provider events, enabling evidence-based diagnosis of authentication, routing, delay, and mutation issues.

## When to use
Use for delayed mail, spoofing questions, inconsistent authentication, unexpected routing, duplicate delivery, or disputes about which system handled a message.

## Inputs
Complete raw message source, provider message IDs, SMTP/event logs, timestamps, DNS state, and known sending topology.

## Preconditions
Preserve raw headers exactly and handle recipient/address data according to privacy rules.

## Context to inspect
Inspect Received headers bottom-up, Message-ID, Return-Path, Authentication-Results, DKIM signatures, ARC where present, Date, MIME headers, provider trace IDs, and timezone normalization.

## Core knowledge
Received headers are prepended by each hop and vary in trustworthiness; trace from known trusted infrastructure outward. Authentication-Results is meaningful in the context of the system that generated it. Clock skew and queueing can distort naive latency calculations.

## Procedure
1. Preserve the original raw message.
2. Normalize timestamps to a common timezone without modifying evidence.
3. Identify trusted receiving and sending boundaries.
4. Walk Received headers from earliest trusted hop to latest.
5. Correlate provider IDs and application IDs with event logs.
6. Check envelope/visible identities and authentication results.
7. Determine where DKIM or body/header mutation occurred.
8. Calculate per-hop delays and identify abnormal queue time.
9. Compare with a known-good message from the same path.
10. Document conclusions separately from uncertain inferences.

## Decision points
Treat untrusted client-supplied headers as claims, not proof. Use provider trace tooling when internal header evidence ends at a managed boundary.

## Common failure patterns
Reading Received headers top-down as chronological origin, trusting forged headers, losing timezones, overlooking forwarded hops, and treating Message-ID as globally authoritative routing evidence.

## Verification
Reconcile header chronology with provider/application events, authentication results, and known infrastructure. Confirm all asserted hops have supporting evidence.

## Expected output
A timestamped message trace identifying routing, authentication, mutation, and delay findings with confidence levels.

## Stop conditions
Stop attribution when the trace crosses an untrusted or unavailable boundary lacking corroborating evidence; escalate rather than inventing missing hops.