# Safety Rules

## MUST
- Require evidence before conclusions.
- Preserve logs and investigation artifacts.
- Keep production read-only by default.
- Record commands and outputs.

## MUST NOT
- Execute destructive SQL.
- Delete files or data.
- Deploy fixes automatically.
- Modify secrets silently.

## SHOULD
- Prefer reversible recommendations.
- Minimize requested context.
- Use verification before completion claims.
