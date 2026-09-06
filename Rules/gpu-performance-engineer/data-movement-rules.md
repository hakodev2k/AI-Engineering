# Data Movement Rules

## Purpose
Minimize unnecessary transfers and synchronization between host, device, and peer accelerators.

## Scope
Host-device copies, peer copies, staging buffers, pinned memory, prefetching, and transfer overlap.

## MUST
- Transfer volume and frequency MUST be measured for critical paths.
- Host-device copies MUST be minimized or overlapped when they materially affect latency or throughput.
- Transfer lifetimes and ownership MUST be explicit under asynchronous execution.
- Peer-to-peer paths MUST be validated on deployed topology.

## MUST NOT
- MUST NOT introduce implicit synchronization through avoidable copies.
- MUST NOT assume peer access or direct memory paths exist on every supported topology.
- MUST NOT reuse asynchronous transfer buffers before completion is guaranteed.

## SHOULD
- SHOULD batch small transfers when latency permits.
- SHOULD pin host memory only when benefit exceeds allocation and pressure costs.

## Exceptions
Exceptions require measured evidence and documented topology assumptions.

## Verification
Inspect traces, transfer counters, topology checks, synchronization tests, and end-to-end benchmarks.