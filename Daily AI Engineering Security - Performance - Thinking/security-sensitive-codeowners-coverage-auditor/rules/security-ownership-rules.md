# Security Ownership Rules

- Security-critical repository paths MUST have an explicitly documented required specialist owner.
- Required-owner coverage MUST be evaluated against the live tree, not only CODEOWNERS syntax.
- A broad catch-all rule MUST NOT be treated as specialist coverage unless the critical-path manifest explicitly requires that owner.
- The effective owner set MUST be derived from the last CODEOWNERS pattern matching the path.
- A critical manifest path that no longer exists MUST block verification until maintainers confirm retirement or update the mapping.
- Repository refactors that move security-sensitive code SHOULD run the ownership gate before merge.
- CODEOWNERS changes MUST NOT silently weaken existing specialist coverage.
- The auditor MUST NOT modify repository permissions or team membership.
- If the intended owner is ambiguous, automation MUST stop and require maintainer/security-owner resolution.
- When code-owner review is a required control, branch/ruleset enforcement SHOULD be verified separately from path coverage.
