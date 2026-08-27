# Content Compression

## Purpose
Reduce transfer size with safe, content-aware compression while controlling CPU cost and cache variation.

## When to use
Use for text delivery optimization, bandwidth reduction, or compression regressions.

## Inputs
Content types, object sizes, Accept-Encoding distribution, CPU budget, bandwidth cost, current Brotli/gzip settings.

## Context to inspect
Origin compression, CDN recompression, Vary headers, cache keys, precompressed assets, dynamic content behavior.

## Core knowledge
Brotli often compresses text better than gzip but can cost more CPU at high levels. Binary formats may already be compressed. Encoding negotiation must preserve representation correctness.

## Procedure
1. Inventory compressible MIME types and size distributions.
2. Exclude already-compressed and tiny payloads where overhead dominates.
3. Prefer precompression for immutable static assets when practical.
4. Configure Brotli/gzip negotiation with correct fallback.
5. Ensure cache handling distinguishes encodings safely.
6. Benchmark compression ratio, CPU, and latency.
7. Verify Content-Length/transfer behavior and intermediaries.
8. Monitor bandwidth and edge CPU after rollout.

## Decision points
Use dynamic compression for frequently changing text; precompress stable assets. Choose compression level from latency/CPU trade-offs rather than maximum ratio.

## Common failure patterns
Compressing images twice, missing `Vary: Accept-Encoding`, CPU spikes, compressing secrets in contexts vulnerable to compression side channels, and inconsistent origin/edge behavior.

## Verification
Compare bytes transferred, response latency, CPU, encoding negotiation, and decompression correctness across clients.

## Expected output
A compression policy with eligible types, levels, negotiation behavior, benchmarks, and monitoring.

## Stop conditions
Escalate if compression interacts with sensitive reflected secrets or causes material edge/origin resource pressure.