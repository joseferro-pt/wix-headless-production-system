"""WHPS-COMPAT-008 site operator evidence contract validation; no Wix access."""
import copy,json,unittest
from pathlib import Path
from jsonschema import Draft202012Validator
BASE=Path(__file__).resolve().parents[1]
S=json.loads((BASE/"schemas/wix-astro7-site-evidence.schema.json").read_text())
R=json.loads((BASE/"examples/wix-astro7-evidence.synthetic.json").read_text())
GATES=[
"source-lock","wix-project-binding","wix-build","wix-preview","visitor-auth",
"member-auth","permission-denial","cms-read","business-app-read","react-hydration",
"tailwind-styling","accessibility","reserved-routes","seo-main","seo-item","wix-release"]
class SiteEvidenceSchemaTests(unittest.TestCase):
    def test_schema_and_fixture(self):
        Draft202012Validator.check_schema(S)
        self.assertFalse(list(Draft202012Validator(S).iter_errors(R)))
        self.assertEqual(set(x["id"] for x in R["checks"]),set(GATES))
        self.assertEqual(R["environment"],"dedicated-disposable-wix-test-site")
    def test_no_freeform_site_identity_or_credentials(self):
        doc=copy.deepcopy(R)
        doc["siteId"]="real-site-identifier"
        self.assertTrue(list(Draft202012Validator(S).iter_errors(doc)))
    def test_bad_gate_and_status_rejected(self):
        for field,value in (("id","arbitrary"),("status","verified-by-tool")):
            with self.subTest(field=field):
                doc=copy.deepcopy(R)
                doc["checks"][0][field]=value
                self.assertTrue(list(Draft202012Validator(S).iter_errors(doc)))
    def test_bad_stage_and_extra_version_rejected(self):
        doc=copy.deepcopy(R);doc["phase"]="production-approved"
        self.assertTrue(list(Draft202012Validator(S).iter_errors(doc)))
        doc=copy.deepcopy(R);doc["versions"]["wixSite"]="forbidden"
        self.assertTrue(list(Draft202012Validator(S).iter_errors(doc)))
if __name__=="__main__":
    unittest.main()
