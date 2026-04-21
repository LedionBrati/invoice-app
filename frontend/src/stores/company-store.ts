"use client";

import { create } from "zustand";

interface CompanyState {
    companyId: string | null;
    companyName: string | null;
    isLoading: boolean;
    setCompany: (id: string, name: string) => void;
    clear: () => void;
    setLoading: (loading: boolean) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
    companyId: null,
    companyName: null,
    isLoading: true,
    setCompany: (id, name) => set({ companyId: id, companyName: name, isLoading: false }),
    clear: () => set({ companyId: null, companyName: null, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
}));
