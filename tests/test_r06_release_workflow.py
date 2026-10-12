"""Offline governance checks for release publication contract (no GitHub writes)."""
import unittest
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]


class ReleaseWorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.text = (ROOT / '.github/workflows/publish-release.yml').read_text(encoding='utf8')
        # BaseLoader preserves the 'on' key as a string.
        cls.workflow = yaml.load(cls.text, Loader=yaml.BaseLoader)

    def test_owner_dispatch_only_and_scoped_write_permission(self):
        workflow = self.workflow
        self.assertEqual(set(workflow['on']), {'workflow_dispatch'})
        self.assertEqual(workflow['permissions'], {'contents': 'read'})
        inputs = workflow['on']['workflow_dispatch']['inputs']
        self.assertEqual(set(inputs), {'version', 'source_sha', 'approval'})
        self.assertTrue(all(x['required'] == 'true' for x in inputs.values()))
        self.assertEqual(workflow['jobs']['publish']['permissions'], {
            'contents': 'write', 'actions': 'read'
        })

    def test_preflight_requires_exact_source_and_ci_codeql(self):
        text = self.text
        for required in [
            'PUBLISH-$RELEASE_TAG', 'refs/heads/main',
            '$GITHUB_SHA', 'main moved after approval',
            'validate.yml codeql.yml', 'head_sha==$sha',
            'check-release-readiness.mjs --release',
            'scripts/check-repository-boundary.mjs',
            'scripts/plan-wix-resources.mjs',
            'schemas/resource-plan-output.schema.json',
            'bootstrap-site-workspace.mjs',
            "lock['toolkitSource']['commit']",
        ]:
            with self.subTest(required=required):
                self.assertIn(required, text)

    def test_immutable_tag_and_release_independently_verified(self):
        text = self.text
        for required in [
            'git/tags', 'git/refs', 'object.sha==$sha',
            'object.type=="tag"', 'gh release create',
            'gh api "$RELEASE_PATH"', 'draft==false', 'prerelease==false',
            'Existing release: verify without modifying',
            'not treating API error as absence',
        ]:
            with self.subTest(required=required):
                self.assertIn(required, text)
        self.assertNotIn('git push --force', text)


if __name__ == '__main__':
    unittest.main()
