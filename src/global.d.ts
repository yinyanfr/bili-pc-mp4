/**
 * Represents the structure of a task.
 * @interface Task
 * @property {string} groupTitle - The group title of the task.
 * @property {string} title - The title of the task.
 * @property {number} p - The priority of the task.
 * @property {string} uname - The username associated with the task.
 * @property {string} status - The status of the task.
 * @property {string[]} videoFiles - An array of video file names.
 * @property {string[]} danmuFiles - An array of danmu file names.
 * @property {string[]} dirPath - The path to the folder.
 */
interface Task {
  id: string;
  groupTitle?: string;
  title?: string;
  p?: number;
  uname?: string;
  status?: 'completed' | string;
  videoFiles: string[];
  danmuFiles: string[];
  dirPath: string;
}

/**
 * Options for processing a task.
 * @interface TaskOptions
 * @property {string} [output] - The path where the output will be saved.
 * @property {boolean} [pageNumber] - Whether to include the indexed page number in the output filename.
 * @property {boolean} [silence] - Whether to suppress console output during processing.
 * @property {boolean} [withDanmu] - Whether to include danmu (WIP: danmu implementation) in the processing.
 * @property {number} [bufferSize] - The size of the buffer chunk when processing video files.
 */
interface TaskOptions {
  output?: string;
  pageNumber?: boolean;
  silence?: boolean;
  withDanmu?: boolean;
  bufferSize?: number;
}

interface VideoInfo {
  type: string;
  codecid: number;
  groupId: string;
  itemId: number;
  aid: number;
  cid: number;
  bvid: string;
  p: number;
  tabP: number;
  tabName: string;
  uid: string;
  uname: string;
  avatar: string;
  coverUrl: string;
  title: string;
  duration: number;
  groupTitle: string;
  groupCoverUrl: string;
  danmaku: number;
  view: number;
  pubdate: number;
  vt: number;
  status: string;
  active: boolean;
  loaded: boolean;
  qn: number;
  allowHEVC: boolean;
  createTime: number;
  coverPath: string;
  groupCoverPath: string;
  updateTime: number;
  totalSize: number;
  loadedSize: number;
  progress: number;
  speed: number;
  reportedSize: number;
  completionTime: number;
}
