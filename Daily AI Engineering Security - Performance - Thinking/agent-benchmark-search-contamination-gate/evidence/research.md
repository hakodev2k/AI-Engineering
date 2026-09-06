# Research

## Topic
Agent Benchmark Search Contamination Gate

## Category
Thinking

## Problem
Search-enabled AI agents evaluated on public benchmarks may retrieve benchmark metadata, question context, issue resolutions, gold patches or explicit answers during inference. This can inflate scores while obscuring whether the agent actually demonstrated the target engineering or reasoning behavior.

## Why it matters now
Search-capable agents are now normal evaluation subjects. A paper posted 2026-06-03, *Search-Time Contamination in Deep Research Agents: Measuring Performance Inflation in Public Benchmark Evaluation* (arXiv:2606.05241), reports search-time contamination across six public benchmarks and up to 4% performance inflation. OpenAI's 2026-02-23 SWE-bench Verified analysis independently reports increasing contamination and says the benchmark no longer measures frontier coding capability reliably; tested frontier models reproduced original fixes or benchmark-specific details. EvoBrowseComp, published June 2026, likewise motivates an evolving benchmark because static search benchmarks are vulnerable to contamination and memorization.

## Affected users
Model-evaluation teams, coding-agent developers, deep-research agent builders, benchmark maintainers, platform teams selecting models from public leaderboards, and researchers comparing browsing-enabled systems.

## Current public evidence
### Observed evidence
1. Wang et al., arXiv:2606.05241, 2026-06-03: defines Benchmark Metadata Leakage, Question-Context Leakage and Explicit Answer Leakage; finds search-time contamination widespread across six public benchmarks and reports performance inflation up to 4%.
2. OpenAI, 2026-02-23: SWE-bench Verified is increasingly contaminated; tested frontier models could reproduce original human-written fixes or benchmark-specific details, and OpenAI stopped using it for frontier evaluation.
3. EvoBrowseComp, arXiv:2606.13120, 2026-06: states static browsing benchmarks are vulnerable to test-set contamination and parametric memorization and introduces evolving questions from fresh web knowledge as mitigation.

### Interpretation
There are two distinct contamination channels: model-memory contamination before the run and search-time contamination during the run. A benchmark redesign can reduce the first, but a run-level provenance gate is needed to know whether live retrieval crossed the intended evidence boundary.

## Existing approaches
Held-out/private tasks, regularly refreshed tasks, contamination-resistant benchmark construction, isolated sandboxes, disabled browsing, transparent search trajectories, controlled benchmark access, lexical/verbatim contamination scans, and manual trajectory review.

## Remaining limitations
- Disabling search changes the behavior of agents whose real capability includes search.
- Private tasks reduce exposure but do not prove that an external retrieval trace was clean.
- Manual review is expensive and inconsistent at scale.
- Fuzzy post-hoc judgment can generate false positives and is difficult to reproduce.
- Missing telemetry can be mistaken for clean behavior unless incompleteness is explicit.

## Root-cause analysis
1. Public benchmark artifacts and solutions are searchable.
2. Evaluation harnesses often treat search as an unrestricted capability without task-specific evidence boundaries.
3. Score aggregation is frequently disconnected from retrieval provenance.
4. Trace completeness is not itself an admission criterion.
5. Contamination detection is often performed after leaderboard publication rather than before scoring.

## Improvement opportunity
Make contamination status an explicit score-admission prerequisite. Use deterministic policy matching on observable search queries, URLs, retrieved text and known answer hashes; quarantine definite and indeterminate runs; measure false positives with clean controls; and require an independent verifier before counting results.

## Relevant sources
- https://arxiv.org/abs/2606.05241
- https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
- https://arxiv.org/abs/2606.13120
