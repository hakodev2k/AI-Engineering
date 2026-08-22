# Review Budget Rules

- The system MUST distinguish sandbox/runtime initialization failure from a genuine permission-boundary request before automatic escalation.
- An automatic review MUST have a stable privacy-safe failure fingerprint.
- The system MUST NOT automatically re-review the same expected-in-sandbox failure fingerprint more than 3 times within 30 minutes.
- After the threshold, the system MUST block automatic escalation and require a sandbox-health check or human decision.
- A prior `allow` MUST NOT reset the repeated-failure counter when the same sandbox failure class persists.
- The system MUST NOT reuse an `allow` decision to bypass a new or broader permission boundary.
- Reviewer context MUST be bounded to the minimum operation, policy, failure evidence, and prior decision summary required for the decision.
- Secrets, raw credentials, unrelated transcript history, and unrelated tool output MUST NOT enter the fingerprint or review envelope.
- The system SHOULD emit counters for reviews/fingerprint, reviewer input tokens, breaker activations, and false blocks.
- A breaker MUST fail closed to human review, not silently execute outside the sandbox.
- Counters SHOULD reset only after verified in-sandbox success, explicit human reset, or expiry of the configured window.
- Changes MUST preserve existing least-privilege and approval boundaries.