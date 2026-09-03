# Literature Synthesis

## Purpose
Systematically convert papers, technical reports, repositories, and benchmark evidence into an actionable understanding of the research landscape. This skill helps a Senior AI Research Engineer identify established baselines, unresolved questions, methodological weaknesses, and implementation details that materially affect new experiments.

## When to use
Use before starting a new research direction, when evaluating a claimed improvement, when selecting a baseline, when reproducing prior work, or when a field is moving quickly and internal assumptions may be stale. Do not use literature review as a substitute for direct experimentation when the evidence is already sufficient to answer the engineering decision.

## Inputs
- Research question
- Candidate papers, repositories, and technical reports
- Relevant benchmark leaderboards
- Date range or recency requirements
- Internal experimental evidence

## Preconditions
Define the exact research question and the type of evidence needed. Separate foundational work, current state of the art, negative results, replications, and implementation-oriented sources.

## Context to inspect
Inspect publication date, venue, authorship, citations where useful, official code, training data, model scale, evaluation setup, compute budget, licensing, benchmark contamination risk, and later corrections or follow-up work. Verify whether reported comparisons use equivalent data, compute, and evaluation protocols.

## Core knowledge
A literature synthesis is not a list of summaries. It is an evidence map. Senior-level synthesis compares assumptions, interventions, scales, datasets, evaluation protocols, and failure modes across sources. Reported headline metrics are often not directly comparable because of differences in data filtering, prompt format, sampling, checkpoint selection, test-time compute, or contamination controls.

## Procedure
1. Translate the research question into search concepts and adjacent terminology.
2. Identify foundational papers that define the problem or benchmark.
3. Find recent strong baselines and independent replications where available.
4. Prefer primary sources and official code over secondary summaries for technical claims.
5. Extract for each work: objective, model family, data, scale, intervention, training budget, evaluation protocol, headline result, limitations, and released artifacts.
6. Normalize comparisons by identifying incompatible assumptions or experimental budgets.
7. Track whether results depend on proprietary data, hidden prompts, unreleased checkpoints, or unusually large test-time compute.
8. Identify contradictions between papers and determine whether methodology explains them.
9. Capture negative results and known failure cases, not only successful approaches.
10. Group works by research mechanism rather than chronology alone.
11. Identify which claims have strong replication support and which remain fragile.
12. Map the strongest implementable baseline for the current project constraints.
13. Record open questions that can be tested with available resources.
14. Produce a concise evidence-backed recommendation for the next experiment.

## Decision points
- Prefer an older, well-reproduced baseline over a newer opaque result when reliability matters.
- Treat leaderboard improvements cautiously when benchmark contamination or prompt tuning is possible.
- Use preprints for frontier awareness but distinguish them from independently validated evidence.
- Exclude methods that cannot be fairly compared under available compute, data, or licensing constraints unless the difference itself is relevant.

## Common failure patterns
- Summarizing abstracts without checking methodology.
- Comparing metrics produced under different evaluation protocols.
- Ignoring data scale and compute differences.
- Missing negative or contradictory evidence.
- Treating citation count as proof of correctness.
- Copying claimed implementation details that are not present in released code.
- Failing to update conclusions when a benchmark is later found contaminated.

## Verification
The synthesis is implemented when sources and extracted evidence are organized. It is verified when key claims can be traced to primary sources, comparison assumptions are explicit, incompatible results are not presented as directly comparable, and the proposed baseline is justified against realistic constraints.

## Expected output
An evidence map with source references, normalized comparison dimensions, reproducibility notes, unresolved contradictions, implementable baselines, and recommended research directions.

## Stop conditions
Stop and escalate when critical claims cannot be verified from primary sources, licensing prevents use of required artifacts, benchmark validity is materially disputed, or the available literature cannot support a defensible baseline choice.