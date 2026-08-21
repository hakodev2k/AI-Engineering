import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "scan-job-overlap.py"
spec = importlib.util.spec_from_file_location("scan_job_overlap", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class ScannerTests(unittest.TestCase):
    def test_flags_scheduler_with_side_effect(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "Job.cs").write_text(
                "RecurringJob.AddOrUpdate(\"x\", () => Run(), Cron.Minutely);\n"
                "async Task Run(){ await client.SendAsync(req); await db.SaveChangesAsync(); }",
                encoding="utf-8"
            )
            findings = mod.scan(root, {".cs"}, [])
            self.assertEqual(1, len(findings))
            self.assertIn("scheduler", findings[0]["signals"])
            self.assertIn("side_effect", findings[0]["signals"])

    def test_ignores_plain_domain_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "Domain.cs").write_text("public record Customer(int Id);", encoding="utf-8")
            self.assertEqual([], mod.scan(root, {".cs"}, []))

    def test_respects_ignore_paths(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            ignored = root / "obj"
            ignored.mkdir()
            (ignored / "Generated.cs").write_text("RecurringJob retry SaveChanges", encoding="utf-8")
            self.assertEqual([], mod.scan(root, {".cs"}, ["obj/"]))


if __name__ == "__main__":
    unittest.main()
