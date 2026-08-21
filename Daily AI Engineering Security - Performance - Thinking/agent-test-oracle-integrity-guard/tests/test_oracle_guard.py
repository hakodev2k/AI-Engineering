import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "oracle_guard.py"
spec = importlib.util.spec_from_file_location("oracle_guard", SCRIPT)
oracle_guard = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(oracle_guard)

POLICY = {
    "protected_globs": ["tests/**", ".github/workflows/**"],
    "weakening_patterns": ["pytest.mark.skip", "continue-on-error: true"],
    "approval_required_for_protected_changes": True,
    "fail_on_deleted_tests": True,
}


def audit(diff: str, approved=None):
    files = oracle_guard.parse_diff(diff)
    return oracle_guard.audit(files, POLICY, set(approved or []))


class OracleGuardTests(unittest.TestCase):
    def test_source_only_change_passes(self):
        diff = """diff --git a/src/a.py b/src/a.py
--- a/src/a.py
+++ b/src/a.py
@@
-old
+new
"""
        result = audit(diff)
        self.assertEqual(0, result["finding_count"])

    def test_unapproved_test_change_blocked(self):
        diff = """diff --git a/tests/test_a.py b/tests/test_a.py
--- a/tests/test_a.py
+++ b/tests/test_a.py
@@
-assert x == 1
+assert x == 2
"""
        result = audit(diff)
        self.assertTrue(any(f["code"] == "UNAPPROVED_ORACLE_CHANGE" for f in result["findings"]))

    def test_approved_test_change_removes_only_approval_finding(self):
        diff = """diff --git a/tests/test_a.py b/tests/test_a.py
--- a/tests/test_a.py
+++ b/tests/test_a.py
@@
-assert x == 1
+assert x == 2
"""
        result = audit(diff, ["tests/test_a.py"])
        self.assertFalse(any(f["code"] == "UNAPPROVED_ORACLE_CHANGE" for f in result["findings"]))

    def test_skip_addition_detected_even_if_approved(self):
        diff = """diff --git a/tests/test_a.py b/tests/test_a.py
--- a/tests/test_a.py
+++ b/tests/test_a.py
@@
+@pytest.mark.skip(reason="later")
 def test_a():
     assert True
"""
        result = audit(diff, ["tests/test_a.py"])
        self.assertTrue(any(f["code"] == "WEAKENING_PATTERN_ADDED" for f in result["findings"]))

    def test_assertion_decrease_detected(self):
        diff = """diff --git a/tests/test_a.py b/tests/test_a.py
--- a/tests/test_a.py
+++ b/tests/test_a.py
@@
-assert x == 1
-assert y == 2
+assert x == 1
"""
        result = audit(diff, ["tests/test_a.py"])
        self.assertTrue(any(f["code"] == "ASSERTION_COUNT_DECREASED" for f in result["findings"]))

    def test_deleted_protected_file_detected(self):
        diff = """diff --git a/tests/test_a.py b/tests/test_a.py
deleted file mode 100644
--- a/tests/test_a.py
+++ /dev/null
@@
-def test_a():
-    assert True
"""
        result = audit(diff, ["tests/test_a.py"])
        self.assertTrue(any(f["code"] == "PROTECTED_FILE_DELETED" for f in result["findings"]))

    def test_ci_continue_on_error_detected(self):
        diff = """diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@
+    continue-on-error: true
"""
        result = audit(diff, [".github/workflows/ci.yml"])
        self.assertTrue(any(f["code"] == "WEAKENING_PATTERN_ADDED" for f in result["findings"]))

    def test_test_declaration_decrease_detected(self):
        diff = """diff --git a/tests/test_a.py b/tests/test_a.py
--- a/tests/test_a.py
+++ b/tests/test_a.py
@@
-def test_a():
-    assert True
 def test_b():
     assert True
"""
        result = audit(diff, ["tests/test_a.py"])
        self.assertTrue(any(f["code"] == "TEST_DECLARATION_COUNT_DECREASED" for f in result["findings"]))


if __name__ == "__main__":
    unittest.main()
