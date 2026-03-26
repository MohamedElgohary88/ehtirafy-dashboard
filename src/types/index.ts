// User Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  totalBookings: number;
  totalSpent: number;
}

export interface Freelancer {
  id: string;
  name: string;
  email: string;
  phone: string;
  portfolio: string[];
  rating: number;
  totalProjects: number;
  accountStatus: 'approved' | 'pending' | 'suspended';
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  createdAt: string;
}

// Service Types
export interface ServiceRequest {
  id: string;
  freelancerId: string;
  freelancerName: string;
  serviceName: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Payment Types
export interface PaymentProof {
  id: string;
  contractId: string;
  customerId: string;
  customerName: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  currency: string;
  receiptImage: string;
  senderName: string;
  senderBank: string;
  transferDate: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
}

// Contract Types
export interface Contract {
  id: string;
  customerId: string;
  freelancerId: string;
  serviceId: string;
  status: 'pending_payment' | 'active' | 'completed' | 'cancelled';
  amount: number;
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

// Statistics Types
export interface DashboardStats {
  totalCustomers: number;
  totalFreelancers: number;
  activeContracts: number;
  pendingPayments: number;
  totalRevenue: number;
  totalBookings: number;
  completedProjects: number;
  approvalRate: number;
  averageRating: number;
}

// Booking History Types
export interface Booking {
  id: string;
  customerId: string;
  freelancerId: string;
  eventType: string;
  eventDate: string;
  location: string;
  amount: number;
  status: 'completed' | 'ongoing' | 'cancelled';
  rating?: number;
  review?: string;
}
