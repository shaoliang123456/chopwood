import fs from 'fs';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';
const logFile = path.resolve(process.cwd(), 'server.log');

function writeToFile(level: string, ...args: unknown[]) {
  const msg = `[${level}] ${args
    .map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))
    .join(' ')}\n`;
  try {
    fs.appendFileSync(logFile, msg);
  } catch (e) {
    // ignore file write errors (e.g. in Vercel)
  }
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug('[DEBUG]', ...args);
      writeToFile('DEBUG', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info('[INFO]', ...args);
      writeToFile('INFO', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn('[WARN]', ...args);
    writeToFile('WARN', ...args);
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error('[ERROR]', ...args);
    writeToFile('ERROR', ...args);
  },
};
