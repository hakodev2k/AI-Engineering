import unittest
from scripts.verification_receipt import make_receipt, validate

class ReceiptTests(unittest.TestCase):
    def test_fresh_green_satisfies(self):
        r=make_receipt('abc','pytest',['b.py','a.py'],0,'ok',timestamp=100)
        v=validate(r,'abc','pytest',['a.py','b.py'],max_age_seconds=100,now=150)
        self.assertTrue(v['ok']); self.assertEqual(v['status'],'satisfied')
    def test_head_change_invalidates(self):
        r=make_receipt('abc','pytest',['a.py'],0,'ok',timestamp=100)
        self.assertFalse(validate(r,'def','pytest',['a.py'],100,150)['ok'])
    def test_scope_change_invalidates(self):
        r=make_receipt('abc','pytest',['a.py'],0,'ok',timestamp=100)
        self.assertFalse(validate(r,'abc','pytest',['a.py','b.py'],100,150)['ok'])
    def test_failed_run_not_valid(self):
        r=make_receipt('abc','pytest',['a.py'],1,'fail',timestamp=100)
        self.assertIn('verification_failed',validate(r,'abc','pytest',['a.py'],100,150)['reasons'])
    def test_expiry_invalidates(self):
        r=make_receipt('abc','pytest',['a.py'],0,'ok',timestamp=100)
        self.assertIn('receipt_expired',validate(r,'abc','pytest',['a.py'],10,150)['reasons'])

if __name__=='__main__': unittest.main()
