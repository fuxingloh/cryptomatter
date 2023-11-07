import { exec } from 'node:child_process';

export function getAuthorName(filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`git log -1 --pretty=format:"%ae" ${filepath}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
}
