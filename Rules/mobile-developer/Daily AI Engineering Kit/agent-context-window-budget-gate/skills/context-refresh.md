# Context Refresh Skill

## Purpose
Prevent long-running agents from accumulating stale or duplicated context after code, requirements, or evidence changes.

## Inputs
Current context manifest, latest git diff, new tool/test output, current plan.

## Procedure
1. Compare current task state with the manifest.
2. Mark evidence invalidated by changed files or newer test/log output.
3. Remove duplicated excerpts and superseded generated summaries.
4. Preserve immutable task constraints and approval boundaries.
5. Add only new evidence that changes a hypothesis, decision, implementation step, or verification result.
6. Re-run `context_budget.py` for affected candidate sources.
7. Verify with `verify_manifest.py`.
8. Emit facts, hypotheses, decisions, evidence, and open questions separately.

## Failure handling
If source state cannot be determined, mark it stale rather than assuming validity. After two unsuccessful refresh attempts, stop with a list of stale evidence and missing sources.

## Completion
Manifest is within budget, no known stale evidence is treated as current, and required constraints remain present.
