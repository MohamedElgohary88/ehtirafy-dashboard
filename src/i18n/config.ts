import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      // Navigation
      'nav.dashboard': 'لوحة التحكم',
      'nav.customers': 'العملاء',
      'nav.freelancers': 'المصورون',
      'nav.services': 'الخدمات',
      'nav.payments': 'المدفوعات',
      'nav.logout': 'تسجيل الخروج',
      'nav.language': 'اللغة',
      'nav.theme': 'المظهر',

      // Overview Page
      'overview.title': 'نظرة عامة',
      'overview.totalCustomers': 'إجمالي العملاء',
      'overview.totalFreelancers': 'إجمالي المصورين',
      'overview.activeContracts': 'العقود النشطة',
      'overview.pendingPayments': 'المدفوعات المعلقة',
      'overview.totalRevenue': 'إجمالي الإيرادات',
      'overview.recentActivity': 'النشاط الأخير',
      'overview.totalBookings': 'إجمالي الحجوزات',
      'overview.completedProjects': 'المشاريع المكتملة',
      'overview.approvalRate': 'نسبة الموافقات',
      'overview.averageRating': 'متوسط التقييم',
      'overview.heroSubtitle': 'متابعة لحظية للموافقات والعقود ونمو المنصة بجودة عالية.',
      'overview.growth': 'نمو شهري +14%',
      'overview.systemStable': 'استقرار المنصة',
      'overview.lastUpdated': 'آخر تحديث',

      // Customers Page
      'customers.title': 'إدارة العملاء',
      'customers.addCustomer': 'إضافة عميل',
      'customers.name': 'الاسم',
      'customers.email': 'البريد الإلكتروني',
      'customers.phone': 'رقم الهاتف',
      'customers.totalBookings': 'إجمالي الحجوزات',
      'customers.totalSpent': 'المبلغ المدفوع',
      'customers.status': 'الحالة',
      'customers.actions': 'الإجراءات',
      'customers.viewDetails': 'عرض التفاصيل',
      'customers.bookingHistory': 'سجل الحجوزات',

      // Freelancers Page
      'freelancers.title': 'إدارة المصورين',
      'freelancers.portfolio': 'معرض الأعمال',
      'freelancers.accountStatus': 'حالة الحساب',
      'freelancers.approve': 'الموافقة',
      'freelancers.suspend': 'إيقاف',
      'freelancers.rating': 'التقييم',
      'freelancers.totalProjects': 'إجمالي المشاريع',
      'freelancers.bankDetails': 'بيانات البنك',

      // Services Page
      'services.title': 'مراجعة الخدمات',
      'services.pending': 'المعلقة',
      'services.serviceName': 'اسم الخدمة',
      'services.freelancer': 'المصور',
      'services.price': 'السعر',
      'services.category': 'الفئة',
      'services.accept': 'قبول',
      'services.reject': 'رفض',
      'services.viewDetails': 'عرض التفاصيل',

      // Payments Page
      'payments.title': 'التحقق من المدفوعات',
      'payments.pending': 'المعلقة',
      'payments.customer': 'العميل',
      'payments.freelancer': 'المصور',
      'payments.amount': 'المبلغ',
      'payments.currency': 'العملة',
      'payments.receipt': 'الإيصال',
      'payments.senderDetails': 'بيانات المرسل',
      'payments.transferDate': 'تاريخ التحويل',
      'payments.approvePayment': 'الموافقة على الدفع',
      'payments.rejectPayment': 'رفض الدفع',
      'payments.rejectionReason': 'سبب الرفض',
      'payments.allVerified': 'تم التحقق من جميع المدفوعات، لا توجد مدفوعات معلقة حالياً.',
      'payments.rejectionPlaceholder': 'اكتب سبب الرفض، مثل: الإيصال غير واضح أو المبلغ لا يطابق المطلوب.',
      'payments.approveHint': 'الموافقة على هذه الدفعة ستُفعّل العقد مباشرة بين العميل والمصور.',
      'payments.bank': 'البنك',

      // Shared labels
      'common.senderDetails': 'بيانات المرسل',
      'common.bank': 'البنك',

      // Common
      'common.actions': 'الإجراءات',
      'common.status': 'الحالة',
      'common.createdAt': 'تاريخ الإنشاء',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.delete': 'حذف',
      'common.edit': 'تعديل',
      'common.close': 'إغلاق',
      'common.loading': 'جاري التحميل...',
      'common.error': 'حدث خطأ',
      'common.success': 'تم بنجاح',
      'common.active': 'نشط',
      'common.inactive': 'غير نشط',
      'common.pending': 'معلق',
      'common.approved': 'موافق عليه',
      'common.rejected': 'مرفوض',
      'common.suspended': 'موقوف',
    },
  },
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.customers': 'Customers',
      'nav.freelancers': 'Freelancers',
      'nav.services': 'Services',
      'nav.payments': 'Payments',
      'nav.logout': 'Logout',
      'nav.language': 'Language',
      'nav.theme': 'Theme',

      // Overview Page
      'overview.title': 'Overview',
      'overview.totalCustomers': 'Total Customers',
      'overview.totalFreelancers': 'Total Freelancers',
      'overview.activeContracts': 'Active Contracts',
      'overview.pendingPayments': 'Pending Payments',
      'overview.totalRevenue': 'Total Revenue',
      'overview.recentActivity': 'Recent Activity',
      'overview.totalBookings': 'Total Bookings',
      'overview.completedProjects': 'Completed Projects',
      'overview.approvalRate': 'Approval Rate',
      'overview.averageRating': 'Average Rating',
      'overview.heroSubtitle': 'Live visibility across approvals, contracts, and marketplace growth.',
      'overview.growth': 'Monthly growth +14%',
      'overview.systemStable': 'System stable',
      'overview.lastUpdated': 'Last updated',

      // Customers Page
      'customers.title': 'Customer Management',
      'customers.addCustomer': 'Add Customer',
      'customers.name': 'Name',
      'customers.email': 'Email',
      'customers.phone': 'Phone',
      'customers.totalBookings': 'Total Bookings',
      'customers.totalSpent': 'Total Spent',
      'customers.status': 'Status',
      'customers.actions': 'Actions',
      'customers.viewDetails': 'View Details',
      'customers.bookingHistory': 'Booking History',

      // Freelancers Page
      'freelancers.title': 'Freelancer Management',
      'freelancers.portfolio': 'Portfolio',
      'freelancers.accountStatus': 'Account Status',
      'freelancers.approve': 'Approve',
      'freelancers.suspend': 'Suspend',
      'freelancers.rating': 'Rating',
      'freelancers.totalProjects': 'Total Projects',
      'freelancers.bankDetails': 'Bank Details',

      // Services Page
      'services.title': 'Service Approval',
      'services.pending': 'Pending',
      'services.serviceName': 'Service Name',
      'services.freelancer': 'Freelancer',
      'services.price': 'Price',
      'services.category': 'Category',
      'services.accept': 'Accept',
      'services.reject': 'Reject',
      'services.viewDetails': 'View Details',

      // Payments Page
      'payments.title': 'Payment Verification',
      'payments.pending': 'Pending',
      'payments.customer': 'Customer',
      'payments.freelancer': 'Freelancer',
      'payments.amount': 'Amount',
      'payments.currency': 'Currency',
      'payments.receipt': 'Receipt',
      'payments.senderDetails': 'Sender Details',
      'payments.transferDate': 'Transfer Date',
      'payments.approvePayment': 'Approve Payment',
      'payments.rejectPayment': 'Reject Payment',
      'payments.rejectionReason': 'Rejection Reason',
      'payments.allVerified': 'All payments are verified. No pending payments right now.',
      'payments.rejectionPlaceholder': 'Enter rejection reason, for example: invalid receipt or amount mismatch.',
      'payments.approveHint': 'Approving this payment will activate the contract between customer and freelancer.',
      'payments.bank': 'Bank',

      // Shared labels
      'common.senderDetails': 'Sender Details',
      'common.bank': 'Bank',

      // Common
      'common.actions': 'Actions',
      'common.status': 'Status',
      'common.createdAt': 'Created At',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.close': 'Close',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.active': 'Active',
      'common.inactive': 'Inactive',
      'common.pending': 'Pending',
      'common.approved': 'Approved',
      'common.rejected': 'Rejected',
      'common.suspended': 'Suspended',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
