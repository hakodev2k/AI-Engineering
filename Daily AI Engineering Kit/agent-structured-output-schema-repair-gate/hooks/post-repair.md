# Hook: Post Repair

Trigger: after each repaired candidate is generated.

Preconditions: raw hash and attempt number are preserved.

Action: rerun `scripts/validate_output.py`, compare findings, and pass final evidence to Verification Agent.

Expected result: all deterministic findings resolved without schema mutation.

Failure behavior: permit next repair only while total attempts < 2; otherwise block and escalate.

Blocking: yes.
