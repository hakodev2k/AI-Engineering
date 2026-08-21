# Context Safety Rules

## MUST
- Collect repository structure before loading large files.
- Keep facts, assumptions and decisions separate.
- Load only evidence relevant to the task.

## MUST NOT
- Include secrets or credentials in AI context.
- Modify files without understanding dependencies.
- Treat assumptions as confirmed facts.

## SHOULD
- Prefer tests, interfaces and entry points as primary context.
