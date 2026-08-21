# Skill: Remediate Configuration Drift

## Purpose
Resolve confirmed configuration drift with the smallest safe change and prove convergence.

## Inputs
Verified drift report, classification evidence, repository context, acceptance criteria, and approvals when required.

## Preconditions
A drift item must be confirmed rather than hypothetical. The intended source of truth must be identified. Approval-required actions must already have explicit human approval before execution.

## Allowed tools
Repository edit/build/test tools and approved non-production configuration tooling. Production write tools are allowed only after explicit approval and only within the approved scope.

## Procedure
1. Select one confirmed drift cause and trace how the expected and actual values are produced.
2. Decide whether the baseline is stale or the observed configuration is wrong; record evidence.
3. Create a minimal remediation plan including files/systems touched and rollback method.
4. Stop for approval if the plan touches any category in `config/drift-policy.json`.
5. Apply the smallest safe change.
6. Run relevant build/tests or configuration-generation checks.
7. Recollect the observed snapshot using the same scope and retrieval method.
8. Rerun detector and report verifier.
9. Inspect repository diff and external change receipt; set `unintended_changes_checked` to true only after inspection.
10. If drift remains, replan once. A second failed remediation attempt stops and escalates with evidence.

## Expected output
Remediation evidence, post-change verified drift report, test/build evidence, rollback notes, and remaining risk.

## Verification
Completion requires detector exit `0`, verifier exit `0`, relevant tests passing, no unintended changes, and any required approval recorded.

## Failure handling
Transient tool failures may be retried twice without changing the plan. Validation failures require evidence-based replanning and permit one remediation replan. Permission failures stop immediately.

## Stop conditions
Stop on missing approval, ambiguous source of truth, failed rollback capability for high-risk work, repeated verification failure, or any request to silently increase privilege.
