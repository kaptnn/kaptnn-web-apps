import { create } from 'zustand'
import { DataType } from '@/components/layouts/docs-users/utils/table'
import { GetAllUsersParams } from '@/utils/axios/user'

type ModalType = 'create' | 'view' | 'edit' | 'delete' | 'verify' | 'unverify' | null

interface AllUsersState {
  data: DataType[]
  loading: boolean
  open: boolean
  modalType: ModalType
  total: number
  current: number
  pageSize: number
  selectedItem: DataType | null
  selectedRowKeys: React.Key[]
  filters: GetAllUsersParams

  setData: (data: DataType[]) => void
  setLoading: (loading: boolean) => void
  setOpen: (open: boolean) => void
  setModalType: (modalType: ModalType) => void
  setTotal: (total: number) => void
  setCurrent: (current: number) => void
  setPageSize: (size: number) => void
  setSelectedItem: (company: DataType | null) => void
  setSelectedRowKeys: (keys: React.Key[]) => void
  setFilters: (filters: GetAllUsersParams) => void
  resetFilters: () => void

  openModal: (type: Exclude<ModalType, null>, item?: DataType) => void
  closeModal: () => void
}

export const useAllUsersStore = create<AllUsersState>(set => ({
  data: [],
  loading: false,
  open: false,
  modalType: null,
  total: 0,
  current: 1,
  pageSize: 10,
  selectedItem: null,
  selectedRowKeys: [],
  filters: {},

  setData: data => set({ data }),
  setLoading: loading => set({ loading }),
  setOpen: open => set({ open }),
  setModalType: modalType => set({ modalType }),
  setTotal: total => set({ total }),
  setCurrent: current => set({ current }),
  setPageSize: pageSize => set({ pageSize }),
  setSelectedItem: selectedItem => set({ selectedItem }),
  setSelectedRowKeys: selectedRowKeys => set({ selectedRowKeys }),
  setFilters: filters => set(() => ({ filters })),
  resetFilters: () => set(() => ({ filters: {} })),

  openModal: (type, item) =>
    set({
      modalType: type,
      open: true,
      selectedItem: item || null
    }),

  closeModal: () =>
    set({
      open: false,
      modalType: null,
      selectedItem: null
    })
}))
