# Hardware Trust Boundary Rules

## Purpose
Ensure firmware treats peripherals, buses, co-processors, memory regions, and security hardware according to their actual trust guarantees.

## Scope
Applies to MMIO, DMA, secure elements, trusted execution features, external flash, co-processors, sensors, and hardware isolation controls.

## MUST
- Document which hardware components can read, write, execute, or influence security-sensitive firmware state.
- Configure memory protection, privilege, DMA, and bus access controls before exposing protected assets when platform capabilities allow.
- Validate data received from lower-trust peripherals or co-processors before using it for privileged decisions.
- Treat hardware errata affecting security boundaries as release-relevant risk.

## MUST NOT
- Assume a peripheral is trustworthy merely because it is physically integrated.
- Grant unrestricted DMA or privileged memory access without a documented necessity and threat analysis.
- Depend on hardware security features without verifying their configuration and lifecycle state.

## SHOULD
- Minimize cross-boundary interfaces and privilege.
- Prefer immutable or independently protected roots of trust for foundational security decisions.

## Exceptions
Boundary relaxations require documented need, affected assets, compensating controls, verification, and security approval.

## Verification
Review hardware architecture and register configuration, inspect memory and DMA protections, test unauthorized accesses, and validate relevant errata mitigations on target hardware.