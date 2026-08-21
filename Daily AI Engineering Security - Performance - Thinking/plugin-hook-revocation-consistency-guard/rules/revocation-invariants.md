# Rules — Plugin Hook Revocation Invariants

1. A plugin in `disabled` or `removed` state **MUST NOT** own any executable hook in the effective runtime registry.
2. A disable/remove operation **MUST NOT** be reported complete until a post-transition runtime inventory is captured and reconciled.
3. The hook inventory shown to users **MUST** be derived from, or deterministically reconciled with, the registry used for execution.
4. A hook that can execute **MUST** have an identifiable plugin/source owner and registry generation.
5. Runtime hook caches **MUST** be invalidated when effective plugin state changes.
6. If live unloading is unsupported, the product **MUST** expose `restart_required` and **MUST NOT** present revocation as complete.
7. Missing hook source files **MUST NOT** cause unbounded retries. Stale handlers **MUST** be quarantined after the configured failure budget.
8. A verifier **MUST** inspect execution telemetry after the transition and fail if a disabled/removed owner executed.
9. Revocation logic **MUST NOT** rely only on configuration files, plugin listings, or UI state.
10. Remediation **MUST NOT** weaken sandbox, authorization, approval, or filesystem protections.
11. Dangerous/irreversible cleanup **MUST** require explicit human approval.
12. Registry reconciliation **SHOULD** be idempotent and safe to rerun.
13. Tests **MUST** cover disable, remove, stale cached handler, hidden active hook, repeated missing-launcher failure, and clean enabled-plugin cases.
14. A successful verification **MUST** distinguish `Implemented`, `Measured`, and `Verified` evidence.
