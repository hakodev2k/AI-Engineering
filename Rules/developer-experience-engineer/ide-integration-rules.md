# IDE Integration Rules
## Purpose
Keep editor and IDE integrations predictable without making core workflows editor-dependent.
## Scope
Extensions, language services, tasks, debugging, workspace settings, and generated metadata.
## MUST
- Required repository workflows MUST remain executable outside a single proprietary editor unless the project explicitly mandates it.
- Shared IDE configuration MUST be portable, reviewed, and free of user-specific paths or secrets.
- Extension recommendations MUST distinguish required from optional tooling.
- Debug configurations MUST avoid production credentials and unsafe defaults.
## MUST NOT
- MUST NOT commit personal tokens, absolute home paths, or machine-specific state.
- MUST NOT make correctness depend on an unversioned local extension.
- MUST NOT auto-execute high-impact commands on workspace open without explicit consent.
## SHOULD
- Common tasks SHOULD map consistently between CLI and IDE workflows.
- Settings SHOULD reduce friction without overriding legitimate developer accessibility needs.
## Exceptions
Editor-specific requirements need documented business/technical rationale, fallback expectations, and ownership.
## Verification
Test clean workspace setup, inspect shared settings, compare CLI/IDE outcomes, and review extension permissions and debug configuration.