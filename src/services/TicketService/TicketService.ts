import requestService, { RequestServiceType } from "@/src/services/RequestService";
import { AxiosError } from "axios";
import { CreateTicketRequest } from "@/src/services/TicketService/interfaces";

class TicketService {
  private requestService: RequestServiceType;

  constructor() {
    this.requestService = requestService;
  }

  public async createTicket(request: CreateTicketRequest, onSuccess: () => void, onFailure: (errorMsg: string) => void): Promise<void> {
    try {
      await this.requestService.postWithAuth<null>('/ticket/new', 
        request
      );
      
			onSuccess();
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }
}

const ticketService = new TicketService();

export default ticketService;