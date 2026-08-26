# Compression and Content Optimization Rules

## Purpose
Reduce transfer cost and latency without changing content correctness or client compatibility.

## Scope
Applies to gzip/Brotli, content negotiation, minification, image optimization, and representation variants.

## MUST
- Optimization MUST preserve response semantics and content integrity.
- Content-Encoding negotiation MUST respect client capabilities and cache variation.
- Transformations of signed, hashed, or byte-sensitive payloads MUST be explicitly evaluated.
- Performance claims MUST use measured transfer size, latency, CPU, or user-experience evidence.

## MUST NOT
- MUST NOT compress already compressed formats without evidence of benefit.
- MUST NOT transform content when byte identity is contractually required.
- MUST NOT create variant-cache collisions across encodings or formats.

## SHOULD
- Prefer Brotli or equivalent efficient encoding for supported text assets when measured beneficial.
- Balance origin/edge CPU cost against bandwidth savings.
- Use modern image formats with negotiated fallback when appropriate.

## Exceptions
Optimization may be disabled for compatibility, CPU, security, or byte-integrity reasons when the rationale and evidence are documented.

## Verification
Compare byte-for-byte semantics where applicable; test Accept-Encoding and format variants; measure payload size, CPU, cache hit ratio, latency, and client compatibility.