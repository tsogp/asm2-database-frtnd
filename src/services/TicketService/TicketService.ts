import requestService, {
  RequestServiceType,
} from "@/src/services/RequestService";
import { AxiosError } from "axios";
import {
  DefaultPagination,
  DefaultPaginationRequest,
} from "../DefaultInterfaces";
import dayjs from "dayjs";
import { AllTicketResponse, ApproveTicketParam, ApproveTicketResponse, DeleteTicketParam, DeleteTicketResponse, MyTicketsResponse, NewTicketBody, NewTicketResponse, RejectTicketBody, RejectTicketParam, RejectTicketResponse, UpdateTicketBody, UpdateTicketParam, UpdateTicketResponse } from "./interfaces";

class TicketService {
  private requestService: RequestServiceType;
  private prefix: string;

  constructor() {
    this.prefix = "/ticket";
    this.requestService = requestService;
  }

  public async getAllTickets(
    query: DefaultPaginationRequest,
    onFailure: (errorMsg: string) => void
  ): Promise<AllTicketResponse> {
    try {
      const response =
        await this.requestService.getWithAuth<AllTicketResponse>(
          `${this.prefix}/all`,
          { params: query }
        );

      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public async getMyTickets(
    query: DefaultPaginationRequest,
    onFailure: (errorMsg: string) => void
  ): Promise<MyTicketsResponse> {
    try {
      const response =
        await this.requestService.getWithAuth<MyTicketsResponse>(
          `${this.prefix}/my`,
          { params: query }
        );

      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public async createNewTicket(
    body: NewTicketBody,
    onSuccess: () => void,
    onFailure: (errorMsg: string) => void
  ): Promise<NewTicketResponse> {
    try {
      const response =
        await this.requestService.postWithAuth<NewTicketResponse>(
          `${this.prefix}/new`,
          body
        );
      
      onSuccess();
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }

  public async approveTicket(
    params: ApproveTicketParam,
    onSuccess: () => void,
    onFailure: (errorMsg: string) => void
  ): Promise<ApproveTicketResponse> {
    try {
      const response =
        await this.requestService.putWithAuth<ApproveTicketResponse>(
          `${this.prefix}/approve/${params.ticket_id}`,
        );
      
      onSuccess();
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }
  
  public async rejectTicket(
    params: RejectTicketParam,
    body: RejectTicketBody,
    onSuccess: () => void,
    onFailure: (errorMsg: string) => void
  ): Promise<RejectTicketResponse> {
    try {
      const response =
        await this.requestService.putWithAuth<ApproveTicketResponse>(
          `${this.prefix}/reject/${params.ticket_id}`,
          body
        );

      onSuccess();
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  }
  
  public async updateTicket(
    param: UpdateTicketParam,
    body: UpdateTicketBody,
    onSuccess: () => void,
    onFailure: (errorMsg: string) => void
  ): Promise<UpdateTicketResponse> {
   try {
      const response =
        await this.requestService.putWithAuth<UpdateTicketResponse>(
          `${this.prefix}/${param.ticket_id}`,
          body
        );

      onSuccess();
      return response?.data;
   } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    } 
  }
  
  public async deleteTicket(
    param: DeleteTicketParam,
    onSuccess: () => void,
    onFailure: (errorMsg: string) => void
  ): Promise<DeleteTicketResponse> {
    try {
      const response =
        await this.requestService.deleteWithAuth<DeleteTicketResponse>(
          `${this.prefix}/${param.ticket_id}`
        );

      onSuccess();
      return response?.data;
    } catch (error) {
      onFailure(((error as AxiosError).response?.data as any).error);
      throw error;
    }
  };
}

const ticketService = new TicketService();

export default ticketService;
