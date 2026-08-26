# Prompt Injection Testing

## Purpose
Evaluate whether untrusted instructions can subvert intended system behavior.

## Scope
Direct prompts, retrieved content, files, webpages, messages, tool outputs, and multimodal inputs.

## MUST
- Test direct and indirect injection across every untrusted-input boundary relevant to the system.
- Evaluate whether injections alter policy, authorization, tool use, data access, or output integrity.
- Preserve reproducible payloads and system context for confirmed findings.

## MUST NOT
- Declare resistance based only on a small set of known jailbreak strings.
- Conflate model refusal with protection of downstream tools or secrets.

## SHOULD
Include obfuscation, instruction conflicts, context nesting, encoded content, and multi-turn attacks when applicable.

## Exceptions
Excluded input channels require documented evidence that they are unreachable or out of scope.

## Verification
Replay representative attacks against controlled builds and verify both model behavior and downstream side effects.