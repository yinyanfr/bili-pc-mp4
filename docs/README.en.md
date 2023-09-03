# bili-pc-mp4

[![npm](https://img.shields.io/npm/v/bili-pc-mp4.svg?style=flat-square)](https://www.npmjs.com/package/bili-pc-mp4)
![license](https://img.shields.io/npm/l/bili-pc-mp4.svg?style=flat-square)
![size](https://img.shields.io/github/repo-size/yinyanfr/bili-pc-mp4?style=flat-square)
[![GitHub release](https://img.shields.io/github/release/yinyanfr/bili-pc-mp4.svg?style=flat-square)](https://github.com/yinyanfr/bili-pc-mp4/releases/latest)

[中文文档](../README.md) | English Document

```bash
npx bili-pc-mp4 ~/Movies/bilibili
```

`bili-pc-mp4` is a tool for converting videos downloaded from the "Bilibili Desktop Client" (Windows (non-UMP), Mac version) into MP4 format.

Please note that `bili-pc-mp4` is not a downloader, and you need to first use the "Bilibili Desktop Client" to perform "offline caching" of the videos.

`bili-pc-mp4` only supports videos downloaded using the "Bilibili Desktop Client" and does not support other platform clients.

You need to first [install ffmpeg](./ffmpeg.en.md).

## :star2: Features

- Decrypts and merges videos without loss of audio and video quality.
- Supports batch conversion of multiple videos.
- Supports viewing video information.
- Simple and easy-to-use command-line tool.
- Low memory usage.

## :wrench: Command-Line Tool

### Convert Videos

You can use the simple command at the top of the page or use the complete command:

```bash
npx bili-pc-mp4 convert -i ~/Movies/bilibili -o ~/Movies/converted
```

| Name                | Type   | Description                                                                                                                                       |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--input, -i`       | Path   | Specifies the location of the videos to be converted. It can be a folder containing a single video or multiple videos.                            |
| `--output, -o`      | Path   | Specifies the output location for the videos. Defaults to the current location.                                                                   |
| `--page-number, -p` |        | Whether to include the page number (分p) before the output video filename.                                                                        |
| `--silence, -s`     |        | Whether to suppress terminal output.                                                                                                              |
| `--buffer-size, -b` | Number | Specifies the block size (in KB) for reading file streams. Defaults to 64 MB. For effective decryption, this value should not be less than 16 KB. |

You can input the following command to see complete help information and usage examples:

```bash
npx bili-pc-mp4 help
```

### View Video Information

```bash
npx bili-pc-mp4 list ~/Movies/bilibili
```

## :book: Using as a Library

You can also use `bili-pc-mp4` as a library; bili-pc-mp4 uses CommonJS.

`bili-pc-mp4` has complete JSDoc, and its features and options are consistent with the command-line.

```bash
npm i bili-pc-mp4
```

```typescript
import { listVideos, processFolder } from 'bili-pc-mp4';

// View video information
await listVideos('./bilibili');

// Convert videos
await processFolder('./bilibili', {
  output: './converted',
  pageNumber: true,
  silence: true,
  bufferSize: 64 * 1024,
});
```
