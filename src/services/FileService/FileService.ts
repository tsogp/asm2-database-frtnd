import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { FileRequest, FileResponse, AvatarResponse } from "@/src/services/FileService/interfaces";

class FileService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async getStaffAvatar(request: FileRequest, onFailure: (errorMsg: string) => void): Promise<AvatarResponse | undefined> {
    try {
      const metadataResponse = await this.requestService.getWithAuth<FileResponse>('/files/meta/staff', { params: request }) 
      const pictureResponse = await this.requestService.getWithAuth<AvatarResponse>('/files/content/staff/' + metadataResponse.data.result[0].filename)
      return pictureResponse.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error)
    }
  }
}

const fileService = new FileService();

export default fileService;
