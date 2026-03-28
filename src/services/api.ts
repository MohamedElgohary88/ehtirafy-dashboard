import type { Customer, Freelancer, ServiceRequest, PaymentProof, DashboardStats, Contract } from '../types';

type UnknownRecord = Record<string, unknown>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  userType: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

interface UpdateTransactionPayload {
  transactionId: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  note?: string;
}

interface CreateTransactionPayload {
  advId: string;
  note?: string;
  amount?: number;
  images?: File[];
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';
const API_CUSTOMERS_ENDPOINT = import.meta.env.VITE_API_CUSTOMERS_ENDPOINT || 'dashboard/all-clients';
const API_FREELANCERS_ENDPOINT = import.meta.env.VITE_API_FREELANCERS_ENDPOINT || 'dashboard/all-freelancers';
const API_BEST_FREELANCERS_ENDPOINT = import.meta.env.VITE_API_BEST_FREELANCERS_ENDPOINT || 'best-freelancers';
const API_ADVERTISEMENTS_ENDPOINT = import.meta.env.VITE_API_ADVERTISEMENTS_ENDPOINT || 'dashboard/advertisements';
const API_CATEGORIES_ENDPOINT = import.meta.env.VITE_API_CATEGORIES_ENDPOINT || 'dashboard/categories';
const API_APP_STATS_ENDPOINT = import.meta.env.VITE_API_APP_STATS_ENDPOINT || 'dashboard/statistics';

const ensureString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
};

const ensureNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const asRecord = (value: unknown): UnknownRecord => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as UnknownRecord;
};

const firstArray = (value: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(value)) return value;
  const root = asRecord(value);
  for (const key of keys) {
    const candidate = root[key];
    if (Array.isArray(candidate)) return candidate;
    const nested = asRecord(candidate);
    if (Array.isArray(nested.data)) return nested.data;
  }
  if (Array.isArray(root.data)) return root.data;
  return [];
};


const normalizeFreelancerState = (value: unknown): Freelancer['accountStatus'] => {
  const raw = ensureString(value, '').toLowerCase();
  if (['approved', 'active', 'published', 'completed'].includes(raw)) return 'approved';
  if (['suspended', 'blocked', 'inactive', 'rejected'].includes(raw)) return 'suspended';
  return 'pending';
};

const normalizeTransactionStatus = (value: unknown): PaymentProof['status'] => {
  const raw = ensureString(value, '').toLowerCase();
  if (['approved', 'completed', 'success', 'published'].includes(raw)) return 'approved';
  if (['rejected', 'failed', 'declined'].includes(raw)) return 'rejected';
  return 'pending';
};

const localizedName = (value: unknown): string => {
  // Handle JSON-encoded strings like '{"ar":"...","en":"..."}'
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const htmlLang = typeof document !== 'undefined' ? document.documentElement.lang : 'en';
          if (htmlLang.startsWith('ar')) return ensureString(parsed.ar ?? parsed.en, '-');
          return ensureString(parsed.en ?? parsed.ar, '-');
        }
      } catch {
        // Not valid JSON, fall through to return as plain string
      }
    }
    return value || '-';
  }

  const node = asRecord(value);
  if (Object.keys(node).length === 0) return ensureString(value, '-');

  const htmlLang = typeof document !== 'undefined' ? document.documentElement.lang : 'en';
  if (htmlLang.startsWith('ar')) return ensureString(node.ar ?? node.en, '-');
  return ensureString(node.en ?? node.ar, '-');
};

class ApiService {
  private readonly endpointCache = new Map<string, string>();

  async login(email: string, password: string, deviceToken = 'APA91bHK13e3JFTAouXNdbULg46oBGHScD7VZnsKKKv_FGSXhUO2sP2p0KhHOsa6FOUl7GFNucgJXVvV4tUsuhUtIu_E6TSektlAejZ22HH9_Jlqa0580dg'): Promise<LoginResult> {
    const payload = await this.request<unknown>('auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        device_token: deviceToken,
      }),
    });

    const data = asRecord(asRecord(payload).data);
    const userNode = asRecord(data.user);
    const token = ensureString(data.token);

    if (!token) {
      throw new Error('Login succeeded but token was not returned by API.');
    }

    return {
      token,
      user: {
        id: ensureString(userNode.id),
        name: ensureString(userNode.name),
        email: ensureString(userNode.email),
        userType: ensureString(userNode.user_type),
      },
    };
  }

  private hasBackendConfig(): boolean {
    return Boolean(API_BASE_URL);
  }

  private getAuthToken(): string {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token') ||
      localStorage.getItem('access_token') ||
      API_TOKEN
    );
  }

  private buildUrl(endpoint: string): string {
    if (!this.hasBackendConfig()) {
      throw new Error('Missing API configuration. Set VITE_API_BASE_URL in your environment.');
    }

    if (/^https?:\/\//.test(endpoint)) return endpoint;
    return `${API_BASE_URL}/api/${API_VERSION}/${endpoint.replace(/^\//, '')}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useFormData = false
  ): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');

    const token = this.getAuthToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    if (!useFormData && options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(this.buildUrl(endpoint), {
      ...options,
      headers,
    });

    const raw = await response.text();
    let payload = {} as T;

    if (raw) {
      try {
        payload = JSON.parse(raw) as T;
      } catch {
        payload = {} as T;
      }
    }

    if (!response.ok) {
      const message = asRecord(payload).message;
      const bodyText = raw.toLowerCase();

      if (
        response.status === 401 ||
        bodyText.includes('unauthenticated') ||
        bodyText.includes('route [login] not defined')
      ) {
        throw new Error('Unauthorized API access. Please set a valid token in localStorage or VITE_API_TOKEN and restart dev server.');
      }

      throw new Error(ensureString(message, `Request failed (${response.status})`));
    }

    return payload;
  }

  private async requestFromCandidates<T>(
    cacheKey: string,
    candidates: string[],
    mapper: (item: UnknownRecord) => T
  ): Promise<T[]> {
    if (!this.hasBackendConfig()) return [];

    const cachedEndpoint = this.endpointCache.get(cacheKey);
    if (cachedEndpoint) {
      const response = await this.request<unknown>(cachedEndpoint);
      return firstArray(response, [cacheKey, 'data', 'items', 'result']).map(item => mapper(asRecord(item)));
    }

    let lastError: unknown;

    for (const endpoint of candidates.filter(Boolean)) {
      try {
        const response = await this.request<unknown>(endpoint);
        const rows = firstArray(response, [cacheKey, 'users', 'transactions', 'customers', 'freelancers', 'data']);
        this.endpointCache.set(cacheKey, endpoint);
        return rows.map(item => mapper(asRecord(item)));
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      lastError instanceof Error ? lastError.message : `Unable to resolve endpoint for ${cacheKey}.`
    );
  }

  async getDashboardStats(): Promise<DashboardStats> {
    if (!this.hasBackendConfig()) {
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

    const response = await this.request<unknown>(API_APP_STATS_ENDPOINT);
    const data = asRecord(asRecord(response).data);

    const contractsCount = ensureNumber(data.contracts_count);
    const completedContracts = ensureNumber(data.completed_contracts);
    const activeContractsCount = ensureNumber(data.active_contracts_count);

    let freelancersCount = ensureNumber(data.freelancers_count);
    if (!freelancersCount) {
      const freelancers = await this.getFreelancers();
      freelancersCount = freelancers.length;
    }

    let pendingPaymentsCount = ensureNumber(data.pending_payments);
    if (!pendingPaymentsCount) {
      try {
        pendingPaymentsCount = (await this.getPaymentTransactions('pending')).length;
      } catch {
        pendingPaymentsCount = 0;
      }
    }

    const appFees = Array.isArray(data.app_fees_total)
      ? (data.app_fees_total as unknown[])
      : [];
    const totalFees = appFees
      .map(entry => ensureNumber(asRecord(entry).total, 0))
      .reduce((sum, current) => sum + current, 0);

    return {
      totalCustomers: ensureNumber(data.users_count),
      totalFreelancers: freelancersCount,
      activeContracts: activeContractsCount || Math.max(contractsCount - completedContracts, 0),
      pendingPayments: pendingPaymentsCount,
      totalRevenue: ensureNumber(data.total_earnings, totalFees),
      totalBookings: ensureNumber(data.services_count ?? data.advertisements_count),
      completedProjects: completedContracts,
      approvalRate: contractsCount > 0 ? Number(((completedContracts / contractsCount) * 100).toFixed(1)) : 0,
      averageRating: ensureNumber(data.rating_avg),
    };
  }

  private mapCustomer = (item: UnknownRecord): Customer => {
    const userNode = asRecord(item.user);
    const id = ensureString(item.id ?? item.user_id ?? item.customer_id ?? userNode.id, crypto.randomUUID());
    const createdAt = ensureString(item.created_at ?? item.createdAt ?? userNode.created_at, new Date().toISOString());
    const customerNode = asRecord(item.customer);

    return {
      id,
      name: ensureString(item.name ?? userNode.name ?? customerNode.name ?? item.full_name, `Customer ${id}`),
      email: ensureString(item.email ?? userNode.email ?? customerNode.email, '-'),
      phone: ensureString(item.phone ?? userNode.phone ?? customerNode.phone, '-'),
      createdAt,
      totalBookings: ensureNumber(item.total_bookings ?? item.bookings_count),
      totalSpent: ensureNumber(item.total_spent ?? item.total_amount),
    };
  };

  async getCustomers(): Promise<Customer[]> {
    if (!this.hasBackendConfig()) {
      return [
        {
          id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+966501234567',
          createdAt: '2024-01-15',
          totalBookings: 5,
          totalSpent: 2500,
        },
      ];
    }

    return this.requestFromCandidates<Customer>(
      'customers',
      [
        API_CUSTOMERS_ENDPOINT,
        'dashboard/all-clients',
      ],
      this.mapCustomer
    );
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customers = await this.getCustomers();
    return customers.find(customer => customer.id === id) || null;
  }

  private mapFreelancer = (item: UnknownRecord): Freelancer => {
    const userNode = asRecord(item.user);
    const advertisementNode = asRecord(item.advertisement);
    const advertisements = Array.isArray(item.advertisements)
      ? item.advertisements.map(entry => asRecord(entry))
      : [];
    const publishedAdsCount = advertisements.filter(ad =>
      normalizeFreelancerState(ad.status) === 'approved'
    ).length;
    const hasPendingAds = advertisements.some(ad => normalizeFreelancerState(ad.status) === 'pending');

    const id = ensureString(item.id ?? item.user_id ?? item.freelancer_id ?? userNode.id, crypto.randomUUID());
    const bankNode = asRecord(item.bank_details ?? item.bankDetails);

    return {
      id,
      name: ensureString(item.name ?? userNode.name ?? item.full_name, `Freelancer ${id}`),
      email: ensureString(item.email ?? userNode.email, '-'),
      phone: ensureString(item.phone ?? userNode.phone, '-'),
      portfolio: advertisements.length > 0
        ? advertisements
          .flatMap(ad => {
            const maybeImages = ad.images;
            return Array.isArray(maybeImages) ? maybeImages : [];
          })
          .map(image => ensureString(image))
          .filter(Boolean)
        : Array.isArray(item.portfolio)
          ? item.portfolio.map(entry => ensureString(entry)).filter(Boolean)
          : [],
      rating: ensureNumber(item.rating ?? item.avg_rate, 0),
      totalProjects: advertisements.length > 0
        ? advertisements.length
        : ensureNumber(item.total_projects ?? item.projects_count, 1),
      accountStatus: hasPendingAds
        ? 'pending'
        : publishedAdsCount > 0
          ? 'approved'
          : normalizeFreelancerState(item.account_status ?? item.status ?? item.is_active ?? advertisementNode.status),
      bankDetails: {
        accountName: ensureString(bankNode.account_name ?? bankNode.accountName ?? userNode.name ?? item.name),
        accountNumber: ensureString(bankNode.account_number ?? bankNode.accountNumber),
        bankName: ensureString(bankNode.bank_name ?? bankNode.bankName),
      },
      createdAt: ensureString(item.created_at ?? userNode.created_at ?? item.createdAt, new Date().toISOString()),
    };
  };

  async getFreelancers(): Promise<Freelancer[]> {
    if (!this.hasBackendConfig()) {
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

    const allFreelancersResponse = await this.request<unknown>(API_FREELANCERS_ENDPOINT);
    let bestFreelancersResponse: unknown = [];
    try {
      bestFreelancersResponse = await this.request<unknown>(API_BEST_FREELANCERS_ENDPOINT);
    } catch {
      bestFreelancersResponse = [];
    }

    const rows = firstArray(allFreelancersResponse, ['data', 'freelancers', 'items']);
    const bestRows = firstArray(bestFreelancersResponse, ['data', 'freelancers', 'items']);

    const grouped = new Map<string, Freelancer>();
    const bestCountByUser = new Map<string, number>();

    bestRows.forEach((entry) => {
      const bestItem = asRecord(entry);
      const userId = ensureString(bestItem.user_id ?? asRecord(bestItem.user).id);
      if (!userId) return;
      bestCountByUser.set(userId, (bestCountByUser.get(userId) || 0) + 1);
    });

    rows.forEach((entry) => {
      const item = asRecord(entry);
      const mapped = this.mapFreelancer(item);
      const existing = grouped.get(mapped.id);

      if (!existing) {
        grouped.set(mapped.id, mapped);
        return;
      }

      const bestProjects = bestCountByUser.get(mapped.id) || 0;

      grouped.set(mapped.id, {
        ...(existing || mapped),
        totalProjects: Math.max(existing?.totalProjects || mapped.totalProjects, mapped.totalProjects, bestProjects),
      });
    });

    return [...grouped.values()];
  }

  async getFreelancerById(id: string): Promise<Freelancer | null> {
    const freelancers = await this.getFreelancers();
    return freelancers.find(freelancer => freelancer.id === id) || null;
  }

  async approveFreelancer(id: string): Promise<void> {
    if (!this.hasBackendConfig()) return;

    const formData = new FormData();
    formData.append('status', 'approved');

    await this.request(`dashboard/freelancers/${id}/action`, {
      method: 'POST',
      body: formData,
    }, true);
  }

  async suspendFreelancer(id: string): Promise<void> {
    if (!this.hasBackendConfig()) return;

    const formData = new FormData();
    formData.append('status', 'suspended');

    await this.request(`dashboard/freelancers/${id}/action`, {
      method: 'POST',
      body: formData,
    }, true);
  }

  private async getDashboardCategoriesMap(): Promise<Map<string, string>> {
    if (!this.hasBackendConfig()) return new Map();

    const response = await this.request<unknown>(API_CATEGORIES_ENDPOINT);
    const rows = firstArray(response, ['data', 'categories', 'items']);
    const map = new Map<string, string>();

    rows.forEach((entry) => {
      const item = asRecord(entry);
      const id = ensureString(item.id);
      if (!id) return;
      map.set(id, localizedName(item.name));
    });

    return map;
  }

  private mapService = (item: UnknownRecord, categoriesMap: Map<string, string>): ServiceRequest => {
    const categoryNode = asRecord(item.category);
    const categoryId = ensureString(item.category_id ?? categoryNode.id);
    const categoryName =
      localizedName(categoryNode.name) ||
      categoriesMap.get(categoryId) ||
      ensureString(item.category_name, 'General');

    const days = item.days_availability;
    const availabilityText = Array.isArray(days)
      ? days.map(day => ensureString(day)).filter(Boolean).join(', ')
      : Object.values(asRecord(days)).map(day => ensureString(day)).filter(Boolean).join(', ');

    return {
      id: ensureString(item.id, crypto.randomUUID()),
      freelancerId: ensureString(item.user_id),
      freelancerName: ensureString(item.user_name ?? item.freelancer_name, `#${ensureString(item.user_id, '-')}`),
      serviceName: localizedName(item.title) || ensureString(item.title, 'Untitled Service'),
      description: localizedName(item.description) || ensureString(item.description, '-'),
      price: ensureNumber(item.price),
      category: categoryName,
      images: Array.isArray(item.images)
        ? item.images.map(image => ensureString(image)).filter(Boolean)
        : [],
      status: normalizeTransactionStatus(item.status) as ServiceRequest['status'],
      submittedAt: ensureString(item.created_at, new Date().toISOString()),
      reviewedAt: ensureString(item.approval_at),
      reviewedBy: ensureString(item.approval_by),
      // Surface days availability to admins inside description when backend sends it.
      ...(availabilityText ? { description: `${localizedName(item.description) || ensureString(item.description, '-')} | Days: ${availabilityText}` } : {}),
    };
  };

  async getPendingServices(): Promise<ServiceRequest[]> {
    if (!this.hasBackendConfig()) {
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

    const [categoriesMap, advertisementsResponse] = await Promise.all([
      this.getDashboardCategoriesMap(),
      this.request<unknown>(API_ADVERTISEMENTS_ENDPOINT),
    ]);

    const rows = firstArray(advertisementsResponse, ['data', 'advertisements', 'items']);
    return rows.map(item => this.mapService(asRecord(item), categoriesMap));
  }

  async approveService(id: string): Promise<void> {
    if (!this.hasBackendConfig()) return;
    await this.request(`dashboard/advertisements/${id}/approve`, { method: 'POST' });
  }

  async rejectService(id: string, reason: string): Promise<void> {
    if (!this.hasBackendConfig()) return;
    const formData = new FormData();
    formData.append('note', reason);
    await this.request(`dashboard/advertisements/${id}/reject`, { method: 'POST', body: formData }, true);
  }

  private mapPayment = (item: UnknownRecord): PaymentProof => {
    const id = ensureString(item.id ?? item.transaction_id, crypto.randomUUID());
    const customer = asRecord(item.customer);
    const freelancer = asRecord(item.freelancer);
    const contract = asRecord(item.contract);
    const advertisement = asRecord(item.advertisement ?? item.adv);
    const images = Array.isArray(item.images) ? item.images : [];

    return {
      id,
      contractId: ensureString(item.contract_id ?? contract.id, ''),
      customerId: ensureString(item.customer_id ?? customer.id, ''),
      customerName: ensureString(item.customer_name ?? customer.name, `Customer #${ensureString(item.customer_id, '-')}`),
      freelancerId: ensureString(item.freelancer_id ?? freelancer.id, ''),
      freelancerName: ensureString(item.freelancer_name ?? freelancer.name ?? advertisement.user_name, `Freelancer #${ensureString(item.freelancer_id, '-')}`),
      amount: ensureNumber(item.amount ?? item.paid_amount ?? item.total_amount ?? advertisement.price),
      currency: ensureString(item.currency, 'SAR'),
      receiptImage: ensureString(item.receipt_image ?? item.image ?? item.attachment ?? images[0]),
      senderName: ensureString(item.sender_name ?? item.name ?? customer.name, ''),
      senderBank: ensureString(item.sender_bank ?? item.bank_name ?? item.bank, ''),
      transferDate: ensureString(item.transaction_date ?? item.transfer_date ?? item.paid_at ?? item.created_at, new Date().toISOString()),
      submittedAt: ensureString(item.created_at ?? item.submitted_at, new Date().toISOString()),
      status: normalizeTransactionStatus(item.status),
      rejectionReason: ensureString(item.rejection_reason ?? item.note),
    };
  };

  async getPaymentTransactions(status?: string): Promise<PaymentProof[]> {
    if (!this.hasBackendConfig()) {
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

    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await this.request<unknown>(`dashboard/review-pay-transactions${query}`);
    const rows = firstArray(response, ['transactions', 'data', 'items']);

    return rows.map(item => this.mapPayment(asRecord(item)));
  }

  async getPendingPayments(): Promise<PaymentProof[]> {
    const rows = await this.getPaymentTransactions('pending');
    if (rows.length > 0) return rows;

    const fallback = await this.getPaymentTransactions();
    return fallback.filter(item => item.status === 'pending');
  }

  async createTransaction(payload: CreateTransactionPayload): Promise<void> {
    if (!this.hasBackendConfig()) return;

    const formData = new FormData();
    formData.append('adv_id', payload.advId);

    if (payload.note) formData.append('note', payload.note);
    if (typeof payload.amount === 'number') formData.append('amount', String(payload.amount));

    payload.images?.forEach((file, index) => {
      formData.append('images', file);
      formData.append(`images[${index}]`, file);
    });

    await this.request('dashboard/create-transaction', {
      method: 'POST',
      body: formData,
    }, true);
  }

  async updateTransaction(payload: UpdateTransactionPayload): Promise<void> {
    if (!this.hasBackendConfig()) return;

    const formData = new FormData();
    formData.append('transaction_id', payload.transactionId);
    formData.append('status', payload.status);
    if (payload.note) formData.append('note', payload.note);

    await this.request('dashboard/update-transaction', {
      method: 'POST',
      body: formData,
    }, true);
  }

  async approvePayment(id: string): Promise<void> {
    await this.updateTransaction({ transactionId: id, status: 'completed', note: 'Approved from dashboard' });
  }

  async rejectPayment(id: string, reason: string): Promise<void> {
    await this.updateTransaction({ transactionId: id, status: 'rejected', note: reason });
  }

  private mapContract = (item: UnknownRecord): Contract => {
    const customer = asRecord(item.customer);
    const publisher = asRecord(item.publisher);
    const advertisement = asRecord(item.advertisement);

    return {
      id: ensureString(item.id),
      customerId: ensureString(item.customer_id ?? customer.id),
      customerName: ensureString(customer.name ?? item.customer_name, `Customer #${ensureString(item.customer_id, '-')}`),
      freelancerId: ensureString(item.publisher_id ?? publisher.id),
      freelancerName: ensureString(publisher.name ?? item.publisher_name, `Freelancer #${ensureString(item.publisher_id, '-')}`),
      advertisementId: ensureString(item.advertisement_id ?? advertisement.id),
      serviceName: localizedName(advertisement.title) || ensureString(advertisement.title, 'Service'),
      contractStatus: ensureString(item.contract_status, 'initiated') as Contract['contractStatus'],
      pubStatus: ensureString(item.contr_pub_status, '-'),
      custStatus: ensureString(item.contr_cust_status, '-'),
      amount: ensureNumber(item.actual_amount ?? item.requested_amount ?? advertisement.price),
      createdAt: ensureString(item.created_at, new Date().toISOString()),
      updatedAt: ensureString(item.updated_at ?? item.created_at, new Date().toISOString()),
    };
  };

  async getContracts(): Promise<Contract[]> {
    if (!this.hasBackendConfig()) return [];

    // Fetch contracts from both customer and freelancer perspectives to get all
    const response = await this.request<unknown>('front/contracts-relative?user_type=customer');
    const rows = firstArray(response, ['data', 'contracts', 'items']);
    return rows.map(item => this.mapContract(asRecord(item)));
  }
}

export const apiService = new ApiService();
