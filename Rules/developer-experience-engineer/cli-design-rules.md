# CLI Design Rules
## Purpose
Provide stable, scriptable, safe command-line interfaces for developer workflows.
## Scope
Commands, flags, output, exit codes, prompts, destructive operations, and compatibility.
## MUST
- Commands MUST use deterministic exit codes and distinguish success from failure.
- Machine-consumed output MUST have a stable documented format.
- Destructive operations MUST require explicit intent and appropriate confirmation or noninteractive safety controls.
- Breaking CLI changes MUST provide migration guidance and compatibility assessment.
## MUST NOT
- MUST NOT print secrets or tokens in normal or debug output.
- MUST NOT return success after a material operation failed.
- MUST NOT make interactive prompts unavoidable in automation contexts.
## SHOULD
- Errors SHOULD identify cause, affected resource, and corrective action without leaking sensitive data.
- Commands SHOULD support dry-run for high-impact changes where feasible.
## Exceptions
Compatibility exceptions require reason, affected consumers, migration path, risk, and approval.
## Verification
Run contract tests for flags, output, exit codes, automation mode, destructive paths, redaction, and backward compatibility.