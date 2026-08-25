# Security Testing Release Gate

## Purpose
Define evidence-based firmware security release criteria so critical protections are verified on production-equivalent artifacts and hardware before shipment.

## When to use
Use for release process design, major firmware releases, security-sensitive changes, or recovery after gaps in release assurance.

## Inputs
Threat model, security requirements, release binary, hardware revisions, test suites, static/fuzz results, SBOM, signing provenance, known risks, and update/recovery plan.

## Preconditions
Gate the actual release candidate, not an earlier debug build. Define who may accept residual risk and what evidence is mandatory.

## Context to inspect
Secure boot/update, rollback, debug state, keys, storage, exposed parsers, privilege isolation, dependencies, logging, manufacturing settings, recovery, and prior vulnerabilities.

## Core knowledge
A release gate should verify security invariants and high-risk changes, not demand meaningless zero findings. Evidence must distinguish tests run from tests passed and accepted risk. Hardware configuration is part of the firmware security release.

## Procedure
1. Identify security requirements and changed attack surfaces for the release.
2. Confirm source revision, toolchain, artifact hash, SBOM, and signing provenance.
3. Run release build warnings/static analysis and review deltas.
4. Execute unit/integration negative security tests.
5. Run fuzz regressions and high-risk parser campaigns as required.
6. Verify secure boot, update, anti-rollback, recovery, and key rotation paths.
7. Validate production debug/lifecycle configuration on representative hardware revisions.
8. Test power-loss/reset behavior for persistent security transitions.
9. Review dependency vulnerabilities for applicability and disposition.
10. Re-test previously fixed high-severity vulnerabilities.
11. Record unresolved findings with owner, compensating controls, and explicit acceptance.
12. Approve signing/release only after mandatory evidence is complete.

## Decision points
Risk-based waivers may be appropriate for nonexploitable findings with evidence; never convert schedule pressure into silent acceptance. Full regression depth should increase for boot, crypto, update, privilege, and parser changes.

## Common failure patterns
Testing unsigned debug builds; checking source but not programmed fuse/debug state; security tests optional in CI; waivers without owner/expiry; vulnerability scan treated as complete assurance; release artifact changed after testing.

## Verification
Independently verify artifact hashes, test records, hardware configuration, signing provenance, waiver approvals, and that the distributed image is byte-identical to the approved signed artifact.

## Expected output
Release security evidence package, pass/fail gate decision, accepted-risk record, signed artifact identity, and regression traceability.

## Stop conditions
Block release when mandatory evidence is missing, critical trust controls fail, artifact provenance is ambiguous, production configuration differs from tested state, or residual critical risk lacks authorized acceptance.