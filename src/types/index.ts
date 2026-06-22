export interface PageMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
  code?: string;
}

export interface Role {
  _id: string;
  name: string;
  slug: 'admin' | 'driver';
}

export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePic?: string;
  dateOfBirth?: string;
  address?: string;
  state?: string;
  city?: string;
  role?: Role | string;
  isActive?: boolean;
}

export interface AuthPayload {
  access_token: string;
  userId: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  role?: Role;
}

export interface TeamDriver {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  parentDriverId: string;
  isActive: boolean;
}

export interface Vehicle {
  _id: string;
  vehicleNumber: string;
  carName: string;
  registrationYear: number;
  manufacturerName: string;
  assignedTeamDriverId?: string;
  assignedDriver?: TeamDriver;
  registeredBy: string;
  isActive: boolean;
}

export interface BookingCustomer {
  name: string;
  phoneNumber: string;
  email?: string;
  notes?: string;
}

export interface Booking {
  _id: string;
  fromLocation: string;
  toLocation: string;
  actualPrice: number;
  commission: number;
  customer: BookingCustomer;
  publishedBy: string | User;
  assignedDriverId?: string;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  travelDate?: string;
  notes?: string;
  publisher?: User;
}

export interface BookingRequest {
  _id: string;
  bookingId: string;
  requestedBy: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  requester?: User;
}

export interface CommissionPayment {
  _id: string;
  bookingRequestId: string;
  bookingId: string;
  paidBy: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  transactionReference?: string;
}

export interface TaxiAvailability {
  _id: string;
  driverId: string;
  vehicleId?: string;
  fromLocation: string;
  toLocation?: string;
  availableFrom: string;
  availableUntil?: string;
  description?: string;
  status: 'active' | 'inactive';
  driver?: User;
  vehicle?: Vehicle;
}

export interface TaxiEnquiry {
  _id: string;
  availabilityId: string;
  enquiredBy: string;
  message: string;
  response?: string;
  status: 'pending' | 'responded' | 'closed';
  enquirer?: User;
}

export interface ChatConversation {
  _id: string;
  participantOneId: string;
  participantTwoId: string;
  lastMessageAt?: string;
  participantOne?: User;
  participantTwo?: User;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  message: string;
  readAt?: string;
  createdAt?: string;
}

export interface Ticket {
  _id: string;
  bookingId?: string;
  raisedBy: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  raisedByUser?: User;
  booking?: Booking;
}
