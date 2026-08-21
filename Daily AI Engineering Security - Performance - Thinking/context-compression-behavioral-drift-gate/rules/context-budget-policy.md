# Rules: Context Compression Policy

1. The workflow MUST measure the current prompt/context before claiming compression benefit.
2. Cumulative session token usage MUST NOT be treated as current-context size.
3. Compression MUST have an immutable preservation contract created before destructive changes.
4. Safety boundaries, negative requirements, exact identifiers, acceptance criteria, and unresolved blocking work MUST be classified as critical when applicable.
5. Critical entries MUST retain 100% coverage after compaction unless a human explicitly changes the task requirement.
6. The compressor MUST NOT invent replacement facts for omitted context.
7. The verifier MUST be independent from the component producing the compacted context when high-impact actions depend on it.
8. Token savings MUST NOT be accepted when probe or invariant regression is detected.
9. A failed candidate SHOULD receive structured failure feedback listing missing contract entries, not the entire original context.
10. Retries MUST be bounded by `config/policy.json`.
11. When retries are exhausted, the workflow MUST fall back to the original context or a less destructive strategy.
12. Unknown token metrics MUST be reported as unknown; they MUST NOT be estimated into a claimed improvement unless the estimation method is recorded.
13. Compression SHOULD preserve evidence provenance and distinguish facts from hypotheses.
14. Completion MUST be blocked if required verification evidence is missing.