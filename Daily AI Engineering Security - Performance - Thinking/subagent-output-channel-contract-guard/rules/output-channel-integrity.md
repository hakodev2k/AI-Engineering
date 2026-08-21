# Rules — Output Channel Integrity

- Every result-dependent subagent dispatch MUST have one authoritative output contract before execution.
- The contract MUST identify accepted channels, required schema/fields, empty-result semantics, fallback behavior, and retry budget.
- A mandatory reporting tool MUST be attested as available to the child before dispatch.
- Host-injected tool descriptions MUST NOT silently override a caller-defined output contract.
- A parent MUST NOT interpret bare `[]`, `{}`, empty text, or missing output as a verified no-findings result unless the contract explicitly allows it and completion evidence proves `verified_empty`.
- Delivered results MUST carry the expected contract ID or equivalent correlation evidence.
- A structured tool payload SHOULD be relayed to the parent when it is the authoritative child result; UI rendering MUST NOT make the payload inaccessible to the caller.
- Contract repair retries MUST be bounded to one. The retry MUST change a diagnosed incompatibility rather than repeat the same contract.
- Partial work MUST be surfaced as partial; it MUST NOT be normalized into success.
- High-impact review results MUST be independently verified before automated destructive or irreversible actions.
- Agents MUST NOT expose hidden chain-of-thought; evidence should consist of observable findings, artifacts, tool results and verification status.
