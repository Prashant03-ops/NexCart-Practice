
const API_BASE_URL = process.env.REACT_APP_API_URL;

export async function apiRequest(path, options = {}) {
  let userInfo = null;

  try {
    userInfo = JSON.parse(
      localStorage.getItem('userInfo') || 'null'
    );
  } catch {
    userInfo = null;
  }

  const headers = {
    ...options.headers
  };

  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (userInfo?.token) {
    headers.Authorization = `Bearer ${userInfo.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const contentType = response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === 'object'
        ? data.message || `Request failed (${response.status})`
        : data || `Request failed (${response.status})`
    );
  }

  return data;
}

export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(amount || 0));


