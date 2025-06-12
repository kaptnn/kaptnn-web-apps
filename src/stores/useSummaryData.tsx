import { create } from 'zustand'

export interface DataType {
  key: React.Key
  id: string
  name: string
  total: number
}

interface SummaryDataState {
  userRoleCountData: DataType[]
  docsReqStatusData: DataType[]
  docsCatTotalData: DataType[]
  companyUserCountData: DataType[]

  setUserRoleCountData: (data: DataType[]) => void
  setdocsReqStatusData: (data: DataType[]) => void
  setdocsCatTotalData: (data: DataType[]) => void
  setCompanyUserCountData: (data: DataType[]) => void
}

export const useSummaryDataStore = create<SummaryDataState>(set => ({
  userRoleCountData: [],
  docsReqStatusData: [],
  docsCatTotalData: [],
  companyUserCountData: [],

  setUserRoleCountData: userRoleCountData => set({ userRoleCountData }),
  setdocsReqStatusData: docsReqStatusData => set({ docsReqStatusData }),
  setdocsCatTotalData: docsCatTotalData => set({ docsCatTotalData }),
  setCompanyUserCountData: companyUserCountData => set({ companyUserCountData })
}))
