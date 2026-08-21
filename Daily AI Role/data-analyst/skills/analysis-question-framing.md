# Skill: Analysis Question Framing

**Purpose:** convert vague requests into a decision-ready analysis contract.

**Trigger:** stakeholder asks “what happened?”, “why?”, “which segment?”, “did this work?”, or requests a report.

**Inputs:** request, decision owner, deadline, available metrics/sources.

**Preconditions:** requester or accountable decision context is identifiable.

**Steps:**
1. State the decision and action alternatives.
2. Rewrite the request as one primary analytical question plus bounded secondary questions.
3. Define population, entity grain, metrics, dimensions, windows, timezone, filters, exclusions.
4. Identify sources, metric owners, assumptions, restricted-data flags, and dependency blockers.
5. Classify analysis as descriptive, diagnostic, predictive, experimental, or causal; prohibit unsupported causal wording.
6. Set success criterion: what evidence is sufficient to decide or declare unresolved.

**Decisions:** reject scope that cannot affect a decision; split unrelated questions; escalate canonical metric ambiguity.

**Output:** validated analysis contract and analysis plan.

**Verification:** another analyst could compute the intended metric without asking what denominator or time window means.

**Failure/stop:** after 2 failed clarification attempts using available context, document ambiguity and escalate rather than inventing intent.
