# Provider Compatibility Rules

- The agent MUST establish a baseline provider capability matrix before enabling provider-specific extensions.
- It MUST NOT infer support for `namespace`, `additional_tools`, Responses Lite, collaboration, or hosted tool-search solely from `wire_api=responses`.
- It MUST separately evaluate primary-turn and Guardian/reviewer request shapes when both are used.
- Deterministic schema-validation 4xx errors MUST NOT be retried unchanged.
- Transient 429, 5xx, or network failures SHOULD use bounded retries with at most two attempts.
- A fallback MUST preserve required security and approval semantics; review/Guardian MUST NOT be bypassed for compatibility.
- Optional tool features MAY be disabled only when task correctness is preserved and the change is recorded.
- Provider credentials and authorization headers MUST NOT appear in traces, evidence, or cache records.
- Cached capability results MUST be keyed by endpoint, API version, model, and serializer/client version and MUST expire.
- Any request containing a capability not marked supported MUST be blocked or transformed before dispatch.
- Performance improvement MUST be demonstrated with before/after failure, retry, or latency metrics.
- The final verifier MUST be independent from the component that selected the fallback profile.