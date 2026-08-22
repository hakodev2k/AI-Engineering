# Replay Quarantined Message

## Purpose
Replay a corrected or proven-safe quarantined message exactly once, with approval and independent verification.

## Inputs / preconditions
Verified envelope, root-cause/correction evidence, target environment, approver identity, verifier identity, broker-specific replay command owned by the host repository.

## Constraints
Production replay always requires explicit human approval. Approver and verifier must differ when policy requires independent verification. This skill never invents broker commands.

## Procedure
1. Run `verify-envelope`; stop on any integrity failure.
2. Confirm the underlying defect/configuration/contract issue is corrected or the replay rationale is documented.
3. Confirm target environment is allowed and destination is the intended queue/topic.
4. Confirm payload hash matches the reviewed artifact/reference.
5. Obtain explicit approval before production replay; record approver and environment.
6. Have an independent verifier confirm steps 1–5.
7. Materialize the exact broker replay request and inspect it before execution.
8. Execute once. Never auto-repeat a failed replay.
9. Record outcome as `succeeded` or `failed`, relevant broker receipt/message ID, and downstream verification evidence.
10. Verify expected side effect exactly once where observable.

## Failure handling
Permission/tool failure: stop. Replay failure: retain evidence and return to investigation; zero automatic retries. Integrity or destination mismatch: block replay.

## Expected output / completion
A replay record with approval, independent verification, exact destination, execution receipt, and verified outcome. Completion requires downstream evidence, not merely broker acceptance.
