# Rules: Progress-Aware Loop Control

- Every repeated autonomous cycle MUST carry a deterministic `state_id`.
- A loop detector MUST NOT classify a cycle as stagnant solely because tool names or command text repeat.
- A state transition MUST reset the stagnant-repeat counter.
- A verification result MUST be bound to the exact state it verified.
- A fresh green verification for an unchanged state SHOULD be reused until that state changes or its policy-defined freshness expires.
- Required security or correctness verification MUST NOT be skipped after a state change.
- Every retry loop MUST have a finite maximum retry count.
- Terminal task states MUST stop autonomous work immediately.
- Free-form model statements such as "still working" MUST NOT count as proof of progress.
- Any automatic stop MUST emit observable reason codes and the last state ID.
