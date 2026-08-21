# Research

## Topic
Independent Patch Verification Gate

## Category
Thinking

## Problem
Coding agents often verify their own patches under the same interpretation that produced them. Tests may be missing, weak, or pass despite solving the wrong problem; tool-level write success may also hide truncated/corrupted edits. A patch can therefore be declared complete without independent evidence that it addresses the original issue and preserves required invariants.

## Why it matters now
Autonomous coding agents increasingly produce larger patches with less human review. Recent research and public tool failures show that self-review and execution success are insufficient completion signals.

## Affected users
Developers using coding agents, teams running unattended repair/refactor workflows, CI agent platforms, and maintainers reviewing generated patches.

## Current public evidence
### Observed evidence
1. RETRACE, arXiv:2608.08950 (2026-08-09), identifies a post-generation verification gap and reports Pass@1 gains of 7.0% and 3.6% on SWE-bench Verified by independently reconstructing what problem a patch appears to solve and reconciling it with the original issue.
2. Proof-or-Stop, arXiv:2607.14890 (2026-07-16), treats agent lifecycle claims as untrusted until fresh mechanically verifiable evidence satisfies a gate; its evaluation reports fewer visible-pass/hidden-fail amplifications than a naive loop.
3. OpenAI Codex issue #34674 (2026-07-22) reports Windows `apply_patch` paths where incomplete payloads could be accepted and written as shorter files, motivating pre/post length/hash/diff verification rather than trusting tool success.
4. A 2026 specification-first case study (arXiv:2608.12440) used repeated frozen-specification audits and a convergence criterion of consecutive zero-finding verification passes, correcting many defects before execution.

### Interpretation
Verification must be structurally independent from implementation, tied to the frozen task/specification, and based on observable evidence. Merely rerunning the same agent with the same context risks correlated interpretation errors.

## Existing approaches
- Unit/integration tests.
- Agent self-review and self-refinement.
- CI status checks.
- Human code review.
- Diff inspection.

## Remaining limitations
Tests may not encode the issue intent; self-review is correlated with the original plan; CI can pass on incomplete behavioral coverage; humans may be absent in unattended runs; raw tool success does not prove write integrity.

## Root-cause analysis
1. Implementation and verification share the same assumptions.
2. Acceptance criteria are not frozen before code changes.
3. Evidence is not bound to current source state.
4. Patch intent is not independently reconstructed from the resulting diff.
5. Completion transitions can occur before integrity and behavior checks converge.

## Improvement opportunity
Add a model-agnostic verification gate that freezes acceptance criteria, captures source-state identity, requires an independent verifier to reconstruct patch intent from diff plus evidence, compares it to the original task, checks write integrity and tests, and blocks DONE until all required evidence is current and consistent.

## Relevant sources
- https://arxiv.org/abs/2608.08950
- https://arxiv.org/abs/2607.14890
- https://github.com/openai/codex/issues/34674
- https://arxiv.org/abs/2608.12440
