import { create } from "zustand";
import { DataType } from "@/components/layouts/docs/utils/table";

type ModalType = "create" | "view" | "edit" | "delete" | null;

interface DocsRequestState {
  data: DataType[];
  loading: boolean;
  open: boolean;
  modalType: ModalType;
  total: number;
  current: number;
  pageSize: number;
  selectedItem: DataType | null;
  selectedRowKeys: React.Key[];

  setData: (data: DataType[]) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  setModalType: (modalType: ModalType) => void;
  setTotal: (total: number) => void;
  setCurrent: (current: number) => void;
  setPageSize: (size: number) => void;
  setSelectedItem: (item: DataType | null) => void;
  setSelectedRowKeys: (keys: React.Key[]) => void;

  openModal: (type: Exclude<ModalType, null>, item?: DataType) => void;
  closeModal: () => void;
}

export const useDocsRequestStore = create<DocsRequestState>((set) => ({
  data: [],
  loading: false,
  open: false,
  modalType: null,
  total: 0,
  current: 1,
  pageSize: 5,
  selectedItem: null,
  selectedRowKeys: [],

  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
  setModalType: (modalType) => set({ modalType }),
  setTotal: (total) => set({ total }),
  setCurrent: (current) => set({ current }),
  setPageSize: (pageSize) => set({ pageSize }),
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setSelectedRowKeys: (selectedRowKeys) => set({ selectedRowKeys }),

  openModal: (type, item) =>
    set({
      modalType: type,
      open: true,
      selectedItem: item || null,
    }),

  closeModal: () =>
    set({
      open: false,
      modalType: null,
      selectedItem: null,
    }),
}));
