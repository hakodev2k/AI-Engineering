# Access Control and Protocol Governance

## Purpose
Design privileged operations, role boundaries, timelocks, multisig controls, and governance processes so administrative power is explicit, limited, observable, and recoverable.

## When to use
Use whenever contracts expose owner/admin/guardian/upgrade/mint/pause/configuration powers.

## Inputs
Privileged operations, operator model, governance requirements, emergency policy, upgrade model, custody constraints.

## Preconditions
Critical protocol powers and acceptable trust assumptions are identified.

## Context to inspect
Ownership, role-based access control, multisig configuration, timelocks, governor contracts, emergency guardians, key rotation, event emissions.

## Core knowledge
Decentralization claims do not remove administrative risk. Security depends on blast radius, quorum, delay, separation of duties, key custody, transparent change procedures, and viable emergency response.

## Procedure
1. Inventory every privileged state transition.
2. Classify impact: reversible, financial, upgrade, censorship, or shutdown.
3. Assign least-privilege roles.
4. Separate routine administration from emergency authority.
5. Put high-impact operations behind multisig and/or timelock where appropriate.
6. Define quorum, signer independence, and key rotation.
7. Emit events for all authority changes and privileged actions.
8. Design revocation and compromised-key procedures.
9. Test unauthorized, stale-role, and emergency scenarios.
10. Document residual centralized trust.

## Decision points
Use timelocks when users need exit/review time; retain narrowly scoped guardians when immediate mitigation is operationally necessary.

## Common failure patterns
Single-key ownership, overpowered admin roles, undocumented bypasses, governance that cannot act during incidents, and irreversible renounce patterns without operational analysis.

## Verification
Review authorization matrix, simulate signer loss/compromise, and test every privileged path with positive and negative cases.

## Expected output
Authority matrix, governance flow, emergency model, key-rotation plan, and verified controls.

## Stop conditions
Escalate when high-impact powers lack accountable ownership or the governance model cannot recover from signer/key failure.