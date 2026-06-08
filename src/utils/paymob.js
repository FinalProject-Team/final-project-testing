import axios from 'axios';

const PAYMOB_API_BASE = 'https://accept.paymob.com/api';

/**
 * Step 1: Authenticate and get auth token
 */
export async function getAuthToken() {
  const apiKey = import.meta.env.VITE_PAYMOB_API_KEY;
  if (!apiKey) throw new Error('VITE_PAYMOB_API_KEY is not set');

  const { data } = await axios.post(`${PAYMOB_API_BASE}/auth/tokens`, {
    api_key: apiKey,
  });

  if (!data.token) throw new Error('Failed to retrieve Paymob auth token');
  return data.token;
}

/**
 * Step 2: Register order and get order ID
 */
export async function registerOrder({ authToken, amountCents, currency = 'EGP', items = [] }) {
  const { data } = await axios.post(`${PAYMOB_API_BASE}/ecommerce/orders`, {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: amountCents,
    currency,
    items,
  });

  if (!data.id) throw new Error('Failed to register Paymob order');
  return data.id;
}

/**
 * Step 3: Get payment key
 */
export async function getPaymentKey({ authToken, orderId, amountCents, currency = 'EGP', billingData }) {
  const integrationId = import.meta.env.VITE_PAYMOB_INTEGRATION_ID;
  if (!integrationId) throw new Error('VITE_PAYMOB_INTEGRATION_ID is not set');

  const { data } = await axios.post(`${PAYMOB_API_BASE}/acceptance/payment_keys`, {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: {
      apartment: 'NA',
      email: billingData.email || 'customer@example.com',
      floor: 'NA',
      first_name: billingData.firstName || 'Customer',
      street: 'NA',
      building: 'NA',
      phone_number: billingData.phone || '+20000000000',
      shipping_method: 'NA',
      postal_code: 'NA',
      city: 'Cairo',
      country: 'EG',
      last_name: billingData.lastName || '',
      state: 'Cairo',
    },
    currency,
    integration_id: Number(integrationId),
    lock_order_when_paid: false,
  });

  if (!data.token) throw new Error('Failed to get Paymob payment key');
  return data.token;
}

/**
 * Build the Paymob iframe URL
 */
export function buildIframeUrl(paymentKey) {
  const iframeId = import.meta.env.VITE_PAYMOB_IFRAME_ID;
  if (!iframeId) throw new Error('VITE_PAYMOB_IFRAME_ID is not set');
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
}

/**
 * Full flow: auth → order → payment key → iframe URL
 */
export async function initiatePaymobPayment({ amountCents, currency = 'EGP', billingData, items = [] }) {
  const authToken = await getAuthToken();
  const orderId = await registerOrder({ authToken, amountCents, currency, items });
  const paymentKey = await getPaymentKey({ authToken, orderId, amountCents, currency, billingData });
  const iframeUrl = buildIframeUrl(paymentKey);
  return { iframeUrl, orderId, paymentKey };
}

/**
 * Parse cardholder name into first/last
 */
export function parseCardholderName(fullName = '') {
  const parts = fullName.trim().split(' ');
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

/**
 * Validate card form fields
 */
export function validateCardForm({ cardNumber, cardholderName, expiry, cvv }) {
  const errors = {};

  const rawCard = cardNumber.replace(/\s/g, '');
  if (!rawCard) errors.cardNumber = 'Card number is required';
  else if (!/^\d{16}$/.test(rawCard)) errors.cardNumber = 'Enter a valid 16-digit card number';

  if (!cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
  else if (cardholderName.trim().split(' ').length < 2) errors.cardholderName = 'Enter full name';

  if (!expiry) errors.expiry = 'Expiry date is required';
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) errors.expiry = 'Use MM/YY format';
  else {
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    const expDate = new Date(2000 + year, month - 1);
    if (expDate < now) errors.expiry = 'Card has expired';
  }

  if (!cvv) errors.cvv = 'CVV is required';
  else if (!/^\d{3,4}$/.test(cvv)) errors.cvv = 'Invalid CVV';

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Format card number with spaces every 4 digits
 */
export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Format expiry input as MM/YY
 */
export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}
