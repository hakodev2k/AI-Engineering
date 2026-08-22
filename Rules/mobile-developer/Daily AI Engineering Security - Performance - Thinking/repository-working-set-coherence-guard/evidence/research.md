# Research — Repository Working-Set Coherence Guard

## Topic
Repository Working-Set Coherence Guard

## Category
Token

## Problem
Coding agents frequently rebuild repository context repeatedly, consume large token budgets, and still miss coupled facts required for safe edits. More context is not automatically better: stale or irrelevant repository instructions can increase cost and reduce task success, while missing required facts causes confident but incorrect edits.

## Why it matters now
Recent 2026 research shows repository exploration is a major token bottleneck, context-file overuse can increase cost while lowering success, and repository-scale agents can differ by more than an order of magnitude in tokens while reconstructing the same required facts. A paper posted August 17, 2026 calls this missing-context failure mode "coherence debt" and reports that additional spending does not recover facts that were never made available.

## Affected users
Coding-agent users, platform engineers, agent-harness maintainers, teams operating repository-scale autonomous coding, and developers paying for token-heavy long-running tasks.

## Current public evidence
### Observed evidence
1. *The Working Set of a Coding Agent: Coherence Debt in Repository-Scale Tasks* (Aug 17, 2026) reports that seven models fail similarly when required facts are unavailable, that harnesses can differ by more than 10x in tokens consumed while rebuilding the same content, and that stale conventions can be worse than missing conventions: https://arxiv.org/abs/2608.16630
2. Microsoft Research's *FastContext* (Jun 12, 2026) identifies repository exploration as a major token bottleneck and reports up to 60% coding-agent token reduction while improving end-to-end resolution by up to 5.5% using a specialized exploration agent: https://arxiv.org/abs/2606.14066 and https://github.com/microsoft/fastcontext
3. *Evaluating AGENTS.md* (Feb 12, 2026) reports repository-level context files increased inference cost by more than 20% and tended to reduce task success, supporting minimal, task-relevant instructions rather than unconditional context loading: https://arxiv.org/abs/2602.11988
4. *Can Coding Agents Solve Repository-Level Issues with Rendered Code?* (Aug 10, 2026) finds compression can reduce prompt-token cost but aggressive compression can become unstable and patch-test trial-and-error remains a major cost center: https://arxiv.org/abs/2608.09268

## Existing approaches
- Load broad repository instructions and large file trees into the prompt.
- Let the main solver repeatedly search/read files as needed.
- Summarize conversation/context after it grows large.
- Use retrieval or exploration subagents to localize relevant files.
- Compress source or tool outputs to reduce prompt size.

## Remaining limitations
Broad context can include stale or irrelevant requirements; pure summarization can drop edit-critical facts; repeated search duplicates tokens; retrieval without dependency coverage can omit coupled configuration/tests/contracts; compression can preserve cost while losing operational details. Existing approaches often measure tokens but not whether the facts required by the current edit are actually present at edit time.

## Root-cause analysis
- Context is managed by size/recency rather than by task dependency.
- Exploration traces are kept in solver history instead of distilled into a working set.
- Required facts are not represented as an explicit dependency ledger.
- Context refresh policies are weak when files, tests, schemas, or conventions change.
- Token optimization is frequently evaluated without correctness/regression gates.

## Improvement opportunity
Maintain an explicit per-task working-set manifest containing required facts, provenance, freshness, and edit dependencies. Before each edit, deterministically verify that required facts are either present or recoverably referenced. Evict exploration noise, not dependency evidence. Measure tokens/task and quality together and reject optimizations that reduce tokens by dropping required facts.

## Goal
Reduce repository-context tokens and repeated exploration while preserving or improving correctness and verification coverage.

## Metrics
- Input tokens/task and tool-output bytes/task.
- Duplicate context ratio.
- Required-fact coverage at edit time.
- Repeated repository reads/searches.
- Task success and regression-test pass rate.
- Context refreshes caused by stale dependencies.

## Trigger
Before implementation starts, before each material edit batch, after repository/test/config changes, and before context compaction.

## Inputs
Task goal, candidate edits, required-fact manifest, file hashes/versions, current context inventory, token estimates, verification requirements.

## Outputs
Allow/block decision, missing/stale facts, context additions/evictions, token estimate, dependency coverage, and verification evidence.

## Interpretation
The evidence supports a dependency-aware working set, not a claim that one fixed context strategy is universally optimal. Token savings must be evaluated together with correctness.

## Proposed solution
A reusable working-set coherence guard combining task-scoped fact manifests, deterministic freshness checks, token/duplication accounting, a curator subagent, bounded refresh workflow, and regression tests.