# Tool Input Integrity Rules

- Every high-risk multi-parameter tool call MUST pass a deterministic integrity gate after parsing and before authorization/execution.
- The gate MUST evaluate the exact parsed argument object that would be dispatched.
- A string argument containing a transport parameter fragment naming another declared sibling field that is absent or null MUST block dispatch.
- A call containing invocation-boundary residue such as `</invoke>` MUST block unless the tool has an explicit, reviewed transport-markup exemption.
- The system MUST NOT heuristically reconstruct ambiguous swallowed parameters and then execute the repaired call.
- Required fields MUST be validated using the declared schema.
- Semantically critical fields SHOULD be configured explicitly and MUST block when absent/null even if the schema marks them optional.
- Prompt instructions MUST NOT be treated as the enforcement mechanism for argument integrity.
- The integrity decision MUST be produced outside the model and MUST be machine-readable.
- Logs MUST NOT contain raw secrets, credential values, or complete sensitive tool arguments.
- Integrity logs SHOULD contain tool name, affected field names, reason codes, value lengths, and non-secret fingerprints only.
- A blocked model call MAY be re-composed at most twice. A third integrity failure MUST stop and escalate rather than loop indefinitely.
- Side effects MUST NOT occur before an ALLOW decision.
- Persistence/external-write tools SHOULD perform readback verification of configured critical fields when a safe read API exists.
- A successful HTTP/tool status MUST NOT be treated as Verified when critical readback mismatches.
- Tool-specific exemptions MUST be narrow, documented, and covered by regression fixtures; a global disable is forbidden for high-risk tools.
- Security MUST NOT be weakened to reduce false positives; instead refine schema-aware matching and fixtures.
- Completion MUST be blocked if a known-bad corruption fixture is allowed or a benign control fixture is incorrectly blocked without an accepted exemption.