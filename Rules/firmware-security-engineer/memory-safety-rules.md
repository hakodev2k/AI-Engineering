# Memory Safety Rules

## Purpose
Reduce exploitable memory corruption and unsafe resource handling in privileged firmware.

## Scope
Applies to buffers, pointers, allocators, stacks, heaps, DMA-visible memory, parsers, drivers, and unsafe language boundaries.

## MUST
- Validate lengths, offsets, indices, alignment, integer conversions, and ownership before memory access.
- Bound all copies and parsing operations using trusted destination capacity rather than untrusted source claims.
- Treat memory corruption in privileged or pre-boot code as a security defect requiring root-cause analysis.
- Apply available compiler and platform hardening that is compatible with correctness and resource constraints.

## MUST NOT
- Trust packet, image, metadata, or peripheral-provided lengths without independent bounds checks.
- Suppress sanitizer, static-analysis, or compiler findings without documented evidence that the finding is non-exploitable or invalid.
- Reuse freed or expired storage intentionally to save memory without a reviewed ownership model.

## SHOULD
- Prefer memory-safe abstractions or languages for new components where platform constraints permit.
- Keep unsafe code small, isolated, and heavily tested.

## Exceptions
Unsafe patterns require documented necessity, bounded scope, review, and targeted verification.

## Verification
Use compiler diagnostics, static analysis, sanitizers or instrumentation where feasible, fuzzing, boundary tests, and manual review of privileged unsafe paths.