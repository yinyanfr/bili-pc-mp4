import { join } from 'node:path';
import { combineVideos } from './lib';

async function main() {
  const videoFiles = [
    '/Users/yan/Documents/GitHub/bili-pc-mp4/src/blbl/61142298/61142298_da2-1-30112.m4s',
    '/Users/yan/Documents/GitHub/bili-pc-mp4/src/blbl/61142298/61142298_da2-1-30280.m4s',
  ];
  try {
    await combineVideos(videoFiles, join(__dirname, '1.mp4'));
  } catch (error) {
    console.error(error);
  }
}

main();
