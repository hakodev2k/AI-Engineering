# Hook: Post Agent Step
## Trigger
After every autonomous model/tool/approval step and before the next autonomous iteration.
## Preconditions
The runtime has appended the step to a normalized JSONL trace with iteration, action, signature, input/output tokens, and progress delta.
## Action
Run:
```bash
python scripts/loop_budget_guard.py --trace <trace.jsonl> --policy config/budget.json
```
## Expected result
Exit `0` permits another iteration. Exit `3` means stop the autonomous loop and surface the reason to the caller.
## Failure behavior
Invalid trace/policy (exit `2`) also blocks continuation until fixed. The runtime MUST preserve partial task state and MUST NOT mark the task complete.
## Blocking
Yes.