# SFU and MCU Topology Rules

## Purpose
Choose and operate media topologies using explicit scalability and quality trade-offs.

## Scope
Peer-to-peer, SFU, MCU, cascades, routing, mixing, forwarding, and regional placement.

## MUST
- Topology selection MUST document participant scale, bandwidth, compute, latency, privacy, and failure-domain trade-offs.
- Media servers MUST enforce session and stream authorization.
- Capacity limits MUST have overload behavior that protects existing sessions.
- Multi-region routing MUST define failure and failover semantics.

## MUST NOT
- MUST NOT adopt MCU transcoding without measuring compute and quality cost.
- MUST NOT assume peer-to-peer scales beyond validated participant/network bounds.
- MUST NOT create hidden single points of failure in media routing.

## SHOULD
- Prefer the simplest topology that meets measured requirements.

## Exceptions
Special topology choices require benchmark evidence and operational review.

## Verification
Review architecture decisions, load tests, failover drills, media-server metrics, and authorization tests.