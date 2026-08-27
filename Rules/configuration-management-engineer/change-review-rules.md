# Configuration Change Review

## Purpose
Ensure configuration changes receive scrutiny proportional to their blast radius and reversibility.

## Scope
Pull requests, change requests, policy updates, runtime toggles, and generated configuration.

## MUST
- Every material change MUST state intent, affected scope, expected behavior, and verification method.
- High-risk changes MUST receive independent human review before execution.
- Reviewers MUST evaluate semantic effects, not only syntax or formatting.
- Changes affecting security, availability, data handling, or public behavior MUST identify relevant risks and rollback or mitigation.
- Generated diffs MUST be reviewable when generated output is the deployed artifact.

## MUST NOT
- Approval MUST NOT be inferred from silence or a successful parser run.
- Review MUST NOT be bypassed solely because the change contains no application code.
- An AI agent MUST NOT approve its own high-risk configuration change as the sole authority.

## SHOULD
- Use ownership rules to route domain-sensitive changes to qualified reviewers.
- Keep changes small enough that reviewers can reason about effective behavior.

## Exceptions
Emergency changes may use incident-specific expedited approval, but MUST retain attribution, evidence, and retrospective review.

## Verification
Inspect change history for intent, reviewers, risk notes, generated diffs, tests, and approval records. Sample high-risk changes and confirm reviewer expertise and required evidence were present before activation.