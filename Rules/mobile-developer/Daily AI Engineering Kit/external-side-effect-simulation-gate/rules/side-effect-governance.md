# Side-Effect Governance Rules

## MUST
- Classify every non-read-only tool call before execution.
- Bind every simulation and approval to an action ID and plan revision.
- Prefer provider-native validate-only/dry-run, then sandbox/test tenant, then deterministic local fixture/mock.
- Record target, environment, effect category, expected effects, reversibility, permissions, simulation mode, and approval state.
- Treat unknown environment, target, reversibility, or simulation semantics as blocking uncertainty.
- Require independent review for financial, public publishing, external communication, production mutation, destructive, security-sensitive, or irreversible actions.
- Require explicit human approval immediately before any policy-designated live action.
- Revalidate the plan after any payload, target, recipient, tool, permission, or environment change.
- Preserve simulation evidence and gate results.

## MUST NOT
- Do not call a live mutating endpoint merely to test credentials or connectivity.
- Do not send test email/message/notification to real recipients unless explicitly approved.
- Do not charge, refund, publish, deploy, delete, rotate secrets, alter security controls, or mutate production configuration without explicit approval.
- Do not infer dry-run safety from a parameter name without provider semantics or controlled evidence.
- Do not silently switch from sandbox/test tenant to production.
- Do not expand permissions to unblock simulation or execution.
- Do not treat idempotency as absence of side effects.
- Do not let the action executor be the only verifier for high-risk actions.
- Do not retry business-rule or validation failures automatically.

## SHOULD
- Use synthetic recipients/resources in sandbox environments.
- Use least-privilege credentials scoped to the simulation target.
- Include a deterministic request fingerprint in evidence.
- Keep live execution as a distinct workflow stage from simulation.
- Prefer a narrow canary/live scope when approved and technically supported.
