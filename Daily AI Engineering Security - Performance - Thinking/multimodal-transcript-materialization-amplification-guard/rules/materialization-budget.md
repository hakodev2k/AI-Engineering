# Rules: Materialization Budget

- Performance changes MUST begin with a baseline.
- A runtime MUST NOT claim improvement from token reduction alone when disk/RAM materialization is unmeasured.
- Large transcript operations SHOULD stream records instead of constructing unnecessary full-history copies.
- Binary artifacts SHOULD be referenced by stable identifiers or content-addressed storage when exact inline bytes are not required.
- The same binary payload MUST NOT be durably duplicated in multiple fields without a documented compatibility requirement.
- Child-agent handoff SHOULD contain bounded references/summaries instead of full multimodal parent history.
- A pre-resume/fork budget violation MUST block automatic high-fan-out execution.
- Required context MUST NOT be removed solely to satisfy a resource budget.
- Cleanup MUST NOT delete final/user-selected artifacts without explicit policy and approval.
- Optimization retries MUST be bounded to two.
- Before/after measurements MUST use comparable workloads.
- The implementation agent MUST NOT be the only verifier.