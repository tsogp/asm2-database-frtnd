import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { FileRequest, FileResponse, AvatarResponse, UploadImageRequest, AvatarRequest } from "@/src/services/FileService/interfaces";

class FileService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async getStaffAvatar(request: AvatarRequest, onFailure: (errorMsg: string) => void): Promise<AvatarResponse> {
    try {
      const pictureResponse = await this.requestService.getWithAuth<AvatarResponse>(`/files/staff_avatar/${request.mysql_id}`) 
      return pictureResponse.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }

  public async uploadFile(request: UploadImageRequest, onSuccess: () => void, onFailure: (errorMsg: string) => void) {
    const formData = new FormData();

    // @ts-ignore
    formData.append('fileTarget', request.file);
    formData.append('mysql_id', request.mysql_id.toString());
    formData.append('dirTarget', request.dirTarget);
    formData.append('fileType', request.fileType);

    try {
      const response = await this.requestService.postWithAuth('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
      throw(error);
    }
  }
}

const fileService = new FileService();

export default fileService;
