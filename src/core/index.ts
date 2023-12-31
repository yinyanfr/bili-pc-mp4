import { createReadStream } from 'node:fs';
import { readFile, readdir, rm, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { ffmpeg } from 'eloquent-ffmpeg';
import { Transform } from 'node:stream';
import { createFolder } from '../lib';
import sanitize from 'sanitize-filename';
import ora from 'ora';

const TMPDIR = join(__dirname, '..', 'tmp');

/**
 * Removes temporary files and folders.
 * @returns {Promise<void>} A promise that resolves when temporary files are removed.
 */
export async function removeTmpFiles() {
  await rm(TMPDIR, { recursive: true, force: true });
}

/**
 * Reads and analyzes the information from a task folder.
 * @param {string} taskPath - The path to the task folder.
 * @returns {Promise<Task>} A promise that resolves to the analyzed task.
 */
async function analyseTask(taskPath: string): Promise<Task> {
  const pathStats = await stat(taskPath);
  if (!pathStats.isDirectory()) {
    throw new Error('Path is not a directory.');
  }
  const id = basename(taskPath);
  const ls = await readdir(taskPath);
  const videoFiles = ls
    .filter(e => e.match(/\.m4s$/))
    .filter(e => !e.match(/^\./));
  const danmuFiles = ls.filter(e => e.match(/^dm[0-9]+/));
  try {
    const videoInfoReader = await readFile(join(taskPath, '.videoInfo'));
    const videoInfo: VideoInfo = JSON.parse(videoInfoReader.toString());
    const { groupTitle, title, p, uname, status } = videoInfo;
    return {
      id,
      groupTitle,
      title,
      p,
      uname,
      status,
      videoFiles,
      danmuFiles,
      dirPath: taskPath,
    };
  } catch {
    return {
      id,
      status: 'completed',
      videoFiles,
      danmuFiles,
      dirPath: taskPath,
    };
  }
}

/**
 * Analyzes a folder containing tasks and returns an array of analyzed tasks.
 * @param {string} dirPath - The path to the folder containing tasks.
 * @returns {Promise<Task[]>} A promise that resolves to an array of analyzed tasks.
 */
async function analyseFolder(dirPath: string): Promise<Task[]> {
  const ls = await readdir(dirPath);
  if (ls.find(e => e.match(/\.m4s$/))) {
    const task = await analyseTask(dirPath);
    return [task];
  } else {
    const taskAnalysers = ls.map(e => analyseTask(join(dirPath, e)));
    const queue = await Promise.allSettled(taskAnalysers);
    return queue
      .filter(e => e.status === 'fulfilled')
      .map(e => (e as PromiseFulfilledResult<Task>).value);
  }
}

/**
 * Creates a decrypted buffer from a file.
 * @param {string} filePath - The path to the file to be decrypted.
 * @param {number} [bufferSize=65536] - The size of the buffer for reading the file.
 * @returns {ReadStream} A readable stream containing the decrypted file content.
 */
function decryptedBuffer(filePath: string, bufferSize = 64 * 1024) {
  const readStream = createReadStream(filePath, { highWaterMark: bufferSize });
  let isFirstChunk = true;

  /**
   * Bilibili adds 9 bytes of trash data in the downloaded files
   */
  const decryption = new Transform({
    transform(chunk, _, callback) {
      if (isFirstChunk) {
        isFirstChunk = false;
        this.push(chunk.slice(9));
      } else {
        this.push(chunk);
      }
      callback();
    },
  });

  return readStream.pipe(decryption);
}

/**
 * Processes video files by combining and saving them into an output video.
 * @param {string[]} videoFiles - An array of paths to video files.
 * @param {string} outputPath - The path where the output video will be saved.
 * @param {TaskOptions} options - Options for processing the video.
 * @throws {Error} Throws an error if no video files are provided.
 * @returns {Promise<void>} A promise that resolves when the video processing is complete.
 */
async function processVideo(
  videoFiles: string[],
  outputPath: string,
  options: TaskOptions = {},
) {
  if (!videoFiles?.length) {
    throw new Error('No video files.');
  }

  const { bufferSize } = options;
  const ffmpegCmd = ffmpeg({ overwrite: true });
  videoFiles.forEach(e => {
    ffmpegCmd.input(decryptedBuffer(e, bufferSize));
  });
  ffmpegCmd.output(outputPath).audioCodec('copy').videoCodec('copy');
  const worker = await ffmpegCmd.spawn();
  await worker.complete();
}

/**
 * Processes a task by decrypting video files, combining them, and generating an output file.
 * @param {Task} task - The task object containing information about the task.
 * @param {TaskOptions} [options={}] - Additional options for processing the task.
 * @returns {Promise<void>} A promise that resolves when the task is processed.
 */
async function processTask(task: Task, options: TaskOptions = {}) {
  const { id, groupTitle, title, p, videoFiles, dirPath } = task;
  const { output = '.', pageNumber, silence } = options;
  const spinner = ora();

  const outputDirPath = join(output, groupTitle ? sanitize(groupTitle) : id);
  await createFolder(outputDirPath);

  if (!silence) {
    spinner.start(`Decrypting and combining ${title ?? id}...`);
  }
  const filename = `${pageNumber ? p : ''}${title ? sanitize(title) : id}.mp4`;
  const outputFilePath = join(outputDirPath, filename);
  await processVideo(
    videoFiles.map(e => join(dirPath, e)),
    outputFilePath,
    options,
  );

  if (!silence) {
    spinner.succeed(`Saved ${filename}`);
  }
}

/**
 * Processes all tasks within a given folder using the specified options.
 * @param {string} dirPath - The path of the folder containing tasks.
 * @param {TaskOptions} [options={}] - Options for processing the tasks.
 * @returns {Promise<void>} A promise that resolves when all tasks are processed.
 */
export async function processFolder(
  dirPath: string,
  options: TaskOptions = {},
) {
  const tasks = await analyseFolder(dirPath);
  for (const task of tasks) {
    try {
      if (task.status === 'completed') {
        await processTask(task, options);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function listVideos(dirPath: string) {
  const tasks = await analyseFolder(dirPath);

  console.log('-'.repeat(20));
  for (const task of tasks) {
    const info = {
      id: 'ID',
      groupTitle: 'Group Title',
      title: 'Title',
      p: 'Page',
      uname: 'Uploader',
      status: 'Status',
    };
    Object.keys(info).forEach(key => {
      console.log(
        `${info[key as keyof typeof info]}: ${task[key as keyof Task]}`,
      );
    });
    console.log('-'.repeat(20));
  }
}
