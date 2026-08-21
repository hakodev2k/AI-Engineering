# Final Verification Hook

Trigger: after implementation and targeted tests.

Preconditions: diff and test results exist.

Action:
1. Verification Agent inspects changed files and runs build/relevant tests.
2. Confirm evidence covers duplicate replay, concurrent same-key execution, and fingerprint mismatch.
3. If a safe non-production endpoint is explicitly available, run `scripts/concurrency-probe.py`; otherwise rely on repository integration tests and record that limitation.
4. Validate final evidence against `schemas/evidence.schema.json` using the repository's JSON-schema tooling when available.
5. Confirm no approval-required action remains unapproved.

Expected result: evidence status `pass`.

Failure behavior: `fail` returns to implementation for at most two scoped correction cycles; `blocked` stops and preserves evidence.

Blocking: yes. Completion cannot be claimed without pass.
