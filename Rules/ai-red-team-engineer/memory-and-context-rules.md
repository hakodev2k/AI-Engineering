# Memory and Context Security

## Purpose
Assess security risks created by persistent memory and long-lived conversational context.

## Scope
Session history, user memory, agent scratch state, summaries, caches, profiles, and cross-session retrieval.

## MUST
- Test cross-user leakage, malicious persistence, stale authorization, poisoned memory, and deletion behavior where applicable.
- Verify memory writes and reads obey identity, tenant, retention, and sensitivity controls.
- Determine whether untrusted stored content can later become executable instruction context.

## MUST NOT
- Persist red-team payloads into shared or production memory without authorization and cleanup controls.
- Assume summarized content is safe merely because original markup was removed.

## SHOULD
Test delayed-trigger attacks and context compaction or summarization boundaries.

## Exceptions
Persistent testing in live environments requires explicit approval and verified cleanup.

## Verification
Inspect memory records, ownership metadata, write/read traces, retention behavior, deletion results, and delayed attack replays.