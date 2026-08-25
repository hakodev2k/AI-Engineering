# Developer CLI Rules
## Purpose
Make engineering command-line tools predictable, scriptable, and safe.
## Scope
Internal CLIs, wrappers, bootstrap commands, and automation interfaces.
## MUST
- Commands MUST use stable exit codes and write actionable errors to an appropriate stream.
- Destructive actions MUST require explicit intent and clearly identify target scope.
- Non-interactive automation modes MUST be deterministic and documented.
- Breaking command or output changes MUST follow an announced compatibility strategy.
## MUST NOT
- MUST NOT print secrets or silently perform unrelated side effects.
- MUST NOT rely on interactive prompts when invoked in documented CI mode.
## SHOULD
- CLIs SHOULD support dry-run for high-impact mutations and machine-readable output for automation.
## Exceptions
Breaking changes require migration guidance, evidence of consumers considered, and approval.
## Verification
Contract-test exit codes/output, test destructive safeguards, CI mode, redaction, and backward compatibility.