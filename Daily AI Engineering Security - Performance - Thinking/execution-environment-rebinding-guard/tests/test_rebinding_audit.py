import importlib.util, pathlib, unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "rebinding_audit.py"
spec = importlib.util.spec_from_file_location("rebinding_audit", MODULE)
ra = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(ra)

class RebindingAuditTests(unittest.TestCase):
    def test_family_detection(self):
        self.assertEqual(ra.family(r"D:\\repo"), "windows")
        self.assertEqual(ra.family("/mnt/d/repo"), "wsl")
        self.assertEqual(ra.family("/home/user/repo"), "posix")

    def test_within_windows_root(self):
        self.assertTrue(ra.within(r"D:\\repo\\src", [r"D:\\repo"]))
        self.assertFalse(ra.within(r"C:\\other", [r"D:\\repo"]))

    def test_walk_finds_nested_strings(self):
        rows = list(ra.walk({"thread":{"cwd":"/mnt/d/repo"}}))
        self.assertEqual(rows[0][0], "$.thread.cwd")
        self.assertEqual(rows[0][2], "/mnt/d/repo")

if __name__ == "__main__": unittest.main()
