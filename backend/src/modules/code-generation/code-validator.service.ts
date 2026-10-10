import {execFile} from "node:child_process"
import {mkdtemp, rm, writeFile } from "node:fs/promises" 
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile);

export interface CodeValidationResult{
    valid:boolean,
    errors:string[]
}

export class CodeValidatorService {
  async validateJava( code: string ): Promise<CodeValidationResult> {
    const directory = await mkdtemp(
      path.join(tmpdir(), 'reel-java-'),
    );

    try {
      await writeFile(
        path.join(directory, 'Main.java'),
        code,
        'utf8',
      );

      await execFileAsync('javac', ['Main.java'],
        {
          cwd: directory,
          timeout: 10_000,
          maxBuffer: 1024 * 1024,
        },
      );

      return {
        valid: true,
        errors: [],
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        valid: false,
        errors: [message],
      };
    } finally {
      await rm(directory, {
        recursive: true,
        force: true,
      });
    }
  }
}