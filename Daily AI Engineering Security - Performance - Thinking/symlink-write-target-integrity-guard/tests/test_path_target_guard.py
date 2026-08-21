import importlib.util, pathlib, tempfile, unittest, os

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "path_target_guard.py"
spec = importlib.util.spec_from_file_location("path_target_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class PathTargetGuardTests(unittest.TestCase):
    def test_normal_in_root_path_allowed(self):
        with tempfile.TemporaryDirectory() as td:
            root = pathlib.Path(td)
            target = root / "dir" / "new.txt"
            (root / "dir").mkdir()
            result = mod.evaluate(root, target, False)
            self.assertTrue(result["allowed"])

    @unittest.skipIf(os.name == "nt", "symlink creation may require Windows developer/admin mode")
    def test_outside_symlink_blocked(self):
        with tempfile.TemporaryDirectory() as td, tempfile.TemporaryDirectory() as outside:
            root = pathlib.Path(td)
            link = root / "link"
            link.symlink_to(pathlib.Path(outside), target_is_directory=True)
            result = mod.evaluate(root, link / "escape.txt", False)
            self.assertFalse(result["allowed"])
            self.assertIn("escapes approved root", result["reason"])

    @unittest.skipIf(os.name == "nt", "symlink creation may require Windows developer/admin mode")
    def test_in_root_symlink_requires_explicit_policy(self):
        with tempfile.TemporaryDirectory() as td:
            root = pathlib.Path(td)
            actual = root / "actual"
            actual.mkdir()
            link = root / "link"
            link.symlink_to(actual, target_is_directory=True)
            blocked = mod.evaluate(root, link / "file.txt", False)
            allowed = mod.evaluate(root, link / "file.txt", True)
            self.assertFalse(blocked["allowed"])
            self.assertTrue(allowed["allowed"])

if __name__ == "__main__":
    unittest.main()
