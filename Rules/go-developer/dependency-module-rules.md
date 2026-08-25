# Dependency and Module Rules

## Purpose
Control Go module compatibility, supply-chain risk, and dependency complexity.

## Scope
`go.mod`, `go.sum`, module versions, replacements, upgrades, and third-party libraries.

## MUST
- New dependencies MUST have a justified capability, maintenance posture, license fit, and security review appropriate to risk.
- `go.mod` and `go.sum` changes MUST be reviewed as part of the code change.
- Major upgrades MUST assess API, runtime, operational, and transitive dependency impact.
- Builds MUST resolve dependencies reproducibly from committed module metadata.

## MUST NOT
- MUST NOT use permanent local `replace` directives for production builds without explicit policy.
- MUST NOT add a large framework for a capability adequately served by maintained standard functionality without justification.
- MUST NOT ignore known high-risk vulnerabilities without documented disposition.

## SHOULD
- Minimize dependency surface and remove unused modules.
- Stage risky upgrades separately from unrelated behavior changes.

## Exceptions
Temporary pins or replacements require owner, reason, expiry/removal condition, and verification.

## Verification
Inspect module diffs, run `go mod tidy`, vulnerability/dependency scanning, builds, tests, and license checks where required.