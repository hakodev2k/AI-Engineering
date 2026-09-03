# Containment Policy Rules

- The agent runtime MUST NOT be able to modify the active containment policy, monitor configuration, audit sink, or emergency-stop mechanism.
- Effective sandbox, network, monitor, and kill-path state MUST be attested before execution.
- A missing required attestation MUST block the run.
- A sandbox failure MUST NOT silently downgrade to unrestricted execution.
- Network-capable tools MUST NOT remain available when effective policy denies network access.
- Credential material MUST NOT be mounted into agent-executed processes unless explicitly required and independently approved.
- A tripwire match MUST block the triggering action and request emergency stop.
- Confirmed containment violations MUST NOT be auto-retried.
- Recovery after a confirmed violation MUST require human security approval.
- Monitoring SHOULD record policy version, event identity, decision, timestamp, and evidence hash.
