# Engineering Rules

## MUST

1. MUST measure the full tool catalog before optimization.
2. MUST enforce both a maximum selected-tool count and maximum estimated schema-token budget.
3. MUST keep the original callable schema unchanged for every selected tool unless a separately reviewed schema change is being made.
4. MUST validate tool names are unique within the routed catalog.
5. MUST always include policy-designated essential tools unless doing so exceeds the hard budget; that condition must fail closed.
6. MUST emit a reason for every selected and rejected tool.
7. MUST keep deterministic fallback behavior when deferred discovery/tool search is unavailable.
8. MUST measure selection recall on representative labeled tasks before production rollout.
9. MUST compare tool-call success rate before and after routing.
10. MUST run schema-budget checks when tool catalogs change.
11. MUST preserve constraints such as `required`, enums, ranges, nested object types, `$defs`, `$ref`, and `additionalProperties` semantics.
12. MUST treat approximate token counting as an estimate and record calibration when an authoritative provider counter is available.
13. MUST separate routing metadata from callable schema so routing text can remain compact.
14. MUST bound fallback tool expansion.
15. MUST fail if essential tools alone exceed the configured budget.
16. MUST log metrics without logging secrets or sensitive tool arguments.

## MUST NOT

1. MUST NOT expose the whole catalog merely because routing returns zero matches.
2. MUST NOT truncate JSON Schema text at arbitrary character/token boundaries.
3. MUST NOT remove parameter constraints solely to reduce tokens.
4. MUST NOT depend exclusively on model reasoning to decide which full schemas enter context when deterministic routing metadata exists.
5. MUST NOT assume prompt caching restores consumed context-window capacity.
6. MUST NOT mark routing successful based only on token reduction.
7. MUST NOT use unlimited discovery, routing, or fallback retries.
8. MUST NOT dynamically add untrusted tool definitions without re-running catalog validation and budget accounting.
9. MUST NOT hide an unreachable essential tool behind deferred discovery without a tested fallback path.
10. MUST NOT use tool annotations from untrusted servers as sole authorization or safety enforcement.
11. MUST NOT store credentials in routing metadata, policy, fixtures, logs, or reports.
12. MUST NOT silently increase the schema budget to make a failing catalog pass.

## SHOULD

1. SHOULD prefer routing by stable tags/keywords before semantic/model-based routing for essential deterministic paths.
2. SHOULD keep routing descriptions to one short capability sentence.
3. SHOULD move long behavioral procedures from tool descriptions into skills or just-in-time documentation when doing so does not reduce call correctness.
4. SHOULD group tasks into representative benchmark classes such as repository, database, browser, ticketing, messaging, and deployment.
5. SHOULD store precomputed per-tool schema-size metrics and invalidate them only when the definition changes.
6. SHOULD order equally relevant tools by smaller schema cost.
7. SHOULD track first-turn/cold-start input tokens separately from cached-turn billing.
8. SHOULD monitor fallback activation because rising fallback frequency signals routing metadata drift.
9. SHOULD version routing policy and benchmark fixtures together.
10. SHOULD test multiple models/clients when the same MCP catalog is consumed by heterogeneous agents.

## Observable enforcement

| Rule | Check |
|---|---|
| Baseline first | Profiler report exists before optimization report |
| Budget | Router output tokens <= `maxToolSchemaTokens` |
| Essential reachability | All essential tools present in normal and fallback fixtures |
| Schema preservation | Selected definition hashes equal original definition hashes |
| Bounded fallback | Selected fallback count <= configured limit |
| Quality | Recall and call-success thresholds pass |
| No silent expansion | Router returns explicit hard failure when essential set exceeds budget |
