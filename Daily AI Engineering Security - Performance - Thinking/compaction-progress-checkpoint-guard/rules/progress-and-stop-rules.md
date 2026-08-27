# Rules: Progress and Stop Conditions

- A long-running task SHOULD write a structured checkpoint before compaction.
- Checkpoints MUST contain observable Facts, completed steps, pending steps, rejected hypotheses, and verification status.
- Checkpoints MUST NOT contain hidden chain-of-thought or secrets.
- Post-compaction execution MUST load the checkpoint before broad repository rescanning.
- Repeating the same action signature without a progress delta MUST count as no progress.
- Progress MUST be evidenced by a changed progress token, completed-step increase, new evidence ID, or explicit recovery-state transition.
- An agent MUST stop autonomous repetition after two no-progress windows.
- A rejected hypothesis MUST NOT be retried without new evidence.
- Dangerous or irreversible recovery actions MUST require explicit human approval.
- The implementation agent MUST NOT be the sole verifier of continuity behavior.
