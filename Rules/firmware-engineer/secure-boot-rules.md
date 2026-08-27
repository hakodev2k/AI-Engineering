# Secure Boot

## Purpose
Establish a trustworthy firmware execution chain.

## Scope
ROM roots, bootloaders, image authentication, keys, fuses, and debug state.

## MUST
- Each mutable executable stage in the trusted boot chain MUST be authenticated before execution.
- Root-of-trust material MUST be provisioned and protected according to the device threat model.
- Verification failure MUST fail closed into an approved recovery state.
- Anti-rollback controls MUST be used when vulnerable downgrades create material risk.
- Key revocation and replacement strategy MUST be defined before production provisioning where feasible.

## MUST NOT
- Production secure-boot verification MUST NOT accept unsigned development images.
- Authentication failures MUST NOT be converted into warnings that continue normal boot.

## SHOULD
- Trust-chain state SHOULD be auditable through non-secret diagnostics.

## Exceptions
Any weakening of production boot trust requires explicit security approval.

## Verification
Test modified images, wrong keys, revoked versions, recovery images, provisioning configuration, and production fuse/security state.