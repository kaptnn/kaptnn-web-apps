/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, DatePicker, message, Select, Upload, Spin } from 'antd'
import { useDocsRequestStore } from '@/stores/useDocsRequestStore'
import { memo, useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import {
  CompanyApi,
  DocsCategoryApi,
  DocsManagerApi,
  DocsRequestApi,
  UserApi
} from '@/utils/axios/api-service'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { useDocsCategoryStore } from '@/stores/useDocsCategory'
import { useAllUsersStore } from '@/stores/useAllUsersStore'
import { useCompanyStore } from '@/stores/useCompanyStore'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { CreateDocMetadata } from '@/utils/axios/docs/manager'

interface ModalComponentProps {
  token: string
}

const DocsRequestModals: React.FC<ModalComponentProps> = ({ token }) => {
  const { selectedItem, modalType, closeModal } = useDocsRequestStore()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const {
    data: compData,
    loading: compLoading,
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading
  } = useCompanyStore()

  const {
    data: usersData,
    loading: usersLoading,
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading
  } = useAllUsersStore()

  const {
    data: docCatData,
    loading: docCatLoading,
    setData: setDocCatData,
    setTotal: setDocCatTotal,
    setLoading: setDocCatLoading
  } = useDocsCategoryStore()

  const fetchData = useCallback(async () => {
    setCompLoading(true)
    setUsersLoading(true)
    setDocCatLoading(true)
    try {
      const [compRes, usersRes, docCatRes] = await Promise.all([
        CompanyApi.getAllCompanies({}, token),
        UserApi.getAllUsers({}, token),
        DocsCategoryApi.getAllDocsCategory({}, token)
      ])

      setCompData(
        compRes.result.map((c: any) => ({
          ...c,
          key: c.id,
          start_audit_period: new Date(c.start_audit_period)
            .toISOString()
            .split('T')[0],
          end_audit_period: new Date(c.end_audit_period).toISOString().split('T')[0]
        }))
      )
      setCompTotal(compRes.meta.totalItems)

      setUsersData(usersRes.result)
      setUsersTotal(usersRes.meta.totalItems)

      setDocCatData(docCatRes.result)
      setDocCatTotal(docCatRes.meta.totalItems)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      message.error('Failed to fetch dashboard data.')
    } finally {
      setCompLoading(false)
      setUsersLoading(false)
      setDocCatLoading(false)
    }
  }, [
    token,
    setCompLoading,
    setUsersLoading,
    setDocCatLoading,
    setCompData,
    setCompTotal,
    setUsersData,
    setUsersTotal,
    setDocCatData,
    setDocCatTotal
  ])

  useEffect(() => {
    if (!modalType) return

    fetchData()

    if ((modalType === 'edit' || modalType === 'view') && selectedItem) {
      form.setFieldsValue({
        ...selectedItem,
        due_date: selectedItem.due_date ? dayjs(selectedItem.due_date) : undefined
      })
    } else {
      form.resetFields()
      setFileList([])
    }
  }, [modalType, selectedItem, form, fetchData])

  const selectedCompanyId = Form.useWatch('company_id', form)
  const filteredUsers = useMemo(
    () =>
      selectedCompanyId
        ? usersData.filter(u => u.company_id === selectedCompanyId)
        : usersData,
    [selectedCompanyId, usersData]
  )

  const companyOptions = useMemo(
    () => compData.map(c => ({ value: c.id, label: c.company_name })),
    [compData]
  )
  const userOptions = useMemo(
    () => filteredUsers.map(u => ({ value: u.id, label: u.name })),
    [filteredUsers]
  )
  const categoryOptions = useMemo(
    () => docCatData.map(cat => ({ value: cat.id, label: cat.name })),
    [docCatData]
  )

  const uploadProps: UploadProps = {
    multiple: true,
    onRemove: file => {
      setFileList(prev => prev.filter(f => f.uid !== file.uid))
    },
    beforeUpload: file => {
      setFileList(prev => [...prev, file])
      return false
    },
    fileList
  }

  const handleFinish = useCallback(async () => {
    startTransition(async () => {
      try {
        if (modalType === 'view') {
          closeModal()
          return
        }

        const values = form.getFieldsValue()
        const payload = {
          ...values,
          due_date: values.due_date ? dayjs(values.due_date).toISOString() : undefined
        }

        switch (modalType) {
          case 'create':
            await DocsRequestApi.createDocsRequest(payload, token)
            break

          case 'edit':
            if (!selectedItem) throw new Error('No item to edit')
            await DocsRequestApi.updateDocsRequest(selectedItem.id, payload, token)
            break

          case 'delete':
            if (!selectedItem) throw new Error('No item to delete')
            await DocsRequestApi.deleteDocsRequest(selectedItem.id, token)
            break

          case 'upload_request':
            if (!selectedItem) throw new Error('No item to upload files to')
            const metadata: CreateDocMetadata = {
              request_id: selectedItem.id,
              document_name: values.title
            }

            await Promise.all(
              fileList.map(file => {
                if (!file.originFileObj) {
                  return Promise.reject(new Error('Missing file object for upload'))
                }
                return DocsManagerApi.createDocsManager(
                  metadata,
                  file.originFileObj as File,
                  token
                )
              })
            )
            break

          default:
            break
        }

        message.success('Operasi berhasil')
        router.refresh()
        closeModal()
      } catch (error: unknown) {
        if (error) {
          const errorMessage = error || 'Something went wrong!'
          console.error('Login Error:', errorMessage)
          message.error(
            (errorMessage as Error).message || 'Terjadi kesalahan. Silakan coba lagi.'
          )
        } else {
          console.error('Network Error:', error)
        }
      }
    })
  }, [closeModal, fileList, form, modalType, router, selectedItem, token])

  return (
    <Modal
      open={!!modalType}
      title={
        {
          create: 'Buat Permintaan Dokumen',
          view: 'Detail Permintaan Dokumen',
          edit: 'Edit Permintaan Dokumen',
          delete: 'Hapus Permintaan Dokumen',
          upload_request: 'Upload Permintaan Dokumen',
          edit_request: 'Edit Informasi Dokumen Anda',
          delete_request: 'Hapus Dokumen Anda'
        }[modalType!]
      }
      centered
      onCancel={closeModal}
      onOk={handleFinish}
      okButtonProps={{ danger: modalType === 'delete', loading: isPending }}
      okText={isPending ? 'Tunggu Sebentar' : 'OK'}
      cancelText="Batal"
      forceRender
    >
      {(compLoading || usersLoading || docCatLoading) && <Spin />}
      <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
        {(modalType === 'create' || modalType === 'edit') && (
          <>
            <Form.Item name="request_title" label="Judul" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="request_desc" label="Deskripsi">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="company_id" label="Perusahaan">
              <Select placeholder="Pilih Perusahaan" options={companyOptions} />
            </Form.Item>
            <Form.Item name="target_user_id" label="Target Pengguna">
              <Select placeholder="Pilih Target Pengguna" options={userOptions} />
            </Form.Item>
            <Form.Item name="category_id" label="Kategori">
              <Select placeholder="Pilih Kategori Dokumen" options={categoryOptions} />
            </Form.Item>
            <Form.Item name="due_date" label="Due Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}
        {modalType === 'view' && selectedItem && (
          <>
            <p>
              <strong>Judul:</strong> {selectedItem.request_title}
            </p>
            <p>
              <strong>Deskripsi:</strong> {selectedItem.request_desc}
            </p>
            <p>
              <strong>Target Pengguna:</strong> {selectedItem.target_user_id}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedItem.due_date}
            </p>
            <p>
              <strong>Status:</strong> {selectedItem.status}
            </p>
          </>
        )}
        {modalType === 'delete' && selectedItem && (
          <p>
            Apakah Anda yakin ingin menghapus permintaan{' '}
            <strong>{selectedItem.request_title}</strong>?
          </p>
        )}

        {modalType === 'upload_request' && selectedItem && (
          <>
            <Form.Item
              name="title"
              label="Judul Upload"
              rules={[{ required: true, message: 'Judul diperlukan' }]}
            >
              <Input maxLength={255} />
            </Form.Item>
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Klik atau tarik file ke area ini</p>
              <p className="ant-upload-hint">
                Anda dapat mengunggah beberapa file sekaligus.
              </p>
            </Upload.Dragger>
          </>
        )}

        {modalType === 'edit_request' && selectedItem && <></>}

        {modalType === 'delete_request' && selectedItem && <></>}
      </Form>
    </Modal>
  )
}

export default memo(DocsRequestModals)
