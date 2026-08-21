# Pre Review Validation Hook

Trigger: Before AI review starts.

Actions:
- Validate repository availability.
- Validate diff access.
- Confirm review-only mode.

Failure behavior:
Block workflow when required context cannot be collected.
