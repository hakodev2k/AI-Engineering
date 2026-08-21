# Rules: Context Coherence

- The agent **MUST** identify required facts for every planned edit unit before editing.
- Every required fact **MUST** have repository provenance and freshness evidence when repository evidence exists.
- Required-fact coverage **MUST** equal the configured threshold before a material edit proceeds.
- The agent **MUST NOT** substitute parametric memory for a repository fact when the fact can be read from the current repository.
- Context optimization **MUST NOT** remove required facts merely to meet a token target.
- Duplicate exploration transcripts and superseded tool output **SHOULD** be evicted before source-of-truth facts.
- Stale conventions, schemas, tests, or configuration **MUST** be refreshed before dependent edits.
- Context compaction **MUST** preserve recoverable references plus integrity metadata for evicted required evidence.
- Token improvements **MUST** be compared against task success and regression evidence; lower tokens alone are not success.
- Refresh/retry loops **MUST** be bounded by `max_refresh_retries`.
- If required coverage cannot be restored within the retry budget, the workflow **MUST** stop rather than guess.
- Post-change verification **MUST** include the tests/validation mapped to the required facts.