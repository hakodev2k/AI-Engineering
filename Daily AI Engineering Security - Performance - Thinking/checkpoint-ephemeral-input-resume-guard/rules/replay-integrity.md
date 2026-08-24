# Replay Integrity Rules

- A resumable task **MUST** declare every replay-critical input field before first execution.
- Every replay-critical field **MUST** have a durability source: checkpoint state, durable artifact, immutable event log, or deterministic reconstruction recipe.
- The runtime **MUST** record a canonical digest of replay-critical input at dispatch.
- A resume **MUST NOT** execute the model, tools, or side effects until required fields have been reconstructed and validated.
- Missing required fields or digest mismatches **MUST** block automatic resume.
- A changed value **MAY** resume only through an explicitly versioned recovery decision with human approval when semantics cannot be proven equivalent.
- Retry loops **MUST** be bounded. Default maximum: 2 reconstruction attempts and 1 human-escalation attempt.
- The implementing worker **MUST NOT** be the only verifier of a recovery involving externally visible side effects.
- Recovery evidence **SHOULD** include task ID, checkpoint ID, field names, source, dispatch digest, resume digest, decision, and timestamp.
- The system **MUST NOT** mark a task verified merely because the checkpoint loaded successfully.
