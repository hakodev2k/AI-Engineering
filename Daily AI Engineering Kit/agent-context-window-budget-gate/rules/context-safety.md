# Context Safety Rules

## MUST
- Preserve the exact task, user constraints, acceptance criteria, security rules, and approval boundaries before optional repository context.
- Reserve output tokens configured in `config/policy.json`; input context must fit the remaining usable budget.
- Record source paths for every summary used as evidence.
- Label facts, hypotheses, decisions, evidence, and open questions distinctly.
- Re-read exact source content before changing public contracts, security behavior, persistence semantics, or production configuration.
- Stop after at most two failed budget-reduction or refresh attempts.

## MUST NOT
- Drop user constraints, security rules, acceptance criteria, or approval requirements merely to fit context.
- Repeatedly load the same unchanged file when a current evidence record already exists.
- Include secrets, credential files, private keys, or production data in agent context.
- Present summarized or inferred behavior as verified source fact.
- Continue when manifest status is `blocked`.
- Use infinite summarize/reload loops.

## SHOULD
- Prefer changed files, entry points, tests, interfaces, and nearby code over broad repository dumps.
- Read targeted ranges of very large files after structural discovery.
- Refresh context after meaningful edits, failed tests that change hypotheses, or requirement changes.
- Keep low-value history/background excluded until evidence requires it.
