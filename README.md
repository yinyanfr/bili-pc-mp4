# bili-pc-mp4

[![npm](https://img.shields.io/npm/v/bili-pc-mp4.svg?style=flat-square)](https://www.npmjs.com/package/bili-pc-mp4)
![license](https://img.shields.io/npm/l/bili-pc-mp4.svg?style=flat-square)
![size](https://img.shields.io/github/repo-size/yinyanfr/bili-pc-mp4?style=flat-square)
[![GitHub release](https://img.shields.io/github/release/yinyanfr/bili-pc-mp4.svg?style=flat-square)](https://github.com/yinyanfr/bili-pc-mp4/releases/latest)

```bash
npx bili-pc-mp4 ~/Movies/bilibili
```

中文文档 | [English Document](./docs/README.en.md)

`bili-pc-mp4` 是用于将「Bilibili 桌面客户端」(Windows（非 UMP）, Mac 版)下载的视频转换为 MP4 格式的工具。

**请注意 `bili-pc-mp4` 并非下载器**，您需要先通过「Bilibili 桌面客户端」对视频进行「离线缓存」。

`bili-pc-mp4` 仅支持由「Bilibili 桌面客户端」下载的视频，不支持其它平台客户端。

您需要先[安装 ffmpeg](./docs/ffmpeg.md).

## :star2: 特性

- 解密并合并视频，不损失音画质
- 支持批量转换多个视频
- 支持查看视频信息
- 简单易用的命令行工具
- 低内存占用

## :wrench: 命令行工具

### 转换视频

您可以使用页首的简单命令，或使用完整命令：

```bash
npx bili-pc-mp4 convert -i ~/Movies/bilibili -o ~/Movies/converted
```

命令行支持如下选项：

| 名称                | 类型 | 简介                                                                           |
| ------------------- | ---- | ------------------------------------------------------------------------------ |
| `--input, -i`       | 路径 | 指定要转换的视频位置，可以是单个视频的文件夹，也可以是包含多个视频的文件夹。   |
| `--output, -o`      | 路径 | 指定输出视频的位置，默认为当前位置。                                           |
| `--page-number, -p` |      | 是否在输出的视频文件名前加入分p 序号。                                         |
| `--silience, -s`    |      | 是否取消终端输出。                                                             |
| `--buffer-size, -b` | 数字 | 指定读取文件流的分块大小（KB），默认为64 MB，为使解密有效，该值应不少于 16 KB. |

你可以输入以下命令查看完整帮助信息和使用示例：

```bash
npx bili-pc-mp4 help
```

### 查看视频信息

```bash
npx bili-pc-mp4 list ~/Movies/bilibili
```

## :book: 作为库使用

您也可以讲 `bili-pc-mp4` 作为库使用，`bili-pc-mp4` 使用 CommonJS.

`bili-pc-mp4` 完整使用 JSDoc，各功能及选项与命令行一致。

```bash
npm i bili-pc-mp4
```

```typescript
import { listVideos, processFolder } from 'bili-pc-mp4';

// 查看视频信息
await listVideos('./bilibili');

// 转换视频
await processFolder('./bilibili', {
  output: './converted',
  pageNumber: true,
  silence: true,
  bufferSize: 64 * 1024,
});
```
