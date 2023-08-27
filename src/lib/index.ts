import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import ffmpeg from 'fluent-ffmpeg';

/**
 * Represents the structure of a task.
 * @typedef {Object} Task
 * @property {string} groupTitle - The group title of the task.
 * @property {string} title - The title of the task.
 * @property {number} p - The priority of the task.
 * @property {string} uname - The username associated with the task.
 * @property {string[]} videoFiles - An array of video file names.
 * @property {string[]} danmuFiles - An array of danmu file names.
 */
interface Task {
  groupTitle: string;
  title: string;
  p: number;
  uname: string;
  videoFiles: string[];
  danmuFiles: string[];
}

/**
 * Reads and analyzes the information from a task folder.
 * @param {string} taskPath - The path to the task folder.
 * @returns {Promise<Task>} A promise that resolves to the analyzed task.
 */
async function analyseTask(taskPath: string): Promise<Task> {
  const videoInfoReader = await readFile(join(taskPath, '.videoInfo'));
  const videoInfo: VideoInfo = JSON.parse(videoInfoReader.toString());
  const { groupTitle, title, p, uname } = videoInfo;
  const ls = await readdir(taskPath);
  const videoFiles = ls.filter(e => e.match(/\.m4s$/));
  const danmuFiles = ls.filter(e => e.match(/^dm[0-9]+/));
  return {
    groupTitle,
    title,
    p,
    uname,
    videoFiles,
    danmuFiles,
  };
}

/**
 * Analyzes a folder containing tasks and returns an array of analyzed tasks.
 * @param {string} dirPath - The path to the folder containing tasks.
 * @returns {Promise<Task[]>} A promise that resolves to an array of analyzed tasks.
 */
export async function analyseFolder(dirPath: string): Promise<Task[]> {
  const ls = await readdir(dirPath);
  if (ls.includes('.videoinfo')) {
    const task = await analyseTask(dirPath);
    return [task];
  } else {
    const taskAnalysers = ls.map(e => analyseTask(join(dirPath, e)));
    return Promise.all(taskAnalysers);
  }
}

export function combineVideos(videoFiles: string[], outputPath: string) {
  const ffmpegObj = ffmpeg().audioCodec('copy').videoCodec('copy');
  videoFiles.forEach(e => {
    ffmpegObj.input(e);
  });
  return new Promise((resolve, reject) => {
    ffmpegObj
      .on('error', function (err) {
        reject(err.message);
      })
      .on('end', function () {
        resolve(outputPath);
      })
      .mergeToFile(outputPath, './tmp');
  });
}
