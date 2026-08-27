# Rules: Review Input Trust Boundary

- Agent-consumed review content MUST retain field-level provenance.
- Hidden HTML comments, invisible control characters, and non-rendered instruction-bearing segments MUST NOT authorize tool use.
- Privileged actions MUST cite evidence visible to the human reviewer.
- A service or repository being trusted MUST NOT make every user-controlled field trusted.
- Prompt-injection classifiers SHOULD be supplemental; review-parity and least-privilege controls MUST remain enforceable without them.
- Secret-reading and external-write actions MUST require explicit policy authorization and human approval when configured.
- Raw-vs-visible deltas MUST be logged without storing secrets.
- Security verification MUST be independent from the implementing agent for high-risk changes.
- A failed parity check MUST block privileged execution and MUST NOT be bypassed by model-generated justification.
