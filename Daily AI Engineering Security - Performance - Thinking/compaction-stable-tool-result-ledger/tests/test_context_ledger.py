import tempfile, unittest
from pathlib import Path
from scripts.context_ledger import ingest, load_ledger, project

class LedgerTests(unittest.TestCase):
    def test_duplicate_not_reinserted(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"ledger.jsonl"; ev={"tool":"read_file","source":"a.py","args":{"path":"a.py"},"content":"abc","summary":"file a","relevance":1}
            self.assertEqual(ingest(p,ev)["status"],"inserted")
            self.assertEqual(ingest(p,ev)["status"],"duplicate")
            self.assertEqual(len(load_ledger(p)),1)
    def test_secret_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(ValueError): ingest(Path(d)/"l",{"tool":"x","source":"s","summary":"x","secret":True})
    def test_projection_dedups_and_budgets(self):
        rows=[{"fingerprint":"a","tool":"read","source":"f","summary":"OLD","relevance":0.9,"freshness_epoch":1,"raw_chars":1000},{"fingerprint":"a","tool":"read","source":"f","summary":"NEW","relevance":0.9,"freshness_epoch":2,"raw_chars":1000},{"fingerprint":"b","tool":"search","source":"q","summary":"B","relevance":0.1,"freshness_epoch":2,"raw_chars":500}]
        r=project(rows,max_chars=300,min_relevance=0.25,max_entries=5,max_summary_chars=50)
        self.assertEqual(r["unique_entries"],2); self.assertEqual(len(r["entries"]),1); self.assertEqual(r["entries"][0]["summary"],"NEW"); self.assertLessEqual(r["projection_chars"],300)
if __name__=="__main__": unittest.main()
