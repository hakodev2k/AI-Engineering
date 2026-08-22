# Pre Investigation Hook

Trigger: before agent investigation.

Actions:
- validate repository access
- capture current git revision
- confirm environment

Failure:
block workflow when context is missing.
