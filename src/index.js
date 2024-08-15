import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
    try {
        const token = core.getInput('GITHUB_TOKEN', { required: true });
        const owner = core.getInput('owner', { required: true });
        const repo = core.getInput('repo', { required: true });
        const prNumber = core.getInput('prNumber', { required: true });
        const buildSuccess = core.getBooleanInput('buildSuccess', { required: true });

        const octokit = github.getOctokit(token);

        if (!buildSuccess) {
            await octokit.rest.issues.createComment({
                owner,
                repo,
                issue_number: parseInt(prNumber, 10),
                body: `
                    🔴 Build Error Detected\n
                    Please resolve the build errors 😣\n\n
                    - Renz.
                `,
            });
            return; // Exit early if there's a build error
        }

        const { data: changedFiles } = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: parseInt(prNumber, 10),
        });

        let diffData = {
            added: 0,
            changes: 0,
            removed: 0,
        };

        diffData = changedFiles.reduce((acc, file) => {
            acc.added += file.additions;
            acc.changes += file.changes;
            acc.removed += file.deletions;
            return acc;
        }, diffData);

        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: parseInt(prNumber, 10),
            body: `
                🟢 Pull Request #${prNumber} has been updated with: \n
                - ${diffData.added} additions\n
                - ${diffData.changes} changes\n
                - ${diffData.removed} deletions\n\n

                Thank you for submitting your Pull Request! I will try to review it as soon as possible. 👍😊\n
                - Renz
            `,
        });

        for (const file of changedFiles) {
            const fileExtension = file.filename.split('.').pop();
            let label = '';
            switch (fileExtension) {
                case 'js':
                case 'ts':
                    label = 'javascript';
                    break;
                case 'css':
                    label = 'css';
                    break;
                case 'html':
                    label = 'html';
                    break;
                case 'json':
                    label = 'json';
                    break;
                case 'md':
                    label = 'markdown';
                    break;
                case 'yml':
                case 'yaml':
                    label = 'yaml';
                    break;
                default:
                    label = 'other';
            }

            await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: parseInt(prNumber, 10),
                labels: [label],
            });
        }

    } catch (error) {
        core.setFailed(`Action failed with error - : ${error.message}`);
    }
}

run();
