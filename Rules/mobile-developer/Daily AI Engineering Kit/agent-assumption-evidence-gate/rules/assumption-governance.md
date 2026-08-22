# Assumption Governance

## MUST
- Record every material assumption before it influences planning, editing, testing, approval, or verification.
- Separate facts, hypotheses, assumptions, decisions, and open questions.
- Give each assumption a stable ID, owner, materiality, evidence target, expiry, and explicit consumers in `used_by`.
- Mark an assumption `supported` only when positive evidence exists and is referenced.
- Mark an assumption `contradicted` immediately when evidence disproves it.
- Revalidate assumptions after any configured trigger such as base-branch movement, dependency/version change, schema/config change, environment change, or conflicting runtime evidence.
- Require independent review for high/critical assumptions that influence a final decision or dangerous action.
- Stop before production deployment, destructive data work, schema changes, force push, infrastructure/secret/config changes, breaking API changes, or security weakening when a material assumption affecting that action is unresolved.
- Preserve evidence and gate reports when stopping.

## MUST NOT
- Promote an assumption to fact because it is plausible, conventional, repeated by another agent, or consistent with the current implementation.
- Use contradicted or expired assumptions to justify work.
- Hide unresolved assumptions inside prose summaries.
- Treat missing evidence as supporting evidence.
- Auto-waive critical assumptions.
- Let the implementing actor be the sole reviewer of high-risk assumptions.
- Retry validation failures without new evidence.
- Increase tool permissions to obtain evidence without approval.

## SHOULD
- Prefer repository files, tests, runtime observations, logs, database/API results, and official documentation over secondary descriptions.
- Keep assumption statements falsifiable and narrow.
- Use the shortest practical TTL for volatile environment/runtime assumptions.
- Convert stable supported assumptions into explicit repository documentation or tests when that reduces future uncertainty.
- Remove assumptions from `used_by` when they no longer influence the task.