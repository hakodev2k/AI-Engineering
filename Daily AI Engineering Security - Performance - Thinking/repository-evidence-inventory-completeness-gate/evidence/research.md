# Research — Repository Evidence Inventory Completeness Gate

## Topic
Repository Evidence Inventory Completeness Gate

## Category
Thinking

## Problem
Coding agents can begin implementation from whatever evidence is already in context instead of first discovering and reading the authoritative repository artifacts needed to scope the task. This causes incomplete inventories, repeated questions already answered by project docs, stale assumptions, and completion claims based on remembered prose rather than current durable state.

## Why it matters now
Two independent August 2026 reports from major coding-agent products show the same observable failure shape. Anthropic Claude Code issue #84250 reports a session that processed only 127 screenshots because the agent inventoried two known directories and missed a third directory containing 163 more; a verification agent found it in under a minute. OpenAI Codex issue #37325 reports inherited checkpoint prose being treated as authoritative project state without re-reading durable artifacts, producing false tracker/UI/package completion claims.

## Affected users
Developers using coding agents in large repositories, multi-repository projects, documentation-heavy workflows, release engineers, QA/knowledge-base builders, and teams using long-running/resumed agent sessions.

## Current public evidence
### Observed evidence 1 — incomplete source inventory
Anthropic `claude-code` issue #84250, opened 2026-08-05, describes Opus 5 beginning tasks without retrieving available repository context. In one documented case it processed 127 screenshots from two known directories while missing 163 screenshots in a third repository-root directory. The completed work covered only 44% of available source material.

Source: https://github.com/anthropics/claude-code/issues/84250

### Observed evidence 2 — checkpoint prose promoted over durable artifacts
OpenAI `codex` issue #37325, opened 2026-08-06, describes long-running sessions inheriting natural-language checkpoint claims and using them as authoritative state without reconciling the actual repository. Independent inspection found that a supposed standalone workflow definition did not exist, a static visual checkpoint was presented as functional UI, the package was not built, and execution constraints were internally contradictory.

Source: https://github.com/openai/codex/issues/37325

## Existing approaches
- Always-loaded repository instructions such as AGENTS.md/CLAUDE.md.
- Handover/checkpoint summaries between sessions.
- Search/read tools available on demand.
- Plans and todo lists before implementation.
- Post-hoc reviewer agents or human review.

## Remaining limitations
Instructions can say “check the repository” without proving it happened. A plan built from an incomplete inventory simply formalizes the wrong scope. Checkpoint summaries are useful but can drift from durable state. Post-hoc verification detects omissions late, after expensive work has already been performed. Search itself is not enough unless the expected evidence classes and coverage criteria are explicit.

## Root-cause analysis
1. Loaded context is mistaken for sufficient context.
2. Agents lack an observable pre-execution requirement to enumerate authoritative evidence classes.
3. Natural-language checkpoint claims are not tagged with provenance/freshness.
4. “All files/items” tasks often have no denominator established before work begins.
5. Search coverage is judged heuristically instead of against declared roots/patterns.
6. Completion gates verify produced artifacts but may not verify source-inventory coverage.

## Improvement opportunity
Create a pre-execution evidence inventory contract. For scope-sensitive tasks, the agent must declare expected evidence classes, search authoritative roots, fingerprint the inventory, resolve contradictory checkpoint claims against current artifacts, and establish a denominator before implementation. A deterministic inventory gate compares declared patterns/roots against observed inventory and blocks “complete” when required evidence classes remain unresolved.

## Goal
Prevent implementation and completion claims from being based on partial repository awareness when the task depends on discovering all relevant sources or current durable state.

## Metrics
- Required evidence-class coverage: 100% resolved or explicitly blocked.
- Inventory denominator established before mutation: 100% for exhaustive tasks.
- Post-implementation newly discovered in-scope source count: target 0.
- Unsupported durable-state claims: target 0.
- Rework caused by missed source inventory: measurable reduction from baseline.

## Trigger
Tasks containing exhaustive scope (`all`, `every`, migration, repository-wide, release readiness), resumed work relying on checkpoints, or decisions whose correctness depends on current repository artifacts.

## Inputs
Repository roots, task statement, declared evidence classes/globs, checkpoint assertions, authoritative artifact hints, ignore rules, optional baseline inventory.

## Outputs
Inventory manifest, unresolved evidence classes, checkpoint-vs-artifact conflicts, coverage status, mutation allow/block decision, and verification report.

## Interpretation
These reports do not prove every agent or model skips retrieval. They show that repository context availability does not guarantee repository context use. The engineering opportunity is to make evidence acquisition observable and testable instead of relying solely on model discretion.

## Proposed solution
A reusable evidence-inventory preflight, deterministic manifest checker, enforceable provenance rules, independent scope verifier, and bounded workflow that requires Observe → Inventory baseline → Resolve authority → Implement → Re-inventory → Verify before completion.