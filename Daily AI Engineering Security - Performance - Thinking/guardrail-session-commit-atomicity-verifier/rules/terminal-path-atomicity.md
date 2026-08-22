# Rules: Terminal Path Atomicity

1. Durable session state MUST NOT contain a function call without its corresponding terminal output unless the runtime explicitly marks that call as pending and unexecuted.
2. Durable session state MUST NOT contain an output referencing an unknown call ID.
3. A side-effecting tool that has executed MUST NOT be automatically replayed to repair missing state.
4. Every terminal run MUST record an explicit terminal reason such as success, guardrail_tripwire, guardrail_exception, max_turns, cancellation, or failure.
5. Streaming and non-streaming paths SHOULD produce equivalent normalized committed history for equivalent execution.
6. Rejected final output MUST NOT remain in durable history when policy requires withholding/redaction.
7. When a blocked terminal tool output is retained only for replay validity, the payload MUST follow the configured redaction policy.
8. Accepted prior turns MUST NOT be discarded to simplify current-turn repair.
9. Repair-on-read MUST NOT be treated as proof that stored history is valid.
10. Resume/replay MUST be blocked on unresolved structural integrity violations.
11. High-impact side-effect ambiguity MUST require human review.
12. The implementing agent MUST NOT be the only verifier of session-integrity changes.
