import importlib.util
import pathlib
import unittest

MODULE_PATH = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "validate_memory_record.py"
spec = importlib.util.spec_from_file_location("validate_memory_record", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(mod)


def base_record():
    return {
        "memory_id": "m1",
        "tenant_id": "tenant-a",
        "source_type": "user",
        "source_id": "turn-1",
        "created_at": "2026-08-20T09:00:00+07:00",
        "authority": "user-assertion",
        "validation_status": "unverified",
        "lineage_id": "l1",
        "parent_memory_ids": [],
        "content": "User says they prefer concise answers"
    }


class MemoryRecordValidatorTests(unittest.TestCase):
    def test_valid_user_assertion(self):
        self.assertEqual([], mod.validate(base_record()))

    def test_user_cannot_directly_create_operator_policy(self):
        r = base_record()
        r["authority"] = "operator-policy"
        r["validation_status"] = "confirmed"
        r["confirmed_by"] = "operator-1"
        errors = mod.validate(r)
        self.assertTrue(any("cannot directly create operator-policy" in e for e in errors))

    def test_policy_requires_confirmation(self):
        r = base_record()
        r["source_type"] = "operator"
        r["authority"] = "operator-policy"
        r["validation_status"] = "validated"
        errors = mod.validate(r)
        self.assertTrue(any("requires validation_status=confirmed" in e for e in errors))

    def test_duplicate_parent_ids_rejected(self):
        r = base_record()
        r["parent_memory_ids"] = ["x", "x"]
        self.assertTrue(any("unique string array" in e for e in mod.validate(r)))


if __name__ == "__main__":
    unittest.main()
