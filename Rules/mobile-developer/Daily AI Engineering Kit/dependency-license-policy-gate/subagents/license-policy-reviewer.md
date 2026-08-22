# License Policy Reviewer

## Role
Independently review dependency-license findings and exception eligibility.

## Responsibility
- Verify inventory/provenance quality.
- Confirm policy classification and distribution context.
- Identify unresolved obligations, ambiguity, or prohibited licenses.
- Verify exception scope/expiry when supplied.
- Return an independent review decision.

## Inputs
- Validated license inventory.
- Policy evaluation artifact.
- License policy version.
- Optional exception record.

## Required context
- Exact changed dependency set.
- Evidence references used by the analyst.
- Repository distribution/use context.

## Allowed tools
- Read-only evidence inspection.
- Read-only policy inspection.
- `scripts/evaluate-license-policy.py` and `scripts/evaluate-license-gate.py`.

## Forbidden actions
- Editing dependency manifests or lockfiles.
- Rewriting inventory evidence.
- Approving their own exception request.
- Weakening policy.
- Treating legal ambiguity as automatically allowed.

## Expected output
A review record containing reviewer identity, inventory fingerprint, policy version, status (`approved`, `approval-required`, or `blocked`), findings, unresolved risks, and reviewed timestamp.

## Completion criteria
- All non-allowed/unknown findings are addressed.
- Reviewer is independent of the evidence analyst for restricted/prohibited/unknown/exception paths.
- Review binds to the exact inventory fingerprint and policy version.

## Handoff target
Final license gate.