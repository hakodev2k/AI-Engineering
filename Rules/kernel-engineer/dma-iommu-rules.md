# DMA and IOMMU Rules

## Purpose
Protect memory integrity when devices perform direct memory access.

## Scope
DMA mappings, scatter/gather I/O, IOMMU domains, bounce buffers, coherency, and device isolation.

## MUST
- DMA buffers MUST be mapped through the platform-supported DMA abstraction unless a documented architecture contract requires otherwise.
- Mapping direction, size, lifetime, and ownership MUST match actual device access.
- IOMMU permissions MUST follow least privilege and expose only memory required for the operation.
- Unmapping MUST occur only after device access has ceased and completion ordering is established.
- Device-provided DMA descriptors, lengths, and indices MUST be validated before use.

## MUST NOT
- MUST NOT expose arbitrary kernel memory to a device for convenience.
- MUST NOT reuse or free DMA-backed memory while hardware may still access it.
- MUST NOT assume physical and DMA addresses are interchangeable.
- MUST NOT disable IOMMU isolation merely to work around a driver defect without explicit approval.

## SHOULD
- Use narrow mapping windows and bounded queue ownership.
- Security-sensitive devices SHOULD be isolated into appropriately constrained domains.
- DMA performance changes SHOULD be benchmarked with correctness diagnostics enabled where practical.

## Exceptions
Exceptions require platform evidence, threat analysis, blast radius, alternative assessment, and explicit maintainer/security approval.

## Verification
Inspect mapping APIs and IOMMU configuration; test teardown, reset, timeout, malformed descriptors, high I/O load, and memory-debug configurations.