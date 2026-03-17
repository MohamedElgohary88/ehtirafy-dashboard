import type { Customer, Freelancer, ServiceRequest, PaymentProof, DashboardStats } from '../types';

// Mock API service - Replace with actual API calls
class ApiService {
  // baseUrl will be used when connecting to real backend
  // private baseUrl = 'http://localhost:5000/api';

  // Stats
  async getDashboardStats(): Promise<DashboardStats> {
    // TODO: Replace with actual API call
    return {
      totalCustomers: 1250,
      totalFreelancers: 450,
      activeContracts: 320,
      pendingPayments: 45,
      totalRevenue: 125000,
      totalBookings: 2180,
      completedProjects: 1675,
      approvalRate: 93.4,
      averageRating: 4.7,
    };
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    // TODO: Replace with actual API call
    return [
      {
        id: '1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        createdAt: '2024-01-15',
        totalBookings: 5,
        totalSpent: 2500,
        status: 'active',
      },
      {
        id: '2',
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+966509876543',
        createdAt: '2024-02-10',
        totalBookings: 3,
        totalSpent: 1800,
        status: 'active',
      },
    ];
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customers = await this.getCustomers();
    return customers.find(c => c.id === id) || null;
  }

  // Freelancers
  async getFreelancers(): Promise<Freelancer[]> {
    // TODO: Replace with actual API call
    return [
      {
        id: '1',
        name: 'محمد الصوري',
        email: 'photographer1@example.com',
        phone: '+966501111111',
        portfolio: ['image1.jpg', 'image2.jpg'],
        rating: 4.8,
        totalProjects: 45,
        accountStatus: 'approved',
        bankDetails: {
          accountName: 'محمد الصوري',
          accountNumber: '1234567890',
          bankName: 'بنك الرياض',
        },
        createdAt: '2023-12-01',
      },
    ];
  }

  async getFreelancerById(id: string): Promise<Freelancer | null> {
    const freelancers = await this.getFreelancers();
    return freelancers.find(f => f.id === id) || null;
  }

  async approveFreelancer(id: string): Promise<void> {
    // TODO: Implement API call
    console.log(`Approving freelancer: ${id}`);
  }

  async suspendFreelancer(id: string): Promise<void> {
    // TODO: Implement API call
    console.log(`Suspending freelancer: ${id}`);
  }

  // Services
  async getPendingServices(): Promise<ServiceRequest[]> {
    // TODO: Replace with actual API call
    return [
      {
        id: '1',
        freelancerId: '1',
        freelancerName: 'محمد الصوري',
        serviceName: 'تصوير الزفاف',
        description: 'خدمة تصوير الزفاف الاحترافية مع 4 ساعات من التغطية',
        price: 500,
        category: 'Wedding',
        images: ['service1.jpg', 'service2.jpg'],
        status: 'pending',
        submittedAt: '2024-03-10',
      },
    ];
  }

  async approveService(id: string): Promise<void> {
    // TODO: Implement API call
    console.log(`Approving service: ${id}`);
  }

  async rejectService(id: string, reason: string): Promise<void> {
    // TODO: Implement API call
    console.log(`Rejecting service ${id} with reason: ${reason}`);
  }

  // Payments
  async getPendingPayments(): Promise<PaymentProof[]> {
    // TODO: Replace with actual API call
    return [
      {
        id: '1',
        contractId: 'contract1',
        customerId: 'cust1',
        customerName: 'أحمد محمد',
        freelancerId: 'free1',
        freelancerName: 'محمد الصوري',
        amount: 500,
        currency: 'SAR',
        receiptImage: 'receipt1.jpg',
        senderName: 'أحمد محمد',
        senderBank: 'بنك الرياض',
        transferDate: '2024-03-15',
        submittedAt: '2024-03-15',
        status: 'pending',
      },
    ];
  }

  async approvePayment(id: string): Promise<void> {
    // TODO: Implement API call
    console.log(`Approving payment: ${id}`);
  }

  async rejectPayment(id: string, reason: string): Promise<void> {
    // TODO: Implement API call
    console.log(`Rejecting payment ${id} with reason: ${reason}`);
  }
}

export const apiService = new ApiService();
