# RTP and RTCP Media Transport

## Purpose
Diagnose and design RTP/RTCP behavior so realtime media remains correct, measurable, and interoperable.

## When to use
Use for packet-loss, jitter, sequence, timestamp, SSRC, feedback, retransmission, or interoperability issues.

## Inputs
Packet captures, RTC stats, SDP, codec details, RTP header-extension configuration, and sender/receiver logs.

## Core knowledge
RTP timestamps represent media clocks, not wall-clock time. Sequence numbers support loss/reordering detection. SSRCs identify synchronization sources. RTCP communicates reception quality and timing; feedback drives mechanisms such as NACK, PLI/FIR, transport-wide congestion control, and sender adaptation. RTX, FEC, header extensions, and payload mappings must agree end to end.

## Procedure
1. Establish the affected stream and direction.
2. Correlate SSRC, payload type, MID/RID, codec, and negotiated extensions.
3. Analyze sequence gaps, reordering, jitter, timestamps, and packet rate.
4. Inspect RTCP receiver/sender reports and feedback.
5. Determine whether loss is network, sender, relay, or receiver induced.
6. Verify RTX/FEC and keyframe recovery behavior where enabled.
7. Correlate packet evidence with application RTC metrics.
8. Reproduce under controlled impairment.
9. Validate the smallest corrective change.

## Decision points
Use retransmission when RTT permits recovery; use FEC when recovery latency is too costly and overhead is justified. Prefer transport feedback for bandwidth estimation when supported consistently. Packet capture is powerful but must respect privacy and access controls.

## Common failure patterns
Confusing RTP timestamp with elapsed milliseconds; mismatched payload types; SSRC rewriting bugs; missing RTCP feedback; ineffective retransmission at high RTT; packet capture without clock correlation.

## Verification
Confirm negotiated mappings, monotonic media timing, expected feedback, recovery behavior, and improved loss/jitter/freeze metrics under repeatable tests.

## Expected output
A packet-level diagnosis or validated transport configuration tied to user-visible quality.

## Stop conditions
Stop when encrypted payload inspection would violate policy, capture authorization is unavailable, or evidence indicates a third-party transport defect requiring escalation.