import os, tempfile, unittest
from pathlib import Path
from scripts.task_binding import create_binding, check_binding

class TaskBindingTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory(); self.path = Path(self.dir.name) / "registry.json"
        self.k1 = b"a" * 32; self.k2 = b"b" * 32
    def tearDown(self): self.dir.cleanup()
    def test_owner_allowed_cross_principal_denied(self):
        tid = create_binding(self.path, "tenantA:user1", self.k1)
        self.assertTrue(check_binding(self.path, tid, "tenantA:user1", self.k1))
        self.assertFalse(check_binding(self.path, tid, "tenantA:user2", self.k1))
        self.assertFalse(check_binding(self.path, tid, "tenantB:user1", self.k1))
    def test_unknown_task_denied(self):
        self.assertFalse(check_binding(self.path, "unknown", "tenantA:user1", self.k1))
    def test_wrong_key_denied(self):
        tid = create_binding(self.path, "tenantA:user1", self.k1)
        self.assertFalse(check_binding(self.path, tid, "tenantA:user1", self.k2))
if __name__ == "__main__": unittest.main()
