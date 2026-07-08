export const AUTH_PATTERNS = {
  REGISTER: 'auth.register',
  LOGIN: 'auth.login',
  VERIFY_TOKEN: 'auth.verify-token',
} as const;

export const CATALOG_PATTERNS = {
  CREATE_PRODUCT: 'catalog.create-product',
  FIND_PRODUCTS: 'catalog.find-products',
  FIND_PRODUCT_BY_ID: 'catalog.find-product-by-id',
} as const;

export const INVENTORY_PATTERNS = {
  CREATE_STOCK: 'inventory.create-stock',
  RESERVE_STOCK: 'inventory.reserve-stock',
  RELEASE_STOCK: 'inventory.release-stock',
  GET_STOCK: 'inventory.get-stock',
} as const;

export const ORDER_PATTERNS = {
  CREATE_ORDER: 'orders.create-order',
  FIND_MY_ORDERS: 'orders.find-my-orders',
} as const;

export const NOTIFICATION_PATTERNS = {
  SEND_EMAIL: 'notifications.send-email',
} as const;
