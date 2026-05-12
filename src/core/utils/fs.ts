import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export const fsUtils = {
  getPackageRoot(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // src/core/utils/fs.ts -> ../../.. -> root
    // dist/core/utils/fs.js -> ../../.. -> root
    return path.resolve(__dirname, '../../../');
  },

  async exists(targetPath: string): Promise<boolean> {
    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  },

  async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  },

  async createSymlink(src: string, dest: string): Promise<void> {
    await fs.ensureDir(path.dirname(dest));
    if (await this.exists(dest)) {
      await fs.remove(dest);
    }
    try {
      await fs.symlink(src, dest, 'dir');
    } catch (err: any) {
      // Fallback to copy if symlink fails (common on Windows without Dev Mode)
      if (err.code === 'EPERM' || err.code === 'EACCES') {
        await fs.copy(src, dest);
      } else {
        throw err;
      }
    }
  },

  async copyDir(src: string, dest: string): Promise<void> {
    if (await this.exists(dest)) {
      await fs.remove(dest);
    }
    await fs.copy(src, dest);
  },

  async removeDir(targetPath: string): Promise<void> {
    if (await this.exists(targetPath)) {
      await fs.remove(targetPath);
    }
  },

  async readJson<T>(filePath: string): Promise<T> {
    return fs.readJson(filePath);
  },

  async isSymlink(targetPath: string): Promise<boolean> {
    try {
      const stats = await fs.lstat(targetPath);
      return stats.isSymbolicLink();
    } catch {
      return false;
    }
  },

  async getDirectories(source: string): Promise<string[]> {
    if (!(await this.exists(source))) return [];
    const entries = await fs.readdir(source, { withFileTypes: true });
    return entries
      .filter(dirent => dirent.isDirectory() || dirent.isSymbolicLink())
      .map(dirent => dirent.name);
  },

  async readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  },

  async writeFile(filePath: string, content: string): Promise<void> {
    const tmpPath = `${filePath}.tmp`;
    await fs.writeFile(tmpPath, content, 'utf-8');
    await fs.rename(tmpPath, filePath);
  },

  async copy(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest);
  }
};
