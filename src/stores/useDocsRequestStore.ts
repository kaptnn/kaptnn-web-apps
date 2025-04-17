import { create } from "zustand";
import { DataType } from "@/components/layouts/docs/utils/table";

interface DocsRequestState {
  data: DataType[];
  loading: boolean;
  open: boolean;
  total: number;
  modalType: string | null;
  current: number;
  pageSize: number;
  selectedCompany: DataType | null;
  selectedRowKeys: React.Key[];

  setData: (data: DataType[]) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  setTotal: (total: number) => void;
  setModalType: (modalType: string | null) => void;
  setCurrent: (current: number) => void;
  setPageSize: (size: number) => void;
  setSelectedCompany: (company: DataType | null) => void;
  setSelectedRowKeys: (keys: React.Key[]) => void;
}

export const useDocsRequestStore = create<DocsRequestState>((set) => ({
  data: [],
  loading: false,
  open: false,
  total: 0,
  modalType: null,
  current: 1,
  pageSize: 5,
  selectedCompany: null,
  selectedRowKeys: [],

  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
  setTotal: (total) => set({ total }),
  setModalType: (modalType) => set({ modalType }),
  setCurrent: (current) => set({ current }),
  setPageSize: (pageSize) => set({ pageSize }),
  setSelectedCompany: (selectedCompany) => set({ selectedCompany }),
  setSelectedRowKeys: (selectedRowKeys) => set({ selectedRowKeys }),
}));
