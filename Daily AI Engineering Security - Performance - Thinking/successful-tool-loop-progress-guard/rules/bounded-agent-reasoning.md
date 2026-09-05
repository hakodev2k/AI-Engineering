# Bounded Agent Reasoning Rules

1. Long-running tool workflows **MUST** define observable completion criteria and progress markers.
2. A successful tool response **MUST NOT** be treated as task progress by itself.
3. Repeated action/target/result signatures **MUST** be evaluated against progress state.
4. Recovery **MUST** change an observable dimension such as hypothesis, query, tool, target, or subgoal.
5. The same failed recovery strategy **MUST NOT** be retried indefinitely.
6. A stalled subgoal **MUST** have a local stop condition in addition to any global iteration/time limit.
7. Recovery attempts **MUST** be bounded to two before escalation/stop unless a human explicitly authorizes a new plan.
8. Conclusions **MUST** cite observable evidence and verification status; successful calls alone **MUST NOT** justify completion.
9. Facts, assumptions, hypotheses, and decisions **SHOULD** be represented separately in workflow outputs.
10. Hidden chain-of-thought **MUST NOT** be requested, persisted, or used as a detector input.
11. The implementation agent **MUST NOT** be the only verifier for completion after loop recovery.
12. Increasing a global iteration limit **MUST NOT** be the sole fix for a confirmed non-progress cycle.