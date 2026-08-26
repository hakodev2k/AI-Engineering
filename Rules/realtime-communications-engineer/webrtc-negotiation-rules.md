# WebRTC Negotiation Rules

## Purpose
Ensure deterministic, recoverable media negotiation.

## Scope
SDP offer/answer, transceivers, codecs, directions, renegotiation, and glare.

## MUST
- Negotiation MUST follow a defined state machine and handle simultaneous offers safely.
- Codec and media-direction decisions MUST reflect actual endpoint capability.
- Renegotiation MUST preserve active media unless an intentional change requires interruption.
- Unsupported SDP or capability combinations MUST fail observably.

## MUST NOT
- MUST NOT rewrite SDP heuristically without interoperability tests.
- MUST NOT depend on browser-specific behavior as an undocumented contract.
- MUST NOT trigger unbounded renegotiation loops.

## SHOULD
- Prefer standards-based transceiver APIs and explicit capability negotiation.

## Exceptions
Nonstandard interop workarounds require affected-client evidence, bounded scope, and removal criteria.

## Verification
Run cross-browser/device negotiation matrices, glare tests, SDP inspection, and regression tests.