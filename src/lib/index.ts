import { mkdir, stat } from 'node:fs/promises';

export async function createFolder(folderPath: string) {
  const folderExists = await stat(folderPath)
    .then(stats => stats.isDirectory())
    .catch(() => false);
  if (!folderExists) {
    await mkdir(folderPath, { recursive: true });
  }
}
