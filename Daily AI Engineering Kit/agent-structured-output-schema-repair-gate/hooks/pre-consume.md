# Hook: Pre Consume

Trigger: before any downstream component consumes AI-generated structured output.

Preconditions: schema and raw output exist.

Action: run `python scripts/validate_output.py --input <payload> --schema <schema> --report <report>`.

Expected result: exit 0 and report status `valid`.

Failure behavior: block consumption; preserve report; hand to structured-output repair workflow.

Blocking: yes.
