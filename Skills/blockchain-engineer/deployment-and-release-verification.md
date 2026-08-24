# Deployment and Release Verification

## Purpose
Deploy blockchain contracts and supporting services with reproducible artifacts, deterministic configuration, explicit authority setup, and post-deployment verification.

## When to use
Use for first deployment, upgrades, migrations, chain expansion, or production configuration changes.

## Inputs
Compiled artifacts, constructor/initializer parameters, target chain, deployer account, governance addresses, deployment scripts, verification requirements.

## Preconditions
Release candidate has passed tests and required security review; target-chain configuration is approved.

## Context to inspect
Compiler version/settings, bytecode, libraries, deployment scripts, chain ID, RPC, nonce, gas strategy, proxy configuration, ownership transfers, block explorer verification, and release notes.

## Core knowledge
A successful transaction does not prove a correct deployment. Senior release work verifies bytecode, initialization, ownership, addresses, dependencies, invariants, and operational handoff on the target chain.

## Procedure
1. Freeze and hash release artifacts and compiler settings.
2. Validate target chain and addresses before signing.
3. Simulate deployment/upgrade against a fork where practical.
4. Record expected deployment addresses or nonce assumptions.
5. Execute deployment with bounded privileges.
6. Confirm receipts and required finality.
7. Verify deployed bytecode/source metadata.
8. Validate initialization and storage/state values.
9. Transfer ownership/admin roles to intended governance.
10. Revoke temporary deployer privileges where required.
11. Run post-deployment smoke and invariant checks.
12. Record addresses, tx hashes, versions, and rollback/migration constraints.

## Decision points
Prefer scripted reproducible deployment over manual console actions. Split high-risk migrations into staged releases when intermediate states can be made safe.

## Common failure patterns
Wrong chain, wrong initializer parameters, forgotten ownership transfer, unverified implementation, stale deployment artifact, and assuming explorer verification equals runtime correctness.

## Verification
Compare deployed bytecode/state against the approved manifest; execute target-chain smoke tests; verify role ownership and events.

## Expected output
Deployment record, verified addresses/artifacts, governance handoff evidence, and post-release checks.

## Stop conditions
Stop when target chain, artifact identity, authority destination, or migration safety cannot be confirmed before irreversible execution.