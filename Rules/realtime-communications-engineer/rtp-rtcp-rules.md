# RTP and RTCP Rules

## Purpose
Preserve media transport correctness and diagnostic fidelity.

## Scope
RTP sequencing/timestamps, SSRCs, RTCP feedback, retransmission, extensions, and stream identity.

## MUST
- RTP sequence, timestamp, and clock-rate handling MUST follow negotiated codec semantics.
- SSRC and stream-identity changes MUST be handled without corrupting session state.
- Negotiated header extensions and RTCP feedback MUST be parsed defensively.
- Retransmission and feedback behavior MUST be bounded against amplification.

## MUST NOT
- MUST NOT trust malformed packet lengths or extension values.
- MUST NOT reuse stream identifiers in ways that make active streams ambiguous.
- MUST NOT drop critical RTCP diagnostics without an explicit reason.

## SHOULD
- Packet-processing paths SHOULD minimize allocations and copying when profiling shows material benefit.

## Exceptions
Protocol deviations require interoperability evidence and narrow peer-specific containment.

## Verification
Use packet captures, fuzzing, protocol tests, malformed-packet suites, and live RTP/RTCP statistics.