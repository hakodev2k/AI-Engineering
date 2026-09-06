# Approval Boundary Rules

1. Agent-originated shell or interpreter execution MUST be evaluated before execution when the command can produce filesystem, process, network, credential, package, repository, or deployment side effects.
2. Authorization MUST NOT rely only on the outer tool name or literal wrapper command when that command executes a local script, inline program, package runner, or secondary interpreter.
3. Referenced local scripts under inspectable trusted roots MUST be resolved and inspected before approval.
4. Script paths that resolve outside configured trusted roots MUST be classified as `review` or `block` according to policy; they MUST NOT be silently trusted.
5. Commands containing known destructive primitives MUST be blocked unless an explicitly configured policy routes that exact class to human review.
6. Ambiguous dynamic execution such as `eval`, remote code piped into an interpreter, opaque encoded commands, or unresolved command substitution MUST NOT be auto-approved.
7. A prior approval for an outer wrapper MUST NOT automatically authorize materially different script contents. Script content SHOULD be bound to the decision using a digest.
8. A script changed after inspection MUST be re-evaluated before execution.
9. Policy evaluation failure, malformed input, unreadable referenced scripts, or incomplete resolution of a high-risk chain MUST fail closed.
10. The guard MUST NOT replace OS sandboxing, least privilege, repository protection, network restrictions, or human approval for irreversible actions.
11. The guard MUST emit a structured decision containing findings and reason codes without exposing secrets.
12. Implementing agents MUST NOT be the sole verifier for changes to approval policy or bypass logic.
