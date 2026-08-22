# Research — Planning Progress Watchdog

## Topic
Prevent AI coding agents from getting trapped in repeated planning/review meta-workflows without implementation progress.

## Category
Thinking

## Problem
Long-running coding-agent sessions can repeatedly plan, review, freeze, redesign, or regenerate plans while producing no source change or requested deliverable. The agent may consume large token budgets and still claim progress because meta-artifacts exist.

## Why it matters now
Recent Codex reports show the failure across layered instructions, persistent goals, skill-driven workflows, and plan-generation paths.

## Affected users
Developers using autonomous coding agents, multi-agent workflows, persistent goals, repository instruction files, reusable skills, and long unattended runs.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #36555 (Aug 2, 2026) reports layered AGENTS.md/skills causing a cycle like `problem contract -> freeze -> review -> freeze -> ...` with zero implementation despite an approved plan and explicit stop instructions. https://github.com/openai/codex/issues/36555
2. Issue #34657 reports a persistent goal running for more than a day while repeatedly planning instead of delivering; impact included millions of tokens and false progress signals. https://github.com/openai/codex/issues/34657
3. Issue #32406 reports GPT-5.6 with reusable workflow skills repeatedly redesigning/replanning rather than transitioning to implementation. https://github.com/openai/codex/issues/32406
4. Issue #34659 reports 4,000–5,000-line code-heavy plans, repeated approval/planning loops, and significant token/time consumption before source implementation. https://github.com/openai/codex/issues/34659

## Interpretation
The common failure is not lack of planning capability. It is missing phase-transition control and weak progress observability. Agents can mistake more planning output for forward movement because no deterministic mechanism requires a deliverable delta.

## Existing approaches
- Prompt instructions such as “implement after planning”.
- Plan mode and task lists.
- Human interruption.
- Token/time limits.
- Persistent goals and subagent reviews.

## Remaining limitations
Prompt-only stop instructions are themselves part of the reasoning context and may be reinterpreted. Time/token limits detect cost, not productive progress. Task lists can advance without an implementation artifact. Independent reviews can amplify the loop if each review regenerates planning work.

## Root-cause analysis
1. Planning artifacts and product artifacts are not distinguished.
2. No measurable progress invariant links each phase to requested deliverables.
3. Approved plans can be re-opened without evidence of changed requirements.
4. Repeated meta-actions lack a bounded retry counter.
5. Completion checks inspect workflow state rather than acceptance criteria.

## Improvement opportunity
Add a deterministic progress ledger and watchdog that classifies actions as planning, implementation, verification, or delivery; requires a measurable deliverable delta after a bounded planning phase; blocks repeated plan regeneration without changed inputs; and refuses completion when acceptance evidence is missing.

## Goal
Bound planning/review loops and force an explicit transition to implementation, blocked status, or human escalation.

## Metrics
- consecutive meta-only actions
- source/artifact delta count
- tests or acceptance checks produced
- time/tokens since last deliverable delta
- plan-regeneration count
- completion claims with unsatisfied gates

## Trigger
Approved plan, persistent goal, multi-agent review, repeated planning actions, or long-running task with no product delta.

## Inputs
Task goal, acceptance criteria, action/event log, changed-file list, test results, current phase, approval state.

## Outputs
Progress classification, gate decision, reason, bounded retry count, and completion eligibility.

## Relevant sources
- https://github.com/openai/codex/issues/36555
- https://github.com/openai/codex/issues/34657
- https://github.com/openai/codex/issues/32406
- https://github.com/openai/codex/issues/34659
