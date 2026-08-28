# Hook: Pre Context Append
## Trigger
Before a tool result enters model context.
## Preconditions
Tool, arguments, result, timestamp and dependency fingerprint available.
## Action
Evaluate with `scripts/result_reuse_guard.py`.
## Expected result
Exact safe repeats become references; uncertain cases remain full.
## Failure behavior
Guard/input failure falls back to full content and logs reason.
## Blocking
No; failure MUST preserve correctness by sending full content.
