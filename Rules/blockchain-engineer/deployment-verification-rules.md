# Deployment Verification

## Purpose
Ensure the intended artifacts, parameters, and authorities are what actually reach the target network.

## Scope
Contract deployment, initialization, address derivation, verification, configuration, and handoff.

## MUST
- Verify target chain ID, deployer authority, bytecode/artifact hash, constructor/initializer parameters, and linked libraries before production deployment.
- Use a reviewed deployment plan with explicit preconditions and postconditions.
- Verify deployed code and initialized state immediately after deployment.
- Transfer or renounce temporary privileges only according to the approved plan.
- Require explicit human approval before production deployment.

## MUST NOT
- Deploy from an unreviewed local workspace or ambiguous branch.
- Reuse test addresses or configuration by assumption.
- Continue after a post-deployment verification mismatch.

## SHOULD
- Rehearse production-equivalent deployment on a representative network/fork.

## Exceptions
Emergency deployments require incident context, minimized scope, named approver, and immediate post-deployment review.

## Verification
Compare source commit, artifact hashes, chain ID, transaction receipts, verified source, initialized state, ownership, and emitted deployment events.