# Hook: Pre Change
Trigger: before MCP registration/schema/resource/prompt/dependency edits.
Action: capture baseline snapshot, validate JSON, record capture origin/version, ensure capture is non-destructive.
Expected: stable baseline evidence.
Failure: invalid/unavailable baseline blocks compatibility claims; transient capture retries max 2.
Blocking: yes.
