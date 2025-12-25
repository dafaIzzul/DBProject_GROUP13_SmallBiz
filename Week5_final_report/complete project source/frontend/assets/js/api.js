const API_URL = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return !!getToken();
}

// Check if user has required role
function hasRole(requiredRoles) {
    const user = getUser();
    if (!user) return false;
    
    if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    // Add authorization header if token exists
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        
        // Handle unauthorized (token expired or invalid)
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }
        
        return { ...data, statusCode: response.status };
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// ============================================
// PRODUCT API
// ============================================

const ProductAPI = {
    // Get all products
    getAll: () => apiRequest('/products'),
    
    // Get single product
    getById: (id) => apiRequest(`/products/${id}`),
    
    // Create product
    create: (productData) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    }),
    
    // Update product
    update: (id, productData) => apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    }),
    
    // Delete product
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE'
    }),
    
    // Search products
    search: (query) => apiRequest(`/products/search/${encodeURIComponent(query)}`),
    
    // Get low stock products
    getLowStock: () => apiRequest('/products/low-stock')
};

// ============================================
// CATEGORY API
// ============================================

const CategoryAPI = {
    getAll: () => apiRequest('/categories'),
    getById: (id) => apiRequest(`/categories/${id}`),
    create: (data) => apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiRequest(`/categories/${id}`, {
        method: 'DELETE'
    })
};

// ============================================
// CUSTOMER API
// ============================================

const CustomerAPI = {
    getAll: () => apiRequest('/customers'),
    getById: (id) => apiRequest(`/customers/${id}`),
    create: (data) => apiRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiRequest(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiRequest(`/customers/${id}`, {
        method: 'DELETE'
    })
};

// ============================================
// SUPPLIER API
// ============================================

const SupplierAPI = {
    getAll: () => apiRequest('/suppliers'),
    getById: (id) => apiRequest(`/suppliers/${id}`),
    create: (data) => apiRequest('/suppliers', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiRequest(`/suppliers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiRequest(`/suppliers/${id}`, {
        method: 'DELETE'
    })
};

// ============================================
// TRANSACTION API
// ============================================

const TransactionAPI = {
    getAll: () => apiRequest('/transactions'),
    getById: (id) => apiRequest(`/transactions/${id}`),
    getDetails: (id) => apiRequest(`/transactions/${id}/details`),
    create: (data) => apiRequest('/transactions/create', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    cancel: (id) => apiRequest(`/transactions/${id}/cancel`, {
        method: 'PUT'
    }),
    getByDateRange: (startDate, endDate) => 
        apiRequest(`/transactions/date-range?startDate=${startDate}&endDate=${endDate}`)
};

// ============================================
// PURCHASE API
// ============================================

const PurchaseAPI = {
    getAll: () => apiRequest('/purchases'),
    getById: (id) => apiRequest(`/purchases/${id}`),
    getDetails: (id) => apiRequest(`/purchases/${id}/details`),
    create: (data) => apiRequest('/purchases/create', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    cancel: (id) => apiRequest(`/purchases/${id}/cancel`, {
        method: 'PUT'
    })
};

// ============================================
// REPORT API
// ============================================

const ReportAPI = {
    salesSummary: (startDate, endDate) => {
        let url = '/reports/sales-summary';
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        return apiRequest(url);
    },
    
    bestSelling: (limit = 10) => 
        apiRequest(`/reports/best-selling?limit=${limit}`),
    
    inventoryValue: () => apiRequest('/reports/inventory-value'),
    
    lowStock: () => apiRequest('/reports/low-stock')
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format datetime
function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show alert notification
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) {
        console.warn('Alert box not found');
        return;
    }
    
    alertBox.className = `alert alert-${type} show`;
    alertBox.textContent = message;
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}

// Show loading spinner
function showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}



// Transactions API
const transactions = {
  getAll: () => apiCall('/transactions'),
  getById: (id) => apiCall(`/transactions/${id}`),
  getDetails: (id) => apiCall(`/transactions/${id}/details`),
  getByDateRange: (startDate, endDate) => 
    apiCall(`/transactions/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => apiCall('/transactions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  cancel: (id) => apiCall(`/transactions/${id}/cancel`, {
    method: 'PUT'
  })
};

// Categories, Customers, Suppliers - similar pattern
const categories = {
  getAll: () => apiCall('/categories'),
  create: (data) => apiCall('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/categories/${id}`, { method: 'DELETE' })
};

export { auth, products, transactions, categories };