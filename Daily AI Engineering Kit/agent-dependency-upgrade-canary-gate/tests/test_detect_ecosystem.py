import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "detect-ecosystem.py"
spec = importlib.util.spec_from_file_location("detect_ecosystem", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class DetectEcosystemTests(unittest.TestCase):
    def test_detects_dotnet_and_npm_and_ignores_build_folders(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src").mkdir()
            (root / "src" / "App.csproj").write_text("<Project />", encoding="utf-8")
            (root / "package.json").write_text("{}", encoding="utf-8")
            (root / "node_modules").mkdir()
            (root / "node_modules" / "ignored.csproj").write_text("x", encoding="utf-8")
            found = module.discover(root)
            self.assertIn("src/App.csproj", found["dotnet"])
            self.assertIn("package.json", found["npm"])
            self.assertNotIn("node_modules/ignored.csproj", found["dotnet"])

    def test_empty_repository_returns_empty_groups(self):
        with tempfile.TemporaryDirectory() as tmp:
            found = module.discover(Path(tmp))
            self.assertTrue(all(not files for files in found.values()))


if __name__ == "__main__":
    unittest.main()
