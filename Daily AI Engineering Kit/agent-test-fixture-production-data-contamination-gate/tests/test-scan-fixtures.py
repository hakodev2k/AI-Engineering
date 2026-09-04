import importlib.util, json, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("scan",ROOT/"scripts"/"scan-fixtures.py"); scan=importlib.util.module_from_spec(spec); spec.loader.exec_module(scan)
CFG=json.loads((ROOT/"config"/"fixture-contamination.json").read_text())

class ScanTests(unittest.TestCase):
    def run_fixture(self,text,name="tests/fixtures/sample.json"):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/name; p.parent.mkdir(parents=True); p.write_text(text)
            return scan.scan_file(p,name,CFG)
    def test_private_key_blocks(self):
        f=self.run_fixture('-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----')
        self.assertTrue(any(x["severity"]=="blocking" and x["rule"]=="private_key" for x in f))
    def test_sensitive_key_blocks(self):
        f=self.run_fixture('{"access_token":"this-is-not-safe-value"}')
        self.assertTrue(any(x["rule"]=="sensitive_key_value" for x in f))
    def test_reserved_email_not_reported(self):
        f=self.run_fixture('{"email":"alice@example.com"}')
        self.assertFalse(any(x["rule"]=="email" for x in f))
    def test_real_looking_email_is_review(self):
        f=self.run_fixture('{"email":"alice@customer-domain.com"}')
        self.assertTrue(any(x["rule"]=="email" and x["severity"]=="review" for x in f))
    def test_documentation_ip_not_reported(self):
        f=self.run_fixture('{"ip":"203.0.113.8"}')
        self.assertFalse(any(x["rule"]=="ipv4" for x in f))

if __name__=="__main__": unittest.main()
