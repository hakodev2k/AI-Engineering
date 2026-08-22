# Test Environment Parity Governance

## MUST
- Bind release-relevant tests to an explicit target environment contract.
- Capture actual test environment evidence after environment startup and before relying on test results.
- Treat provider/engine, major version and behavior-relevant capabilities as parity dimensions.
- Re-capture and re-evaluate after changing test infrastructure or dependency versions.
- Preserve test results separately from parity results; both are required evidence.
- Require independent review for production-target work or any critical parity gap.
- Bind review records to exact contract and snapshot fingerprints.
- Stop before approval-required production, database, infrastructure, secret, security or breaking-contract actions.

## MUST NOT
- Claim production confidence solely because tests passed in SQLite/InMemory/fake providers when production uses materially different semantics.
- Change target expectations only to improve the parity score.
- Store secret values in contracts, snapshots, reports or reviews.
- Treat an emulator as equivalent to a real provider without evidence for required capabilities.
- Silently ignore a missing required dimension.
- Auto-retry semantic/parity failures until green.
- Let the implementation owner be the sole verifier for production-target critical gaps.
- Increase permissions to obtain evidence without explicit authorization.

## SHOULD
- Prefer major-version parity and capability parity over exact patch equality unless patch behavior matters.
- Keep contracts small and behavior-focused.
- Use repository-native containers/IaC to build test environments when practical.
- Add provider-specific integration tests for known semantic differences.
- Preserve residual gaps and reviewer rationale as release evidence.
