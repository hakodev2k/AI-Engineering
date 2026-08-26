# WebRTC Architecture

## Purpose
Design and review production WebRTC systems across signaling, ICE connectivity, DTLS-SRTP media security, RTP/RTCP transport, and browser/native client boundaries.

## When to use
Use for new RTC products, topology changes, interoperability reviews, or recurring call-setup and media failures. Do not assume peer-to-peer is appropriate merely because WebRTC supports it.

## Inputs
Product requirements, participant counts, latency and quality targets, client platforms, network constraints, compliance requirements, existing diagrams, telemetry, and expected traffic.

## Preconditions
Identify trust boundaries, supported browsers/SDKs, media types, regional constraints, and required availability before selecting components.

## Context to inspect
Inspect signaling ownership, STUN/TURN, ICE policy, SFU/MCU/media servers, codec negotiation, session lifecycle, authentication, observability, deployment topology, and failure history.

## Core knowledge
WebRTC separates signaling from standardized media transport. ICE discovers viable paths; STUN assists discovery; TURN relays when direct paths fail. DTLS establishes keying for SRTP. RTP carries media while RTCP provides control and feedback. NAT behavior, enterprise firewalls, UDP blocking, topology, codec capabilities, and congestion control materially affect reliability.

## Procedure
1. Translate user journeys into session and media flows.
2. Map signaling and media paths separately.
3. Define client capability negotiation and compatibility policy.
4. Select P2P, SFU, MCU, or hybrid topology from participant scale and product requirements.
5. Define ICE, STUN, TURN, UDP/TCP/TLS fallback behavior.
6. Define authentication and authorization at signaling and media boundaries.
7. Establish codec, simulcast/SVC, bitrate, and bandwidth policies.
8. Model regional placement, failover, capacity, and dependency failures.
9. Define telemetry for setup, transport, media quality, and teardown.
10. Validate with representative networks and degraded conditions.

## Decision points
Prefer P2P for small trusted sessions when direct connectivity and privacy fit. Prefer SFU for multiparty interactive media and selective forwarding. MCU can simplify clients or compose streams but increases compute and latency. TURN reliability often matters more than minimizing relay cost.

## Common failure patterns
Coupling signaling assumptions to media transport; insufficient TURN coverage; missing TCP/TLS fallback; unsupported codec combinations; unbounded participant fan-out; weak session authorization; no regional failure model; testing only on clean networks.

## Verification
Verify call setup across representative NAT/firewall environments, negotiated codecs, encrypted media, fallback paths, topology capacity, failure recovery, and end-to-end RTC metrics. Implementation is not verified until observed behavior matches defined SLOs.

## Expected output
An evidence-backed RTC architecture, explicit trade-offs, compatibility policy, operational signals, and validation results.

## Stop conditions
Escalate when regulatory requirements, cryptographic policy, production capacity, or destructive topology migration requires authority beyond the task.