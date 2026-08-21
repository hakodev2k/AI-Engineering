# Rules: Permission Precedence

- Every tool call MUST have an effective permission decision with provenance before unattended execution.
- Explicit hard deny rules MUST override allows unless the system's documented policy explicitly states otherwise.
- An allow rule MUST NOT be described as authoritative unless runtime evidence confirms that no higher-priority layer can override it.
- Classifier, hook, user approval, inherited policy, and server-side checks MUST be represented as separate layers.
- Deterministic policy denials MUST NOT be retried more than once without a material policy or approval change.
- The agent MUST NOT switch to a global bypass, weaker sandbox, broader tool permission, or disabled safety classifier as an automatic recovery action.
- Human approval MUST be scoped to the exact action, target, and risk surface and MUST be fresh when the prior action was denied for safety.
- Read-only operations SHOULD use the narrowest approval path available.
- Unknown policy precedence for risky mutations MUST block execution.
- Decision logs MUST redact secrets and MUST record tool identity, layer decisions, winning layer, reason, retryability, and timestamp.
- Subagents MUST inherit explicit parent restrictions unless a documented narrower policy is applied.
- A permission conflict MUST be treated as a configuration/runtime defect to investigate, not as evidence that safety controls should be removed.