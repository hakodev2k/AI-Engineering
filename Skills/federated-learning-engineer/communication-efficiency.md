# Communication Efficiency

## Purpose
Reduce network cost and round latency without materially degrading model quality or violating privacy/security assumptions.

## When to use
Use when bandwidth, mobile data usage, WAN latency, or server ingress becomes a bottleneck.

## Inputs
Model/update sizes, client bandwidth distributions, round cadence, compression options, quality targets, privacy mechanism, and network-cost metrics.

## Context to inspect
Inspect upload versus download cost, sparse versus dense updates, compression error, retransmission, secure-aggregation compatibility, and whether local computation can replace communication.

## Core knowledge
Communication can be reduced through fewer rounds, more local work, quantization, sparsification, structured updates, partial parameter training, or model compression. Each changes optimization behavior and may interact with privacy or cryptography.

## Procedure
1. Measure bytes and wall time per training round by client cohort.
2. Separate model download, update upload, and protocol overhead.
3. Establish quality-per-byte and quality-per-minute baselines.
4. Tune local steps before introducing complex compression.
5. Evaluate quantization or sparsification with error feedback where appropriate.
6. Test compressed aggregation under secure-aggregation constraints.
7. Measure CPU/memory overhead of encoding and decoding.
8. Test poor-network and interrupted-transfer scenarios.
9. Compare final quality, convergence speed, and total transferred bytes.
10. Define adaptive policies only if static policies are insufficient.

## Decision points
Prefer simple local-computation trade-offs when clients have spare compute. Use compression when network dominates. Avoid aggressive sparsity when update structure leaks information or protocol compatibility is unclear.

## Common failure patterns
- Optimizing update size while model downloads dominate.
- Ignoring compression CPU cost.
- Comparing equal rounds instead of equal bytes.
- Breaking secure aggregation.
- Compression destabilizes small or minority-client updates.

## Verification
Verify end-to-end byte reduction, latency improvement, convergence, and client resource impact under representative networks.

## Expected output
A communication budget and tested optimization strategy with quality/cost trade-offs and rollout thresholds.

## Stop conditions
Stop if network telemetry is unavailable or proposed compression violates privacy/security protocol assumptions.