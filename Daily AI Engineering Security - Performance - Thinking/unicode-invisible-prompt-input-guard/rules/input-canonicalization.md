# Input Canonicalization Rules

- Untrusted text MUST be inspected before it enters model context, retrieval memory, tool arguments, or a human approval surface.
- Raw input and canonical input MUST be hashed separately so divergence is auditable.
- The guard MUST detect Unicode Tags U+E0000–U+E007F and configured zero-width/non-rendering code points.
- Detected risky characters MUST NOT be silently discarded without producing an audit record.
- Canonicalization MUST occur before keyword, regex, prompt-injection, DLP, or policy matching.
- The exact canonical representation approved by a human MUST be the representation sent to the model or tool.
- Known legitimate sequences MAY be allowlisted only through explicit, versioned policy and tests.
- Unknown invisible characters SHOULD fail closed for high-authority agent paths.
- Model instructions MUST NOT be treated as a substitute for deterministic input controls.
- Raw untrusted input MUST NOT be copied into privileged prompts, logs, or alerts when doing so could trigger downstream models; use escaped representations.
- Security-sensitive policy changes MUST receive independent review.
- A failed or unavailable canonicalization gate MUST block high-risk ingestion rather than downgrade to warning-only behavior.
