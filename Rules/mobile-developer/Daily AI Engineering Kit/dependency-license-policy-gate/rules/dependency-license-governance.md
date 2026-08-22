# Dependency License Governance

## MUST
- Every added/upgraded/re-sourced dependency MUST have exact ecosystem, package, version, source identity, license expression, provenance confidence, and evidence reference.
- License evidence MUST correspond to the exact candidate version/source or an explicitly documented applicable range.
- Unknown or conflicting license evidence MUST remain `unknown` or `partial` until resolved.
- Policy evaluation MUST bind to the inventory fingerprint and policy version.
- Prohibited, restricted, unknown, or exception-based findings MUST receive independent review.
- Exceptions MUST be explicit, package/version/source scoped, policy-version scoped, approver-attributed, and time-bounded.
- A changed dependency set after review MUST invalidate the previous review/gate evidence.
- Final merge/release recommendations MUST distinguish `executed` checks from `verified` policy compliance.
- Large dependency upgrades, vendored-code introduction, or changes that alter redistribution obligations MUST stop for explicit human approval even when automated policy classification succeeds.

## MUST NOT
- MUST NOT infer license from package popularity, organization, neighboring versions, or similar package names.
- MUST NOT treat missing license metadata as permissive.
- MUST NOT silently choose one side of an `OR`/dual-license expression.
- MUST NOT replace an upstream license expression with a friendlier identifier without exact evidence.
- MUST NOT allow a prohibited license through a generic exception when policy forbids exceptions for that category.
- MUST NOT reuse an exception for another version, package source, artifact digest, or expired period.
- MUST NOT modify lockfiles or install packages solely to make the license scan pass.
- MUST NOT expose registry credentials, private package tokens, license-server secrets, or raw proprietary source in generated evidence.
- MUST NOT weaken policy or remove a prohibited license entry without explicit human approval.

## SHOULD
- Prefer SPDX identifiers/expressions while preserving the raw observed license value.
- Prefer artifact/tag/commit-bound evidence over unversioned project-homepage evidence.
- Keep dependency diff and license scan deterministic and reproducible.
- Record direct/transitive status because policy may differ by dependency role.
- Preserve reviewer rationale and unresolved obligations for restricted licenses.
- Re-run the gate after lockfile, package source, dependency version, distribution mode, or policy changes.