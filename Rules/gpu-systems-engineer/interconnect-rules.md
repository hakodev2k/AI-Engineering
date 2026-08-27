# GPU Interconnect Rules

## Purpose
Manage host-device and device-device transport as first-class system constraints.

## Scope
PCIe-class links, high-speed GPU fabrics, DMA, peer transfers, and topology-sensitive communication.

## MUST
- Interconnect bandwidth and latency MUST be measured for performance-critical transfer paths.
- Transfer volume, direction, frequency, and synchronization cost MUST be included in design reviews.
- Topology-dependent behavior MUST be detected rather than assumed.
- Communication paths MUST have defined fallback behavior when preferred peer connectivity is unavailable.

## MUST NOT
- MUST NOT optimize compute while ignoring a demonstrated transport bottleneck.
- MUST NOT assume nominal link bandwidth equals sustained application bandwidth.
- MUST NOT introduce unnecessary host staging when direct transfer is supported and validated.

## SHOULD
- Batch or overlap transfers when this reduces end-to-end cost without increasing unacceptable latency.
- Keep data resident near the consumer when lifecycle and capacity allow.

## Exceptions
Additional copies may be justified for isolation, compatibility, or correctness; document measured cost and reason.

## Verification
Inspect topology, transfer traces, bandwidth tests, synchronization timelines, and end-to-end profiles.