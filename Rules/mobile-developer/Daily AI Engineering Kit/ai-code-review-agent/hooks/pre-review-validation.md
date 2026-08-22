# Pre Review Hook

Trigger: Before AI review starts.

Action:
- validate repository metadata
- ensure diff is available
- ensure required context exists

Failure:
Block review when required inputs are missing.
