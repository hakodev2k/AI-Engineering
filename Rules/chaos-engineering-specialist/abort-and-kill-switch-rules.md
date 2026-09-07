# Abort and Kill-Switch Rules

## Purpose
Ensure every risky experiment can be stopped quickly when safety boundaries are breached.

## Scope
Applies to manual and automated termination controls, stop thresholds, fault cleanup, and operator authority.

## MUST
- Production experiments MUST define measurable abort conditions before execution.
- A tested kill switch MUST be available to stop fault injection independently of the experiment controller when practical.
- Operators MUST know who has authority to abort and how to invoke the mechanism.
- Abort actions MUST stop new fault application and initiate cleanup of injected state.

## MUST NOT
- Experiments MUST NOT rely solely on an untested cleanup path.
- Automation MUST NOT suppress or delay abort actions to preserve experiment completeness.
- An AI agent MUST NOT override a human stop decision.

## SHOULD
- Abort mechanisms SHOULD be simpler and more reliable than the experiment path they terminate.
- Critical experiments SHOULD automatically stop on SLO or correctness threshold breaches.

## Exceptions
If immediate automated termination is technically impossible, the plan requires compensating controls, reduced blast radius, documented recovery steps, and explicit human approval.

## Verification
Exercise the kill switch safely, inspect threshold configuration, validate cleanup behavior, and retain evidence of abort readiness before execution.