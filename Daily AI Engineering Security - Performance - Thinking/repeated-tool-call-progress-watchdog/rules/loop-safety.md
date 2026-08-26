# Rules: Loop Safety
- Every autonomous tool loop MUST define observable progress before execution.
- A model statement such as "continuing" MUST NOT count as progress without external state evidence.
- Tool calls MUST be canonicalized before repeat detection; incidental IDs SHOULD be excluded only by explicit configuration.
- No-progress token and step budgets MUST be enforced outside the model loop.
- Recovery loops MUST be bounded to the configured maximum.
- Recovery MUST NOT weaken security controls, verification, or required context.
- A destructive or irreversible action MUST require its normal authorization even during recovery.
- Completion MUST NOT be reported while a blocking no-progress condition remains.
