#!/usr/bin/env node

import args from 'args';
import { convertCommand, listCommand } from './commands';

args
  .option(
    'input',
    'The folder that contains videos downloaded by the Bilibili desktop app.',
  )
  .option(
    'output',
    'Optional: The path where the output will be saved, default to the current folder.',
  )
  .option(
    'page-number',
    'Optional: Whether to include the indexed page number in the output filename.',
  )
  .option(
    'silence',
    'Optional: Whether to suppress console output during processing.',
  )
  .option(
    'bufferSize',
    'Optional: The size of the buffer chunk when processing video files, default to 64MB.',
  )
  .command('convert', 'Convert downloaded videos.', convertCommand as any)
  .command('list', 'List all videos.', listCommand as any)
  .example(
    'npx bili-pc-mp4 ~/Movies/bilibili',
    'A simple command to convert all videos to mp4 and save to the current folder.',
  )
  .example(
    'npx bili-pc-mp4 convert -i ~/Movies/bilibili -o ~/Movies/converted -p',
    'A complete example that converts all videos and save to specified location, naming videos with the page number.',
  )
  .example('npx bili-pc-mp4 list ~/Movies/bilibili', 'List all videos.');

const flags = args.parse(process.argv);
const subs = args.sub;

if (subs.length === 1) {
  convertCommand('convert', subs, flags);
}
