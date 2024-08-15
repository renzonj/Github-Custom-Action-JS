
# CUSTOM GITHUB ACTION (JS)

## Tagging and Publishing

To tag and publish a new version of your custom action, use the following commands:

```bash
git tag v3.0
npm run build  /  npm i -g @vercel/ncc
git push && git push --tags
```

## Sample Usage

Here’s an example of how to use the `Github-Custom-Action-JS` in a GitHub workflow:

```yml
name: Pull Request Checker

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run custom action
        uses: renzonj/Github-Custom-Action-JSv3
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
          prNumber: ${{ github.event.pull_request.number }}
```

## Important Notes

- Ensure that the token provided in `GITHUB_TOKEN` has **read and write** access to the repository. This is required for the action to comment on pull requests and add labels.
- The repository must have Workflow permissions set to **Read and write permissions**. You can configure this in your repository settings under **Settings > Actions > General > Workflow permissions**.
