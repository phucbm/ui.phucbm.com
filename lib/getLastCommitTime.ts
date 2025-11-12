import {execSync} from 'node:child_process';

export function getLastCommitTime(filePath: string): number {
    try {
        const timestamp = execSync(
            `git log -1 --format=%at -- "${filePath}"`,
            {encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe']}
        ).trim();

        if (!timestamp) {
            return Date.now();
        }

        return parseInt(timestamp, 10) * 1000; // Convert to milliseconds
    } catch (error) {
        // If git command fails (e.g., not in a git repo), return current time
        return Date.now();
    }
}

// Example usage:
// const time = getLastCommitTime('content/components/text-ripple.mdx');
// console.log('Last commit time:', new Date(time).toISOString());