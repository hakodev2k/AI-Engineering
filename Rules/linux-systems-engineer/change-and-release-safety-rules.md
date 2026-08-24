# Change and Release Safety Rules

## Purpose
Reduce production risk from host, fleet, and platform changes.

## Scope
Applies to production configuration, packages, kernels, services, storage, networking, security controls, and fleet automation.

## MUST
- Material changes MUST define intended outcome, affected scope, prerequisites, validation, failure criteria, and rollback or replacement strategy.
- High-risk changes MUST use staged rollout with representative canaries where technically feasible.
- Change timing MUST consider redundancy, traffic, dependent maintenance, and incident state.
- Production deployment, destructive actions, security-control weakening, and irreversible changes MUST require explicit human approval.
- Post-change validation MUST test service outcomes, not merely command success.

## MUST NOT
- A broad fleet change MUST NOT proceed after canary failure without understanding and approving the discrepancy.
- Rollback MUST NOT be claimed available unless dependencies and data/schema compatibility make it executable.
- Forceful recovery commands MUST NOT be normalized as standard deployment steps.

## SHOULD
- Prefer small reversible changes.
- Automate preflight checks and stop conditions.
- Record exact versions and configuration deltas.

## Exceptions
During active incidents, emergency changes may use accelerated review but MUST preserve authorization, scope control, evidence, and follow-up reconciliation.

## Verification
Review change records and diffs, canary results, approval evidence, rollback prerequisites, monitoring during rollout, and post-change health. Confirm no unapproved production action exceeded the prepared scope.