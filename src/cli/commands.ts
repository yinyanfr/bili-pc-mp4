import { listVideos, processFolder } from '../core';

interface CliOptions {
  input: string;
  output?: string;
  pageNumber?: boolean;
  silence?: boolean;
  bufferSize?: string;
}

type CliCommand = (
  name?: string,
  subs?: string[],
  options?: Partial<CliOptions>,
) => Promise<void>;

export const listCommand: CliCommand = async (_, subs = [], options = {}) => {
  const folderPath = subs[0] ?? options.input;

  if (!folderPath) {
    throw new Error('Please specify the video folder path.');
  }
  await listVideos(folderPath);
};

export const convertCommand: CliCommand = async (
  _,
  subs = [],
  options = {},
) => {
  const folderPath = subs[0] ?? options.input;
  if (!folderPath) {
    throw new Error('Please specify the video folder path.');
  }
  const { output, pageNumber, silence, bufferSize } = options;
  await processFolder(folderPath, {
    output,
    pageNumber,
    silence,
    bufferSize: bufferSize ? parseInt(bufferSize) : undefined,
  });
};
