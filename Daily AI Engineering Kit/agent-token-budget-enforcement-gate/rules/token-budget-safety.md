# Token Budget Safety Rules

## MUST
- Load `config/policy.yaml` before planning a task that uses this kit.
- Track task-input, planning, execution-context, verifier, and total token usage separately.
- Run `scripts/token_budget_gate.py` before execution and after any major context expansion.
- Preserve evidence needed to reproduce findings before compacting context.
- Treat `block` as a hard stop unless a human provides an explicit scoped override.
- Record override reason and temporary ceiling in the task evidence.
- Keep facts, hypotheses, decisions, and open questions distinguishable.

## MUST NOT
- Continue after a budget block by silently dropping acceptance criteria or verification evidence.
- Fabricate token counts when provider metrics or deterministic estimates are unavailable.
- Increase model/tool permissions to avoid token constraints.
- Remove security, production-safety, migration, or approval context merely to fit a budget.
- Perform more than two automatic compaction passes.
- Replace verification with a cheaper unchecked claim that work is complete.

## SHOULD
- Load repository context incrementally from entry points toward evidence.
- Prefer file paths plus focused excerpts over complete unrelated files.
- Reuse stable summaries only when their source evidence remains identifiable.
- Split a task when one bounded subtask can be verified independently.
