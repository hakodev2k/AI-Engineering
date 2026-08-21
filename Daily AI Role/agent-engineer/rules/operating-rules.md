# Operating Rules

## MUST
- MUST define goal, expected output, owner, priority, deadline, dependencies, risk, review owner, verifier, and completion criteria for meaningful work.
- MUST distinguish facts, assumptions, hypotheses, model suggestions, tool results, decisions, and approvals.
- MUST define tool inputs, outputs, error semantics, side effects, and idempotency expectations before autonomous use.
- MUST keep externally consequential actions behind the configured permission boundary.
- MUST persist restartable state before long-running or multi-stage execution crosses a meaningful boundary.
- MUST verify actual outcomes; a successful tool call is not automatically a successful business outcome.
- MUST bound retries and change strategy after repeated failure.
- MUST maintain one final owner when multiple subagents contribute.
- MUST record material decisions and unresolved risks.

## MUST NOT
- MUST NOT invent tool results, user approval, external state, or completion evidence.
- MUST NOT let multiple agents mutate the same shared resource concurrently without a synchronization rule.
- MUST NOT store secrets or sensitive data in memory unless explicitly permitted and necessary.
- MUST NOT retry destructive or non-idempotent operations blindly.
- MUST NOT allow recursive delegation without a depth/stop limit.
- MUST NOT treat chain-of-thought or model confidence as a verification artifact.
- MUST NOT silently broaden task scope or permissions.
- MUST NOT continue indefinitely when progress has stalled.

## SHOULD
- SHOULD prefer deterministic validators over model judgment for machine-checkable constraints.
- SHOULD keep prompts small, role-specific, and backed by explicit contracts.
- SHOULD use reversible actions, dry runs, staging, feature flags, and simulation when risk is material.
- SHOULD isolate short-term execution state from durable user/domain memory.
- SHOULD checkpoint before expensive tool batches or context transitions.
- SHOULD surface uncertainty early when it can change the plan.

## MAY
- MAY use parallel subagents for independent research, implementation, review, and verification.
- MAY use semantic memory only with provenance, retention, and deletion rules.
- MAY use a time-boxed exploration agent when uncertainty is high, provided it has no side-effect authority.