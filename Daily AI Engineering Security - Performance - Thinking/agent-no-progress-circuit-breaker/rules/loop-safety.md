# Rules: Autonomous Loop Safety

- Every autonomous step MUST emit a structured event before the next step starts.
- Progress MUST be tied to an observable state change, accepted evidence, or a fresh verification receipt; status text alone MUST NOT count as progress.
- The runner MUST enforce aggregate step and token budgets outside the model.
- The runner MUST fingerprint repeated action/target/result tuples and MUST stop when the configured repeat threshold is reached.
- A verification result MUST carry a receipt bound to the verified workspace/input state.
- An unchanged verification receipt repeated at the configured threshold MUST open the circuit.
- Circuit-open state MUST NOT be cleared by the same autonomous agent that triggered it.
- Recovery MUST have bounded retries; maximum two recovery attempts SHOULD be the default.
- Background workers MUST stop when the owning task is complete, cancelled, or circuit-open.
- A hard stop MUST preserve logs and reason codes and MUST NOT be converted into success.
- Implementers MUST NOT weaken security, correctness, or required verification merely to keep the loop running.
- An independent reviewer SHOULD verify any change to circuit thresholds or progress semantics.
