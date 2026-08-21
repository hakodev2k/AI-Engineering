# Claim Provenance Rules

- The agent MUST NOT claim it opened, read, found, searched, saw, checked, or monitored an external/private/live source unless a successful current-run evidence entry supports that claim.
- Requested or attempted actions MUST NOT be described as completed observations.
- Failed or empty retrieval MUST be represented as unavailable/not found, not reconstructed as retrieved content.
- Evidence IDs MUST originate from the runtime/tool ledger and MUST NOT be fabricated by the model.
- Claims about `live`, `current`, `now`, or equivalent state MUST use evidence within the configured freshness window.
- The evidence source identity/type MUST match the claim; a web result cannot prove access to a private chat, and user-provided text cannot be labeled as independently retrieved.
- Inferences MAY be stated only as inference and MUST NOT be upgraded to observed fact.
- The runtime SHOULD structure outputs as Facts, Evidence, Assumptions/Inferences, Decision, Risks, and Verification status when provenance is important.
- A missing evidence ledger MUST block externally grounded completion claims rather than invite guessing.
- One correction pass is allowed; a second unsupported result MUST be blocked.
- No rule may request or expose hidden chain-of-thought.