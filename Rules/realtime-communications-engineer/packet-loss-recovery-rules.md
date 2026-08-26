# Packet Loss Recovery Rules

## Purpose
Recover useful media without creating excess latency or bandwidth amplification.

## Scope
NACK, RTX, FEC, keyframe requests, concealment, jitter, and recovery policy.

## MUST
- Recovery mechanisms MUST be selected according to media type, RTT, loss pattern, and latency budget.
- Retransmission attempts MUST be bounded by packet usefulness and timing.
- Keyframe request behavior MUST be rate-limited to prevent storms.
- Recovery overhead MUST be included in bandwidth and capacity analysis.

## MUST NOT
- MUST NOT retransmit media that will arrive too late to render.
- MUST NOT enable redundant recovery mechanisms without measuring combined overhead.
- MUST NOT treat random and burst loss as equivalent.

## SHOULD
- Audio recovery SHOULD prioritize continuity and intelligibility under tight latency constraints.

## Exceptions
Aggressive redundancy requires measured benefit under representative impairment.

## Verification
Use packet-loss emulation, captures, recovery counters, quality metrics, bandwidth measurements, and keyframe-rate monitoring.