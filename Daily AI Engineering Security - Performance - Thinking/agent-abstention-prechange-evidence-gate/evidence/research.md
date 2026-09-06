# Research

## Topic
Agent Abstention Pre-Change Evidence Gate

## Category
Thinking

## Problem
Coding agents are frequently optimized to produce patches, so they can modify already-correct code when a reported issue is stale, already fixed, duplicate, environment-specific, or only partially reproducible. The failure is especially dangerous in autonomous maintenance because a plausible patch can introduce technical debt even when the correct action is to abstain.

## Why it matters now
A COLM 2026 study published by SRI Lab/ETH Zurich introduced FixedBench, 200 human-verified tasks where no code change is required. Across five recent models and four agent harnesses, agents still proposed undesirable code changes in 35%–65% of cases. The paper also found that telling agents to reproduce first helps but can cause incorrect abstention on partially fixed issues, so a single prompt rule is insufficient. A separate August 2026 SWE-RPG study of repository-level agents reports an average resolved rate of only 31.5% and identifies implicit-requirement recovery as a major bottleneck, reinforcing that deciding what the repository actually requires is an independent engineering step rather than a by-product of patch generation.

## Affected users
Repository maintainers, issue-triage bots, autonomous coding-agent users, CI remediation systems, platform teams, and organizations running unattended maintenance agents.

## Current public evidence
### Observed evidence
1. SRI Lab, COLM 2026: FixedBench contains 200 already-resolved coding tasks; state-of-the-art agents make undesirable source changes in 35%–65% of cases.
2. SRI Lab's March 23, 2026 engineering write-up reports that agents attempt to "fix" already-correct code more than half the time and notes that stale or parallel-resolved issues are routine in real repositories.
3. SWE-RPG, submitted August 10, 2026, evaluates Claude Code, Codex, and OpenCode with multiple model backends and reports a 31.5% average resolved rate; implicit requirement recovery accounts for 24.5%–46.0% of diagnosed failures.
4. A large observational study submitted August 31, 2026 analyzes 20,574 real-world coding-agent sessions and reports recurring failures in interpreting intent and bounding actions, with 91.49% of visible resolutions requiring explicit user correction.

### Interpretation
The actionable gap is not simply "reason more." Agents need a deterministic pre-change control plane that makes no-change a valid outcome, requires repository-grounded evidence before writes, distinguishes fully resolved from partially resolved reports, and records why a write is justified.

## Existing approaches
- Prompt instructions such as "reproduce before fixing."
- Test-first workflows.
- Human review before merge.
- Git-history inspection and issue/PR search.
- Agent planning modes and approval gates.

## Remaining limitations
- A passing test suite does not prove the reported behavior still exists.
- Reproduction-only rules can over-abstain when an issue is partially fixed or environment-dependent.
- Planning modes can still assume that a patch is mandatory.
- Human review happens after the agent has already spent time and produced unnecessary diffs.
- Most harnesses do not expose an auditable decision artifact containing facts, assumptions, reproduction evidence, current-state evidence, and the explicit write/no-write decision.

## Root-cause analysis
1. Patch-oriented reward and task framing create an action bias.
2. Investigation and implementation are not separated by a blocking checkpoint.
3. Stale/duplicate/parallel-fix evidence is not treated as first-class input.
4. Partial-fix states are collapsed into binary reproduced/not-reproduced outcomes.
5. Agents can write before an independent verifier reviews the change-necessity claim.

## Improvement opportunity
Introduce a pre-change evidence gate that requires a structured decision record before source writes. The gate validates evidence for current behavior, repository history, relevant tests, requirements, and partial-fix status. It permits three outcomes: `change-required`, `no-change`, or `insufficient-evidence`. Source edits are blocked unless `change-required` is supported by required evidence. High-risk or ambiguous decisions receive independent review.

## Relevant sources
- SRI Lab, "Coding Agents Don't Know When to Act", COLM 2026: https://www.sri.inf.ethz.ch/publications/gloaguen2026coding
- arXiv 2605.07769, 2026-05-08: https://arxiv.org/abs/2605.07769
- SRI Lab, "Coding Agents Are 'Fixing' Correct Code", 2026-03-23: https://www.sri.inf.ethz.ch/blog/fixedcode
- SWE-RPG, arXiv 2608.09072, 2026-08-10: https://arxiv.org/abs/2608.09072
- "How Coding Agents Fail Their Users", arXiv 2605.29442, submitted 2026-08-31: https://arxiv.org/abs/2605.29442
