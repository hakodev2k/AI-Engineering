# Policy Change Approval Rules

## Purpose
Ensure high-impact policy changes are reviewed and authorized at a level proportional to their security, production, compliance, and blast-radius risk.

## Scope
Applies to policy source changes, production activation, enforcement-mode changes, exceptions, privileged access rules, policy-engine configuration, destructive infrastructure controls, and emergency changes.

## MUST
- Policy changes MUST be classified by impact before production activation, considering newly allowed behavior, newly denied behavior, affected systems, data exposure, privilege, availability, and reversibility.
- Changes that weaken security controls, expand privileged access, enable destructive actions, alter production enforcement, or materially change public or cross-team contracts MUST require explicit human approval from an accountable owner before execution.
- Automated agents MAY analyze, recommend, prepare, test, or simulate high-risk changes but MUST distinguish those actions from executing or approving them.
- Approval evidence MUST identify the reviewed policy revision or immutable artifact and the approved scope.
- Emergency changes MUST record the authority, reason, scope, validation performed, and required post-change review.
- Force push, history rewriting, secret rotation, production configuration changes, infrastructure destruction, or equivalent dangerous actions MUST NOT be executed solely because a policy change requests them; separate authorization for the dangerous action is required.

## MUST NOT
- A policy author or automated agent MUST NOT self-approve a high-risk change where separation of duties is required.
- Approval for one policy version MUST NOT be reused silently for materially different content.
- Reviewers MUST NOT approve a high-risk change without evidence of tests, simulation or impact analysis where those mechanisms are applicable.
- Production urgency MUST NOT erase the requirement to record accountability and recovery actions.

## SHOULD
- Low-risk changes SHOULD use proportionate automated checks and peer review without unnecessary ceremony.
- Approval workflows SHOULD surface semantic decision deltas rather than only textual diffs.
- High-risk changes SHOULD prefer reversible staged activation over immediate global enforcement.

## Exceptions
Emergency authorization may use an expedited path defined by the organization's incident or break-glass process. The exception MUST still identify the accountable human authority, affected scope, risk, validation, rollback or containment plan, and follow-up review.

## Verification
Inspect pull-request and deployment approvals, policy artifact identifiers, semantic diff or simulation evidence, exception records, deployment logs, and audit trails. Verify that protected execution paths reject high-risk activation when required approval evidence is absent or does not match the policy revision being deployed.