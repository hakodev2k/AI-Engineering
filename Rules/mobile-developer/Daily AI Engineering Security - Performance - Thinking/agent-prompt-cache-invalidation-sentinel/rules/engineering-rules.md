# Engineering Rules

## MUST
- MUST establish a measured healthy baseline before changing cache thresholds for production use.
- MUST preserve request IDs, timestamps, cache-read tokens, cache-creation/write tokens, and client/model version when those fields are available.
- MUST treat repeated cache collapse as a measurable event, not infer a root cause from token counters alone.
- MUST separate **Observed**, **Hypothesized**, **Implemented**, **Measured**, and **Verified** states in incident records.
- MUST bound reproduction attempts to at most two high-cost large-context runs per hypothesis.
- MUST retain correctness-critical system/task/context data even when reducing cache churn.
- MUST fail closed on malformed policy when used as a CI/automation gate.
- MUST use non-content metadata for diagnosis unless content inspection is explicitly necessary and approved.
- MUST re-baseline after intentional model/system-prompt/client serialization changes.
- MUST record the first collapse request and the preceding warm request for every incident.

## MUST NOT
- MUST NOT claim token savings without before/after counters.
- MUST NOT label every cache miss a defect; TTL expiry, model changes, and intentional context changes can be valid misses.
- MUST NOT disable safety, authorization, repository instructions, or required context merely to improve cache hit rate.
- MUST NOT continuously retry a large session after repeated cache collapse.
- MUST NOT log prompt text, secrets, tool payloads, or source code solely for this sentinel.
- MUST NOT silently change threshold semantics between providers.
- MUST NOT attribute a provider/client bug unless controlled evidence supports that conclusion.
- MUST NOT use aggregate billing totals as the only verification signal.

## SHOULD
- SHOULD alert after repeated collapses within a short request window rather than on a single miss.
- SHOULD correlate incidents with client upgrades, process restarts, resumes, hook changes, and cache miss diagnostics when available.
- SHOULD run the sentinel in observe-only mode before enabling `fail_on_incident`.
- SHOULD keep policies versioned with the agent/client integration.
- SHOULD test policy changes against labeled healthy and pathological fixtures.
- SHOULD prefer stable static prefixes and move volatile metadata outside cache-critical regions when the platform architecture permits it.
- SHOULD use a fresh session as a bounded fallback when a long session is demonstrably thrashing and continuity can be safely checkpointed.
