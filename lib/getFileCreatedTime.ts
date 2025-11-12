import {execSync} from "node:child_process";

export function getCreatedTime(filePath: string): number {
    try {
        const timestamp = execSync(
            `git log --follow --format=%at -- "${filePath}" | tail -1`,
            {encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe']}
        ).trim();

        if (!timestamp) {
            return Date.now();
        }

        return parseInt(timestamp, 10) * 1000; // Convert to milliseconds
    } catch (error) {
        // If git command fails, return current time
        return Date.now();
    }
}