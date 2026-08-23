# Rules: Browser Observation Budget

- Every optimization MUST start with a measured baseline.
- Browser observations MUST be attributed by type, page/step, size, and duplicate fingerprint when technically possible.
- An unchanged full DOM/screenshot observation MUST NOT be appended repeatedly when a reusable prior observation is valid.
- The host SHOULD prefer the smallest observation sufficient for the next decision: locator/subtree/delta before full-page snapshot.
- DOM and screenshot SHOULD NOT both be admitted for the same step unless distinct evidence is required.
- A per-event and per-task observation budget MUST be configured and reported.
- `required_full=true` MUST permit an explicit budget escalation rather than silently truncating correctness-critical evidence.
- Stale observations SHOULD be evicted after their decision checkpoint is complete.
- Token savings MUST NOT remove authentication state, target identity, required success/failure evidence, or safety-relevant page state.
- Improvement MUST be demonstrated with before/after tokens or bytes plus latency and task-quality metrics.
- Quality regression MUST block rollout even if token usage falls.
- Optimization retries MUST be bounded to three hypotheses per investigation.
