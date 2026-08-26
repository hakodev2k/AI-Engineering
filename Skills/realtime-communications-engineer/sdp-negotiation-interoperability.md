# SDP Negotiation and Interoperability

## Purpose
Manage offer/answer negotiation safely across heterogeneous WebRTC clients and media infrastructure.

## When to use
Use for negotiation failures, codec incompatibility, transceiver changes, SIP/WebRTC interop, or browser-version regressions.

## Inputs
Offers/answers, client capabilities, transceiver state, codec policy, ICE/DTLS parameters, and failing traces.

## Core knowledge
SDP describes negotiated media sections, directions, MIDs, payload types, codecs, ICE credentials, DTLS fingerprints, BUNDLE, header extensions, and stream identifiers. Correctness depends on stateful offer/answer sequencing and capability intersection.

## Procedure
1. Capture the complete negotiation timeline.
2. Compare media sections, directions, MIDs, payload types, codecs, and extensions.
3. Verify ICE and DTLS parameters are internally consistent.
4. Inspect transceiver lifecycle and renegotiation triggers.
5. Detect glare and stale offer/answer application.
6. Compare working and failing client cohorts.
7. Minimize SDP munging; prefer supported APIs and explicit codec preferences.
8. Add mixed-version and cross-platform tests.
9. Validate media actually flows after nominal negotiation success.

## Decision points
Use capability negotiation rather than hard-coded SDP assumptions. SDP munging may be unavoidable in legacy interop but should be isolated, tested, and treated as compatibility debt.

## Common failure patterns
Payload-type mismatch; duplicate/stale offers; incorrect media direction; unsupported profile; brittle string manipulation; assuming `setRemoteDescription` success proves interoperability.

## Verification
Verify state transitions, negotiated parameters, encrypted media flow, renegotiation, and mixed-client regression tests.

## Expected output
A bounded negotiation diagnosis or compatible SDP policy with trace evidence.

## Stop conditions
Stop when the remote implementation violates required standards in a way that cannot be safely worked around or when interoperability requirements are undefined.