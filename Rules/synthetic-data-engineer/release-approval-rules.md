# Release and Approval Rules

## Purpose
Prevent incomplete, unsafe, unvalidated, or unauthorized synthetic datasets from reaching production, external consumers, or consequential workflows.

## Scope
Applies to dataset publication, external sharing, production deployment, benchmark release, model-training handoff, and any material change to an approved synthetic-data product.

## MUST
- Require all mandatory quality, privacy, leakage, security, semantic, fairness, lineage, and downstream-utility gates to pass before release.
- Record the exact dataset version, generator version, validation evidence, intended use, known limitations, and accountable approver for each release.
- Require human approval before releasing high-risk datasets, weakening privacy or security controls, changing consequential acceptance thresholds, or distributing data beyond the previously approved audience.
- Define rollback, revocation, or consumer-notification procedures for defective releases.
- Re-run impacted validation when generator code, source data, schema, labels, privacy controls, or material configuration changes.
- Distinguish permission to analyze or prepare a release from permission to execute publication or production deployment.

## MUST NOT
- Publish because a deadline is approaching when mandatory gates have failed or have not run.
- Override a failed safety or privacy gate solely on agent confidence.
- Reuse prior approval for a materially changed dataset without impact assessment.
- Perform destructive replacement, public distribution, access expansion, or irreversible publication without the required human authorization.
- Conceal known limitations from downstream consumers.

## SHOULD
- Use automated release gates backed by immutable validation artifacts.
- Prefer reversible staged distribution for new or materially changed datasets.
- Provide machine-readable usage constraints and version metadata with released artifacts.

## Exceptions
An exception requires the failed or waived rule, rationale, evidence, residual risk, alternatives considered, expiry or remediation plan, and explicit approval from an accountable human with authority over the affected risk.

## Verification
Inspect the release checklist, CI gate results, validation reports, approvals, artifact hashes, access scope, known-limitations documentation, and evidence that revocation or rollback procedures are executable.