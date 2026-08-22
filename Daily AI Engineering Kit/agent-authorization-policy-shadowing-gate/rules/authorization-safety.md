# Authorization Safety Rules

## MUST
- Confirm the authorization evaluation model before classifying shadowing.
- Preserve source evidence for every normalized rule.
- Treat deny-rule removal, admin-scope widening, default-effect changes, and production policy updates as approval-required.
- Add or update tests for both permitted and forbidden cases when changing authorization logic.
- Fail closed when policy parsing or validation fails in CI.
- Preserve existing remote Git changes and use non-force updates.

## MUST NOT
- Do not weaken authorization to make tests pass.
- Do not convert an explicit deny to allow without human approval.
- Do not assume wildcard semantics across platforms.
- Do not use production credentials for static policy analysis.
- Do not expose secrets, tokens, user data, or production policy payloads in reports.
- Do not let the implementing agent be the sole verifier for high-risk authorization changes.

## SHOULD
- Prefer explicit priorities and stable rule identifiers.
- Keep policy generation deterministic and reviewable.
- Test least-privileged principals before privileged principals.
- Document accepted shadowing when intentionally retained.