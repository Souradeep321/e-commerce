// ==========================================
// UserAddress
// Matches the UserAddress Prisma model exactly — a user's
// saved, reusable address book entry.
// ==========================================
export interface UserAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// ==========================================
// GET /api/addresses
// All saved addresses, default-first.
// ==========================================
export interface GetAddressesResponse {
  success: boolean;
  message: string;
  addresses: UserAddress[];
}

// ==========================================
// POST /api/addresses
// ==========================================
export interface CreateAddressResponse {
  success: boolean;
  message: string;
  address: UserAddress;
}

// ==========================================
// PATCH /api/addresses/[id]
// Partial update — any subset of fields.
// ==========================================
export interface UpdateAddressResponse {
  success: boolean;
  message: string;
  address: UserAddress;
}

// ==========================================
// DELETE /api/addresses/[id]
// If the deleted address was the default, the route
// auto-promotes another address (if any remain) to default.
// ==========================================
export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

// ==========================================
// PATCH /api/addresses/[id]/default
// ==========================================
export interface SetDefaultAddressResponse {
  success: boolean;
  message: string;
  address: UserAddress;
}