# Code Sample Engineering

## Purpose
Create code examples that are correct, minimal, secure, maintainable, and executable by readers.
## When to use
Use in API, SDK, CLI, framework, and integration documentation.
## Inputs
Supported versions, APIs, auth model, language conventions, test environment.
## Context to inspect
Official SDKs, package versions, lint rules, security guidance, example repositories.
## Core knowledge
Samples are production-influencing code. Optimize for clarity without teaching unsafe patterns or hiding necessary error handling.
## Procedure
1. Define the exact behavior the sample demonstrates.
2. Use supported dependencies and idiomatic language features.
3. Keep unrelated setup minimal.
4. Never embed real secrets or unsafe defaults.
5. Include necessary validation/error handling without obscuring the concept.
6. Pin or document version assumptions.
7. Compile/run samples automatically where possible.
8. Test copy/paste path from documented prerequisites.
9. Maintain shared snippets from canonical sources when reused.
## Decision points
Use inline snippets for focused concepts; runnable repositories for multi-file workflows.
## Common failure patterns
Pseudo-code presented as runnable, stale packages, hard-coded credentials, omitted awaits/errors, and samples diverging across pages.
## Verification
Build, lint, execute, and validate expected output in supported versions.
## Expected output
Executable examples that teach safe current usage.
## Stop conditions
Stop when required API behavior or dependency version cannot be verified.