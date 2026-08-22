# Skill: Reconcile Secret Contracts

## Purpose
Resolve mismatches between repository secret consumers and the declared secret-name contract without touching secret values or silently mutating provider configuration.

## When to use
Use after validation reports an unknown reference, alias usage, conflicting contract, required contract with unknown source, renamed reference, or declared secret with no expected consumer.

## Inputs
- Current secret inventory and fingerprint.
- Validation result.
- Repository diff and affected configuration/code.
- Name-only provider/CI metadata when already authorized.
- Runbook or provisioning references.

## Constraints
- Repository edits may rename references only when the intended canonical contract is proven.
- Provider-side create/delete/rename/rotation/permission changes require explicit human approval.
- A successful build is not proof that a production secret binding is correct.

## Procedure
1. Reproduce each validation finding from concrete evidence.
2. Classify it as one of: `consumer-typo`, `stale-alias`, `undeclared-reference`, `orphan-contract`, `source-metadata-missing`, `scope-mismatch`, `consumer-mismatch`, or `conflicting-contract`.
3. Determine the authoritative name from repository policy, provisioning/runbook metadata, and provider name-only metadata. Do not infer authority from whichever spelling appears most often.
4. If the repository consumer is wrong and the canonical contract is proven, prepare the smallest repository-only rename.
5. If the provider-side name is wrong or missing, stop before provider mutation and produce an approval request describing exact action, secret name, environment/scope, rollback, and affected consumers.
6. For aliases, define a bounded migration: canonical name, legacy alias, consumers to migrate, and removal condition. Do not make aliases permanent merely to make validation pass.
7. Update contract metadata only when new evidence supports the change.
8. Re-run scanner from current HEAD after edits; do not reuse an inventory generated before the rename.
9. Re-run validator and hand evidence to the independent reviewer for production, alias, conflicting, or approval-required cases.
10. Run the final integrity gate only with matching HEAD and inventory fingerprint.

## Expected output
- Reconciled inventory or a blocked finding.
- Minimal repository diff when repository references were corrected.
- Approval request when provider/secret-management action is required.
- Review-ready evidence linking each decision to file/line and metadata source.

## Verification
- Canonical references are consistent across known consumers.
- No unknown required reference remains.
- Aliases are explicitly documented and reviewed.
- Current inventory is bound to current HEAD.
- Dangerous provider actions were not performed without approval.
- Final gate returns `verified` before claiming integrity is proven.

## Failure handling
Validation/business-rule failures are not auto-retried. Transient read/tool failures may be retried once. Permission failures stop. If two authoritative sources disagree, mark the contract `blocked` and escalate rather than guessing.

## Stop conditions
Stop when canonical ownership is ambiguous, the only fix requires unauthorized provider mutation, secret values would need exposure, or independent review rejects the proposed reconciliation.
