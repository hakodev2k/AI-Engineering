# Pre-Replay Hook

**Trigger:** immediately before the host invokes a broker-specific replay operation.

**Preconditions:** reviewed envelope, valid policy, target environment and approval identities recorded in the envelope.

**Action:**
```bash
python scripts/quarantine_gate.py validate-policy config/policy.json
python scripts/quarantine_gate.py verify-envelope --policy config/policy.json "$QUARANTINE_JSON"
```
Then compare the exact broker destination and payload/reference against the reviewed envelope before dispatch.

**Expected result:** both commands exit 0; payload hash/reference and destination match review; production approval exists; independent verifier requirement is satisfied.

**Failure behavior:** block replay. Never repair hashes or approval metadata automatically to make validation pass.

**Blocking:** yes.
