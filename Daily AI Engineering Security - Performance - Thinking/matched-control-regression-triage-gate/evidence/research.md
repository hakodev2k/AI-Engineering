# Research

## Topic
Matched-control regression triage for AI/software engineering

## Category
Thinking

## Problem
A failing trace alone often underdetermines root cause. Agent investigations become expensive and drift-prone when they do not first establish a nearby passing control and compare only the dimensions that differ.

## Why it matters now
Current AI developer tooling has multiple execution surfaces—interactive/headless, desktop/CLI, bundled tools, checkpoints, model/tool continuation paths—and recent regressions are isolated most effectively by matched controls rather than broad retrying.

## Affected users
Developers, AI-agent users, platform engineers, framework maintainers, incident responders, and teams debugging regressions in agent runtimes.

## Current public evidence
### Observed evidence
1. Claude Code issue #87531, opened 2026-08-18, reports interactive CLI continuation failing after tool calls while the same machine, account, network, repository, and models work in Desktop Code and `claude -p`; five headless control runs succeeded. This narrows the failure to the interactive continuation path. https://github.com/anthropics/claude-code/issues/87531
2. OpenAI Codex issue #39591, opened 2026-08-20, reports the in-app Browser failing on build `26.814.41407` but working immediately after rollback to `26.810.52044` on the same Mac with no project/account/profile change, strongly isolating a runtime regression. https://github.com/openai/codex/issues/39591
3. LangGraph issue #8458, opened 2026-07-27, reports checkpoint replay working in 1.1.6 and broken from 1.1.7 onward, with a bisect to PR #7498 and a concrete namespace/task-id difference. https://github.com/langchain-ai/langgraph/issues/8458

### Interpretation
These independent reports show that a nearby passing analogue is high-value evidence: it removes shared dimensions from the hypothesis set and turns an unconstrained investigation into a differential one. The engineering gap is making this discipline mandatory and machine-checkable in agent workflows.

### Proposed solution
A deterministic investigation ledger gate that requires matched-control evidence (or a bounded unsuccessful search), explicit differences, evidence-linked falsifiable hypotheses, bounded unique experiments, and independent verification before repair/completion.

## Existing approaches
Minimal reproductions, logs, rollback, A/B testing, `git bisect`, test matrices, issue templates, and human debugging checklists.

## Remaining limitations
These tools do not ensure an autonomous agent searches for a passing control before editing. Ad-hoc experiments can repeat after no new evidence, control and failing environments may differ in undocumented dimensions, and a plausible diagnosis may be treated as verified without replaying both control and failing cases.

## Root-cause analysis
1. Failure evidence is collected without an explicit comparison baseline.
2. Environment/version/surface dimensions are not normalized into a difference set.
3. Hypotheses are not required to predict an observable discriminator.
4. Retries are triggered by failure rather than new information.
5. The investigator can self-approve a conclusion without independent evidence review.

## Improvement opportunity
Make differential diagnosis a reusable pre-repair contract for agents and engineering workflows.

## Goal
Reduce unsupported hypotheses and repeated experiments while increasing root-cause isolation and verification coverage.

## Metrics
Calls/time to first discriminating hypothesis; matched-control rate; duplicate experiment blocks; hypothesis rejection rate; repair rework; verification coverage.

## Trigger
Regression report, intermittent failure, surface-specific error, version-dependent behavior, or repeated failed repair attempt.

## Inputs
Investigation ledger containing failing case, control search, facts, differences, hypotheses, experiments, and verification evidence.

## Outputs
Pass/block result with failed invariants and measurable counts.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/87531
- https://github.com/openai/codex/issues/39591
- https://github.com/langchain-ai/langgraph/issues/8458