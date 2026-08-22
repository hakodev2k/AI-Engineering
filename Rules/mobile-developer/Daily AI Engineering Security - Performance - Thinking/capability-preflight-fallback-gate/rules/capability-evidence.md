# Rules: Capability Evidence

1. Every hard tool/runtime dependency MUST be declared before the dependent plan stage executes.
2. Ambient UI state, plugin installation, configuration, or a skill name MUST NOT be treated as proof that a callable capability exists.
3. A hard capability MUST reach the evidence level required by the task: discoverable, callable, healthy, and semantically suitable.
4. Tool discovery MUST occur before a plan commits to a hard capability when availability is not guaranteed by the runtime contract.
5. Health probes MUST use the smallest non-destructive operation that proves the required semantics.
6. Deterministic initialization failures MUST NOT be retried indefinitely; one retry is the default maximum unless evidence changed.
7. A fallback MUST preserve every required semantic property, including authentication/session continuity, permission scope, locality, visual/DOM access, and side-effect boundaries when applicable.
8. A technically callable but semantically weaker fallback MUST be rejected or explicitly approved by the task owner.
9. Optional unavailable capabilities SHOULD degrade only the stages that depend on them.
10. The capability ledger MUST separate Facts, Assumptions, Evidence, Decision, Risks, and Verification status.
11. The agent MUST NOT claim that a capability is available when the strongest evidence is only `declared` or `ambient`.
12. A plan revision after failed preflight MUST identify which dependency changed and why the new path is valid.
13. Preflight SHOULD be repeated only when evidence changes, such as runtime restart, plugin/tool exposure change, permission change, version rollback/update, or authentication change.
14. Completion MUST be blocked if a hard dependency remained unverified and no semantically equivalent fallback was verified.
15. Hidden chain-of-thought MUST NOT be requested or stored as evidence.