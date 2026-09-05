# Hook: Pre Quarantine
Trigger: before adding or renewing a quarantine.
Preconditions: candidate test id and CI evidence exist.
Action: validate repository state, inspect current registry, confirm exact test id is not already actively quarantined, collect recent failure/pass evidence.
Expected result: evidence package suitable for reviewer decision.
Failure behavior: missing or contradictory evidence blocks automatic quarantine; transient retrieval retries max 2.
Blocking: yes.
