import { api } from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  TeamDriver,
  Vehicle,
  Booking,
  BookingRequest,
  CommissionPayment,
  TaxiAvailability,
  TaxiEnquiry,
  ChatConversation,
  ChatMessage,
  Ticket,
  User,
} from '../types';

export const teamDriverApi = {
  list: (page = 1) =>
    api.get<PaginatedResponse<TeamDriver>>('/team-drivers', { params: { page, limit: 20 } }),
  create: (data: { firstName: string; lastName: string; phoneNumber: string; email?: string }) =>
    api.post<ApiResponse<TeamDriver>>('/team-drivers', data),
  update: (id: string, data: Partial<TeamDriver>) =>
    api.put<ApiResponse<TeamDriver>>(`/team-drivers/${id}`, data),
  remove: (id: string) => api.delete<ApiResponse<{ deleted: boolean }>>(`/team-drivers/${id}`),
};

export const vehicleApi = {
  list: (page = 1) =>
    api.get<PaginatedResponse<Vehicle>>('/vehicles', { params: { page, limit: 20 } }),
  create: (data: {
    vehicleNumber: string;
    carName: string;
    registrationYear: number;
    manufacturerName: string;
    assignedTeamDriverId?: string;
  }) => api.post<ApiResponse<Vehicle>>('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>) =>
    api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data),
  assignDriver: (id: string, assignedTeamDriverId: string) =>
    api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}/assign-driver`, { assignedTeamDriverId }),
  remove: (id: string) => api.delete<ApiResponse<{ deleted: boolean }>>(`/vehicles/${id}`),
};

export const bookingApi = {
  create: (data: {
    fromLocation: string;
    toLocation: string;
    actualPrice: number;
    commission: number;
    customer: { name: string; phoneNumber: string; email?: string; notes?: string };
    travelDate?: string;
    notes?: string;
  }) => api.post<ApiResponse<Booking>>('/bookings', data),
  listOpen: (page = 1) =>
    api.get<PaginatedResponse<Booking>>('/bookings/open', { params: { page, limit: 20 } }),
  listMy: (page = 1) =>
    api.get<PaginatedResponse<Booking>>('/bookings/my', { params: { page, limit: 20 } }),
  listMyAccepted: (page = 1) =>
    api.get<PaginatedResponse<Booking>>('/bookings/my-accepted', { params: { page, limit: 20 } }),
  getOne: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  createRequest: (bookingId: string, message: string) =>
    api.post<ApiResponse<BookingRequest>>(`/bookings/${bookingId}/requests`, { message }),
  listRequests: (bookingId: string, page = 1) =>
    api.get<PaginatedResponse<BookingRequest>>(`/bookings/${bookingId}/requests`, {
      params: { page, limit: 20 },
    }),
  acceptRequest: (bookingId: string, requestId: string) =>
    api.patch<ApiResponse<BookingRequest>>(
      `/bookings/${bookingId}/requests/${requestId}/accept`,
    ),
  rejectRequest: (bookingId: string, requestId: string) =>
    api.patch<ApiResponse<BookingRequest>>(
      `/bookings/${bookingId}/requests/${requestId}/reject`,
    ),
  payCommission: (bookingId: string, transactionReference?: string) =>
    api.post<ApiResponse<CommissionPayment>>(`/bookings/${bookingId}/pay-commission`, {
      transactionReference,
    }),
};

export const taxiApi = {
  create: (data: {
    vehicleId?: string;
    fromLocation: string;
    toLocation?: string;
    availableFrom: string;
    availableUntil?: string;
    description?: string;
  }) => api.post<ApiResponse<TaxiAvailability>>('/taxi-availabilities', data),
  listActive: (page = 1) =>
    api.get<PaginatedResponse<TaxiAvailability>>('/taxi-availabilities/active', {
      params: { page, limit: 20 },
    }),
  listMy: (page = 1) =>
    api.get<PaginatedResponse<TaxiAvailability>>('/taxi-availabilities/my', {
      params: { page, limit: 20 },
    }),
  deactivate: (id: string) =>
    api.patch<ApiResponse<TaxiAvailability>>(`/taxi-availabilities/${id}/deactivate`),
  createEnquiry: (availabilityId: string, message: string) =>
    api.post<ApiResponse<TaxiEnquiry>>(`/taxi-availabilities/${availabilityId}/enquiries`, {
      message,
    }),
  listEnquiries: (availabilityId: string, page = 1) =>
    api.get<PaginatedResponse<TaxiEnquiry>>(
      `/taxi-availabilities/${availabilityId}/enquiries`,
      { params: { page, limit: 20 } },
    ),
  respondEnquiry: (enquiryId: string, response: string) =>
    api.patch<ApiResponse<TaxiEnquiry>>(
      `/taxi-availabilities/enquiries/${enquiryId}/respond`,
      { response },
    ),
};

export const chatApi = {
  startConversation: (participantId: string) =>
    api.post<ApiResponse<ChatConversation>>('/chat/conversations', { participantId }),
  listConversations: (page = 1) =>
    api.get<PaginatedResponse<ChatConversation>>('/chat/conversations', {
      params: { page, limit: 20 },
    }),
  sendMessage: (conversationId: string, message: string) =>
    api.post<ApiResponse<ChatMessage>>(`/chat/conversations/${conversationId}/messages`, {
      message,
    }),
  getMessages: (conversationId: string, page = 1) =>
    api.get<PaginatedResponse<ChatMessage>>(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit: 50 },
    }),
};

export const ticketApi = {
  create: (data: { bookingId?: string; subject: string; description: string }) =>
    api.post<ApiResponse<Ticket>>('/tickets', data),
  listMy: (page = 1) =>
    api.get<PaginatedResponse<Ticket>>('/tickets/my', { params: { page, limit: 20 } }),
  listAll: (page = 1) =>
    api.get<PaginatedResponse<Ticket>>('/tickets', { params: { page, limit: 20 } }),
  getOne: (id: string) => api.get<ApiResponse<Ticket>>(`/tickets/${id}`),
  updateStatus: (id: string, status: string, adminNotes?: string) =>
    api.patch<ApiResponse<Ticket>>(`/tickets/${id}/status`, { status, adminNotes }),
};

export const adminApi = {
  listUsers: (page = 1) =>
    api.get<PaginatedResponse<User>>('/admin/users', { params: { page, limit: 20 } }),
};
