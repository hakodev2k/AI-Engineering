# Pre-task Hook

**Trigger:** before investigation or edits.

**Preconditions:** run from repository root with Python 3 available.

**Action:** confirm `config/policy.json` parses, the gate script exists, and unit tests pass: `python -m json.tool config/policy.json` then `python -m unittest discover -s tests -p 'test_*.py'`.

**Expected result:** both commands exit 0.

**Failure behavior:** capture stderr and stop. A failed pre-task hook blocks execution because later evidence would not be trustworthy. Transient environment/tool failures may be retried twice; validation/test failures are not blindly retried.
