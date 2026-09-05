# Quarantine Safety Rules
## MUST
- Quarantine only with concrete flaky evidence.
- Use the narrowest test identifier possible.
- Record owner, reason, evidence, creation date, expiry, and status.
- Keep active duration within policy.
- Run deterministic gate in CI.
- Preserve host build/test evidence.
- Independently verify any quarantine change.
## MUST NOT
- Disable an entire suite to silence one flaky test.
- Renew an expired quarantine without explicit human approval and fresh evidence.
- Edit historical evidence to make quarantine appear valid.
- Treat flaky classification as proof that product behavior is correct.
- Weaken security assertions or production safeguards.
- Perform destructive operations, force push, infrastructure/secret changes, or production deployment without approval.
## SHOULD
- Fix nondeterministic clocks, random seeds, shared state, and ordering at the source.
- Track quarantine age in CI output.
- Resolve registry entries immediately after repair verification.
