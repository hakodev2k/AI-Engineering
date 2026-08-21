# Workflow: Developer Issue Triage
**Trigger:** developer reports failure or confusing behavior.
**Goal:** give a correct next action and route the underlying cause.
**Inputs:** issue text, version, environment, expected/actual, logs if safe.
**Stages:** severity/security screen → context collection → reproduction → classification → workaround validation if possible → owner handoff → user response → follow-up.
**Parallel:** product-fact review and sample verification may run together after reproduction setup exists.
**Blocking:** security incident or possible data exposure moves immediately to security process.
**Retry:** max 2 reproduction attempts with materially different justified hypotheses.
**DoD:** status, evidence, owner, and safe user-facing response are explicit.