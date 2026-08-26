# Skill: Repository Action Threat Model
## Purpose
Evaluate repository and identity-affecting actions by consequence rather than by tool name.
## Trigger
Any new agent capability, repository credential, write operation, external communication feature, or policy change.
## Inputs
Actor identity, action, target branch/resource, change reference, approver identity, network destination, and audit-history effects.
## Preconditions
Repository permissions and protected-branch policy are known.
## Required context
Task scope, requested change, actor provenance, and current repository policy.
## Allowed tools
Read-only repository inspection, policy validator, test runner.
## Constraints
MUST NOT create identities, rewrite audit evidence, disable branch protection, or self-approve consequential actions.
## Procedure
1. Record facts and action provenance.
2. Classify whether the action changes code, permissions, identity, audit history, or external communications.
3. Run `scripts/repo_action_guard.py`.
4. Identify attack chains that compose multiple individually permitted actions.
5. Verify human approval is independent and attributable.
6. Verify resulting repository state separately from the implementation agent.
## Decision points
Block on unresolved identity, forbidden action, protected-branch direct write, self-approval, or history mutation.
## Expected output
Facts, Evidence, Threat paths, Decision, Risks, Verification status.
## Metrics
Unauthorized write blocks, independent-approval coverage, identity-action blocks, audit-history mutation blocks.
## Verification
A separate Security Verifier reviews policy decision and resulting repository state.
## Failure handling
Fail closed and preserve reason codes; do not retry around a security boundary.
## Stop conditions
Maximum one corrected evaluation; unresolved high-risk ambiguity escalates to a human repository owner.