# Lifecycle Hooks

- **on-intake:** require workload owner, environment, subscription/tenant scope, business purpose, and deadline.
- **before-design-complete:** check identity, network, data, RTO/RPO, observability, cost, quota, governance.
- **before-iac-apply:** require validated plan/what-if, no secrets, dependency review, destructive-action classification, approval status.
- **before-production-mutation:** capture baseline health and rollback trigger.
- **after-change:** verify resource state plus workload/data-plane behavior.
- **after-incident:** create root-cause, lesson, process improvement, and prevention action.
- **after-failure:** retry only when transient cause is known and safe; maximum from config.

Hooks should be deterministic, minimal, repeatable, and idempotent where practical.