# Hooks: Prompt Injection Evidence Defense Gate

## PreIngest
**Trigger:** before external content is added to agent context.

**Action:** capture provenance and run deterministic scan.

**Command:**
```bash
python scripts/scan-untrusted-content.py --input "$SOURCE_FILE" --source-id "$SOURCE_ID" --source-type "$SOURCE_TYPE" --output "$SCAN_REPORT"
```

**Failure behavior:** fail closed. Retry once only for transient file I/O. Do not inject raw content into privileged context when scan fails.

## PostClassification
**Trigger:** after Trust Analyst completes the evidence manifest.

**Action:** validate manifest shape and policy constraints.

**Command:**
```bash
python scripts/validate-evidence-manifest.py --policy config/injection-policy.json --manifest "$MANIFEST"
```

**Failure behavior:** return for revision, maximum two semantic revisions; then stop.

## PreSideEffect
**Trigger:** before file writes, command execution, message send, secret access, deployment, infrastructure change, deletion, or other side effects.

**Action:** compute action gate from the verified manifest.

**Command:**
```bash
python scripts/compute-action-gate.py --policy config/injection-policy.json --manifest "$MANIFEST" --action "$ACTION_KIND"
```

**Failure behavior:** `block` prevents execution. `human-approval-required` pauses until explicit approval is attached by the host workflow. Script errors are treated as block, never allow.

## PreComplete
**Trigger:** before the agent declares the task verified.

**Action:** rerun manifest validation and ensure no unresolved high/critical finding remains.

**Command:**
```bash
python scripts/validate-evidence-manifest.py --policy config/injection-policy.json --manifest "$MANIFEST"
```

**Failure behavior:** completion may be reported as incomplete/blocked, but not verified.