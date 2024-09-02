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

export interface AvatarResponse {
  filename: string,
  base64: string,
}

export interface FileResponse {
  result: File[]
}