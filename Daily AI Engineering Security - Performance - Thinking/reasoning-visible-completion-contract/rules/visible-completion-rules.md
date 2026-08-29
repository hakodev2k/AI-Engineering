# Rules: Visible Completion

1. A provider HTTP success or `finish_reason=stop` **MUST NOT** by itself mark an agent task complete.
2. A terminal turn **MUST** contain at least one outcome allowed by the task contract: visible text, tool/function call, structured output, or explicit intentional no-reply.
3. Reasoning/thinking-channel presence **MUST NOT** count as a user-visible deliverable unless the application explicitly defines that channel as an external artifact; hidden chain-of-thought **MUST NOT** be requested or exposed.
4. `length`, `max_tokens`, `incomplete`, or equivalent truncation reasons **MUST** be classified as incomplete, not successful completion.
5. Empty terminal turns **MUST** emit an observable warning/error classification.
6. Automatic empty-response recovery **MUST** have a finite retry cap; default maximum is 2.
7. A retry **SHOULD** change a recoverable condition or request a concise external answer; identical unmodified retries **MUST NOT** continue indefinitely.
8. Tool calls and structured outputs **MUST NOT** be rejected solely because visible text is empty.
9. Intentional silence **MUST** be represented as an explicit typed outcome rather than inferred from empty content.
10. Placeholder text such as `(No response generated)` **MUST NOT** convert an invalid empty terminal into success.
11. Completion checks **MUST** run before downstream delivery, persistence-as-success, task closure, or scheduler success reporting.
12. Recovery metrics **MUST** include retry count plus time/token cost when available.
13. After recovery is exhausted, the runtime **MUST** stop and surface an explicit failure with sanitized evidence.
14. Independent verification **MUST** include legitimate text, tool, structured, no-reply, empty-stop, and truncation cases.
