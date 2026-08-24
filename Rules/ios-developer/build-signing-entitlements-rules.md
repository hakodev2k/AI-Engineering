# Build, Signing, and Entitlements Rules

## Purpose
Protect release integrity, reproducibility, code-signing trust, and least-privilege platform capabilities.

## Scope
Xcode build settings, schemes, configurations, signing, provisioning, entitlements, bundle identifiers, and CI builds.

## MUST
- Release builds MUST be reproducible from version-controlled configuration plus authorized secret/signing material.
- Production signing credentials MUST be access-controlled and kept out of source control.
- Entitlements MUST be limited to capabilities the shipped product actually requires.
- Debug and production configurations MUST clearly separate endpoints, diagnostics, and security-sensitive behavior.
- Changes to signing, entitlements, or production build settings MUST receive explicit review.

## MUST NOT
- MUST NOT commit private keys, provisioning secrets, or credentials.
- MUST NOT ship debug-only bypasses, test endpoints, or verbose sensitive diagnostics in production.
- MUST NOT broaden entitlements merely to resolve a build issue without understanding the capability.

## SHOULD
- Automate signing and archive verification through controlled CI where feasible.
- Keep configuration differences minimal and auditable.

## Exceptions
Manual signing or exceptional entitlements require documented operational need, owner, and approval.

## Verification
Inspect archived app entitlements and build settings, run secret scans, validate code signing, compare configuration diffs, and install/test the actual release artifact.