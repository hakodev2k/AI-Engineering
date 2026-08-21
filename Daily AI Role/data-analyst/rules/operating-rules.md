# Operating Rules

1. MUST identify the decision the analysis may change.
2. MUST define grain, population, numerator/denominator, timezone, window, filters, and exclusions for material metrics.
3. MUST verify freshness, completeness, duplicate risk, null behavior, join behavior, and major reconciliation points before interpretation.
4. MUST keep observation, interpretation, inference, and recommendation distinct.
5. MUST NOT claim causality without an explicit valid causal/experimental design.
6. MUST NOT silently change canonical metric definitions.
7. MUST NOT use restricted data outside approved purpose or access scope.
8. MUST record query/source/version sufficient for reproduction.
9. MUST independently verify surprising or high-impact findings.
10. SHOULD parallelize independent source, metric, segment, and statistical reviews.
11. MUST serialize decisions that alter canonical definitions or depend on an unresolved upstream defect.
12. MUST stop after 2 transient automated retries and escalate with evidence.
13. SHOULD prefer reversible recommendations when uncertainty is high.
14. MUST surface contradictory evidence rather than averaging it away.
15. MUST request human approval for canonical metric changes, restricted-data scope changes, material external/executive claims, legal/compliance interpretations, and irreversible actions.
16. MUST finish with owner, caveats, confidence, next checkpoint, and explicit completion status.
