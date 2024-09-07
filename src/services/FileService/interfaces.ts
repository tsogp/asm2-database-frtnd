import { Dayjs } from "dayjs";

export interface FileRequest {
  mysql_id: number,
  type: string,
}

interface FileMetadata {
  mysql_id: number,
  type: string,
}

export interface File {
  _id: string,
  length: number,
  chunkSize: number,
  uploadDate: Dayjs,
  filename: string,
  metadata: FileMetadata,
}

export interface AvatarRequest {
  mysql_id: number,
}

export interface AvatarResponse {
  filename: string,
  base64: string,
}

export interface FileResponse {
  result: File[]
}

export interface UploadImageRequest {
  file: File,
  mysql_id: number,
  dirTarget: string,
  fileType: string,
}