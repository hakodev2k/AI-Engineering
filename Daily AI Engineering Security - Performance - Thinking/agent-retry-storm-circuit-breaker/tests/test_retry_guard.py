import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "retry_guard.py"
spec = importlib.util.spec_from_file_location("retry_guard", SCRIPT)
retry_guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(retry_guard)

POLICY = {
    "max_attempts_per_operation": 4,
    "max_retries_per_run": 12,
    "max_retry_elapsed_seconds_per_operation": 120,
    "max_no_progress_duplicates": 2,
    "max_estimated_retry_tokens_per_operation": 20000,
    "base_backoff_ms": 500,
    "max_backoff_ms": 15000,
    "full_jitter": True,
    "retryable_classes": ["timeout", "throttle", "transient_network", "temporary_unavailable"],
    "non_retryable_classes": ["permission_denied", "invalid_input", "auth_failed", "policy_denied", "schema_error"],
    "side_effecting_operation_types": ["write", "delete", "payment", "send", "deploy", "publish"],
    "require_idempotency_key_for_side_effect_retry": True,
}


def op(failure="timeout", operation_type="read", args=None, key=None):
    return {"tool":"repo","operation_type":operation_type,"resource":"x","arguments":args or {"path":"a"},"failure_class":failure,"idempotency_key":key}


def state(**kwargs):
    x={"attempts":0,"run_retries":0,"retry_elapsed_seconds":0,"estimated_retry_tokens":0,"no_progress_duplicates":0,"circuit":"CLOSED"}
    x.update(kwargs); return x


class RetryGuardTests(unittest.TestCase):
    def test_fingerprint_stable_for_key_order(self):
        a=op(args={"x":1,"y":2}); b=op(args={"y":2,"x":1})
        self.assertEqual(retry_guard.fingerprint(a), retry_guard.fingerprint(b))

    def test_fingerprint_changes_with_material_args(self):
        self.assertNotEqual(retry_guard.fingerprint(op(args={"path":"a"})), retry_guard.fingerprint(op(args={"path":"b"})))

    def test_transient_retries_within_budget(self):
        r=retry_guard.decide(op("timeout"), state(), POLICY, seed=1)
        self.assertEqual("retry", r["decision"]); self.assertGreaterEqual(r["delay_ms"],0)

    def test_permission_denied_fails_fast(self):
        r=retry_guard.decide(op("permission_denied"), state(), POLICY)
        self.assertEqual("fail_fast", r["decision"])

    def test_unknown_failure_not_retried(self):
        r=retry_guard.decide(op("mystery"), state(), POLICY)
        self.assertEqual("fail_fast", r["decision"])

    def test_attempt_budget_opens_circuit(self):
        r=retry_guard.decide(op(), state(attempts=4), POLICY)
        self.assertEqual("open_circuit", r["decision"]); self.assertEqual("attempt_budget_exhausted", r["reason"])

    def test_no_progress_budget_opens_circuit(self):
        r=retry_guard.decide(op(), state(no_progress_duplicates=2), POLICY)
        self.assertEqual("no_progress_duplicate_budget_exhausted", r["reason"])

    def test_token_budget_opens_circuit(self):
        r=retry_guard.decide(op(), state(estimated_retry_tokens=20000), POLICY)
        self.assertEqual("token_budget_exhausted", r["reason"])

    def test_run_budget_opens_circuit(self):
        r=retry_guard.decide(op(), state(run_retries=12), POLICY)
        self.assertEqual("run_retry_budget_exhausted", r["reason"])

    def test_elapsed_budget_opens_circuit(self):
        r=retry_guard.decide(op(), state(retry_elapsed_seconds=120), POLICY)
        self.assertEqual("elapsed_budget_exhausted", r["reason"])

    def test_side_effect_without_idempotency_requires_approval(self):
        r=retry_guard.decide(op(operation_type="payment"), state(), POLICY)
        self.assertEqual("human_approval_required", r["decision"])

    def test_side_effect_with_idempotency_can_retry(self):
        r=retry_guard.decide(op(operation_type="payment", key="stable-123"), state(), POLICY, seed=2)
        self.assertEqual("retry", r["decision"])

    def test_open_circuit_never_retries(self):
        r=retry_guard.decide(op(), state(circuit="OPEN"), POLICY)
        self.assertEqual("open_circuit", r["decision"])

if __name__ == "__main__": unittest.main()