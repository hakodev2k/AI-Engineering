# Rules: Context Compaction Retry

- Every compaction attempt MUST record input tokens, output reserve, context limit, retry number, and failure fingerprint.
- An automatic retry MUST be smaller than the preceding failing request by at least the configured minimum.
- Failed-attempt diagnostics and retry markers MUST NOT be recursively summarized as conversation source unless explicitly required for correctness.
- Identical deterministic failure fingerprints MUST NOT be retried after the configured limit.
- Automatic compaction loops MUST have a finite retry cap.
- Context required for correctness MUST NOT be discarded solely to reduce cost.
- A fresh continuation SHOULD use a verified bounded summary rather than raw failed-retry transcripts.
- Success MUST distinguish Implemented, Measured, and Verified.
- A failed guard MUST block automatic retry; callers MUST NOT reinterpret a block as permission to retry with unchanged state.
