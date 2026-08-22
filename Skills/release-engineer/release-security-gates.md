# Release Security Gates

## Purpose
Integrate security evidence into release decisions without turning pipelines into indiscriminate blocking systems.

## When to use
Use when adding vulnerability, secret, license, policy, signing, or configuration checks to release workflows.

## Inputs
Threat model, dependency inventory, scan outputs, severity policy, exploitability context, exception process, provenance, and environment criticality.

## Preconditions
Security findings have ownership and a defined triage/escalation process.

## Context to inspect
Inspect SAST/SCA/container/IaC scans, secret detection, SBOM, signatures, policy-as-code, historical false positives, and bypass permissions.

## Core knowledge
A gate is effective when it blocks risks that matter and provides actionable evidence. Raw severity alone may be insufficient; reachability, exposure, fix availability, compensating controls, and asset criticality influence release risk.

## Procedure
1. Identify security properties that must hold before release.
2. Map each property to reliable automated evidence.
3. Define blocking thresholds by release/environment risk.
4. Separate new findings from accepted baseline debt.
5. Require provenance/signature verification where applicable.
6. Define time-bounded exception workflow with owner and rationale.
7. Restrict bypass permissions and audit their use.
8. Make findings actionable with artifact/component context.
9. Test gate failure and exception expiration.
10. Tune policy using incident and false-positive evidence.

## Decision points
Block immediately for credible critical exposure or secret compromise; allow time-bounded exceptions when compensating controls make residual risk acceptable. Prefer prevention at build time but enforce critical trust policy at promotion/deploy too.

## Common failure patterns
Blocking on every scanner warning, permanent waivers, security gates that can be skipped by alternate deploy paths, stale vulnerability databases, and scans detached from the exact released artifact.

## Verification
Introduce safe test violations and confirm gates fail, bypasses are logged and expire, and production artifacts can prove required security evidence.

## Expected output
Risk-based release security policy with automated enforcement and governed exceptions.

## Stop conditions
Stop release when a mandatory trust check fails, a critical exposed vulnerability lacks accepted mitigation, credentials are suspected compromised, or bypass authority is unavailable.