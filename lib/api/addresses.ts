import { apiFetch } from "./client";
import {
  GetAddressesResponse,
  CreateAddressResponse,
  UpdateAddressResponse,
  DeleteAddressResponse,
  SetDefaultAddressResponse,
} from "@/types/api/address.types";
import { AddressInput } from "@/schemas/address.schema";

// ==========================================
// GET /api/addresses
// Always live — this is account data, never cache.
// ==========================================
export function getAddresses() {
  return apiFetch<GetAddressesResponse>("/api/addresses", {
    cache: "no-store",
  });
}

// ==========================================
// POST /api/addresses
// Reuses AddressInput from the Zod schema (note: uses
// `pincode`, mapped to `postalCode` server-side).
// ==========================================
export function createAddress(data: AddressInput) {
  return apiFetch<CreateAddressResponse>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/addresses/[id]
// Accepts a partial AddressInput — only send fields
// that are actually changing.
// ==========================================
export function updateAddress(id: string, data: Partial<AddressInput>) {
  return apiFetch<UpdateAddressResponse>(`/api/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/addresses/[id]
// ==========================================
export function deleteAddress(id: string) {
  return apiFetch<DeleteAddressResponse>(`/api/addresses/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/addresses/[id]/default
// ==========================================
export function setDefaultAddress(id: string) {
  return apiFetch<SetDefaultAddressResponse>(`/api/addresses/${id}/default`, {
    method: "PATCH",
    cache: "no-store",
  });
}