# Rules: Protected Namespace Enforcement

- Protected metadata paths MUST remain protected whether they exist at sandbox construction time or are created later.
- A writable ancestor MUST NOT implicitly authorize creation of a protected descendant.
- Policy compilation MUST NOT depend solely on current path-existence state for protected-path enforcement.
- Security setup MUST NOT materialize protected repository or agent metadata merely to attach access-control state.
- Platform-specific backends MUST be verified independently; parity MUST NOT be assumed from configuration syntax alone.
- A configuration that cannot enforce future-path denial MUST fail closed or reduce writable scope.
- Verification MUST test both absent and present protected-path states in disposable fixtures.
- Verification MUST include a before/after filesystem inventory proving policy setup did not create protected objects.
- Tests that change protected fixture state MUST remain isolated from real workspaces and require operator authorization where applicable.
- Logs MUST record path identifiers and decisions but MUST NOT include protected-file contents.
- The implementing agent MUST NOT be the sole verifier for a sandbox-policy change.
