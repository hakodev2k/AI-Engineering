# Secure Boot Rules

## Purpose
Protect execution integrity from immutable or hardware-rooted trust through every security-relevant boot stage.

## Scope
Applies to ROM code, first-stage loaders, bootloaders, firmware images, recovery images, option modules, and boot-time configuration.

## MUST
- Authenticate every mutable executable stage before transferring control to it.
- Anchor trust in a key, digest, or hardware mechanism whose modification requires an explicitly authorized process.
- Define verification failure behavior that prevents unauthorized code execution and preserves recoverability.
- Bind accepted images to the intended product, signing policy, and security version where applicable.

## MUST NOT
- Provide an undocumented bypass, fallback, or debug path that skips signature or integrity verification.
- Continue normal boot after authentication failure merely to preserve availability.
- Trust mutable metadata that can redirect verification without independently authenticating that metadata.

## SHOULD
- Minimize code executing before authentication.
- Measure or record boot-stage identity when platform capabilities support reliable attestation or forensic diagnosis.

## Exceptions
Any reduced boot verification requires documented threat analysis, compensating controls, bounded deployment scope, expiration or remediation plan, and security approval.

## Verification
Inspect the complete boot chain, validate keys and verification policy, tamper images and metadata, exercise failure and recovery paths, and confirm unauthorized code cannot gain execution.