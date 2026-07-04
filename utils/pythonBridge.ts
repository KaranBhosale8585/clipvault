import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import { logger } from "./logger";

const execPromise = promisify(exec);

export interface PythonBridgeResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  traceback?: string;
  debug?: unknown; // Extra diagnostic info
}

class ConcurrencyQueue {
  private activeCount = 0;
  private maxConcurrency = 2; // Keep it low to prevent CPU spikes and Instagram rate limiting
  private queue: (() => void)[] = [];

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.activeCount >= this.maxConcurrency) {
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }
    this.activeCount++;
    try {
      return await task();
    } finally {
      this.activeCount--;
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }
}

const executionQueue = new ConcurrencyQueue();

/**
 * Executes a Python script and returns the parsed JSON output.
 */
export async function runPythonScript<T>(
  scriptPath: string,
  args: string[] = [],
  extraEnv?: Record<string, string>
): Promise<PythonBridgeResponse<T>> {
  return executionQueue.run(async () => {
    const pythonExecutable = process.env.NODE_ENV === "production" ? "python3" : "python";
    const absoluteScriptPath = path.join(process.cwd(), scriptPath);
    const command = `${pythonExecutable} "${absoluteScriptPath}" ${args.map(arg => `"${arg}"`).join(" ")}`;

    const source = "python-bridge";

    try {
      const { stdout, stderr } = await execPromise(command, {
        env: {
          ...process.env,
          ...extraEnv,
        }
      });

      if (stderr) {
        await logger.warn(`Python script stderr: ${stderr}`, source);
      }

      try {
        const response: PythonBridgeResponse<T> = JSON.parse(stdout);
        return response;
      } catch {
        await logger.error(`Failed to parse Python output: ${stdout}`, source);
        return {
          success: false,
          error: "Malformed output from Python script",
        };
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const stack = error instanceof Error ? error.stack : undefined;
      await logger.error(`Python execution error: ${message}`, source, {
        command,
        stack,
      });
      return {
        success: false,
        error: message,
      };
    }
  });
}
