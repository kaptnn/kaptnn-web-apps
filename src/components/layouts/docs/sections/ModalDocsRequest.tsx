/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Upload,
  Flex,
  Typography,
  Tag
} from 'antd'
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
import { RcFile } from 'antd/es/upload'
import axios from 'axios'
import useAuthStore from '@/stores/AuthStore'

const { Title, Paragraph } = Typography

const { Dragger } = Upload

interface ModalComponentProps {
  token: string
}

const DocsRequestModals: React.FC<ModalComponentProps> = ({ token }) => {
  const [form] = Form.useForm()
  const [isPending, startTransition] = useTransition()
  const { selectedItem, modalType, closeModal } = useDocsRequestStore()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const router = useRouter()

  const {
    data: compData,
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading
  } = useCompanyStore()

  const {
    data: usersData,
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading
  } = useAllUsersStore()

  const {
    data: docCatData,
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
          start_audit_period: dayjs(c.start_audit_period).format('DD-MMMM-YYYY'),
          end_audit_period: dayjs(c.end_audit_period).format('DD-MMMM-YYYY')
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
    beforeUpload: () => false,
    onChange: info => {
      // const { status } = info.file
      // if (status === 'done') {
      //   message.success(`${info.file.name} uploaded successfully.`)
      // } else if (status === 'error') {
      //   message.error(`${info.file.name} upload failed.`)
      // }
      setFileList(info.fileList)
    },
    onRemove: file => {
      setFileList(curr => curr.filter(f => f.uid !== file.uid))
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
          due_date: dayjs(values.due_date)
        }

        switch (modalType) {
          case 'create':
            await DocsRequestApi.createDocsRequest(payload, token)
            message.success('Permintaan dokumen berhasil ditambahkan.')
            break

          case 'edit':
            if (!selectedItem) throw new Error('No item to edit')
            await DocsRequestApi.updateDocsRequest(selectedItem.id, payload, token)
            message.success('Permintaan dokumen berhasil diubah.')
            break

          case 'delete':
            if (!selectedItem) throw new Error('No item to delete')
            await DocsRequestApi.deleteDocsRequest(selectedItem.id, token)
            message.success('Permintaan dokumen berhasil dihapus.')
            break

          case 'upload_request':
            if (!selectedItem) throw new Error('No item to upload files to')

            if (!fileList.length) {
              message.error('No files to upload')
              return
            }

            const form = new FormData()
            form.append('request_id', selectedItem.id)
            fileList.forEach(f => {
              if (f.originFileObj) {
                form.append('file', f.originFileObj)
              }
            })

            await Promise.all(
              fileList.map(f => {
                const form = new FormData()
                form.append('request_id', selectedItem.id)
                if (f.originFileObj) {
                  form.append('file', f.originFileObj)
                }

                return DocsManagerApi.createDocsManager(form, token)
              })
            )

            const dueDateIso = dayjs(selectedItem.due_date, 'DD-MMM-YYYY').format(
              'YYYY-MM-DD'
            )

            await DocsRequestApi.updateDocsRequest(
              selectedItem.id,
              {
                admin_id: selectedItem.admin_id,
                target_user_id: selectedItem.target_user_id,
                category_id: selectedItem.category_id,
                request_title: selectedItem.request_title,
                request_desc: selectedItem.request_desc,
                due_date: dueDateIso,
                upload_date: new Date().toISOString(),
                status: 'uploaded'
              },
              token
            )

            await message.success('All files uploaded successfully')
            break

          default:
            break
        }

        closeModal()
        router.refresh()
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
      <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
        {(modalType === 'create' || modalType === 'edit') && (
          <>
            <Form.Item name="request_title" label="Judul" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="request_desc" label="Deskripsi">
              <Input.TextArea rows={4} />
            </Form.Item>
            {modalType === 'create' && (
              <Form.Item name="company_id" label="Perusahaan">
                <Select placeholder="Pilih Perusahaan" options={companyOptions} />
              </Form.Item>
            )}
            <Form.Item name="target_user_id" label="Target Pengguna">
              <Select
                placeholder="Pilih Target Pengguna"
                options={userOptions}
                disabled={modalType === 'edit'}
              />
            </Form.Item>
            <Form.Item name="category_id" label="Kategori">
              <Select placeholder="Pilih Kategori Dokumen" options={categoryOptions} />
            </Form.Item>
            <Form.Item name="due_date" label="Deadline Pengumpulan">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}

        {modalType === 'view' && selectedItem && (
          <Flex vertical>
            <Title level={5} style={{ fontWeight: 'bold' }}>
              {selectedItem.request_title}
            </Title>
            <Flex vertical>
              <Paragraph className="text-gray-300" style={{ margin: 0 }}>
                Deskripsi:
              </Paragraph>
              <Paragraph className="font-medium text-gray-700" style={{ margin: 0 }}>
                {selectedItem.request_desc}
              </Paragraph>
            </Flex>
            <Flex vertical>
              <Paragraph className="text-gray-300" style={{ margin: 0 }}>
                Deadline Pengumpulan:
              </Paragraph>
              <Paragraph className="font-medium text-gray-700" style={{ margin: 0 }}>
                {selectedItem.due_date}
              </Paragraph>
            </Flex>
            <Flex vertical>
              <Paragraph className="text-gray-300" style={{ margin: 0 }}>
                Status:
              </Paragraph>
              <Tag style={{ margin: 0 }} className="w-max capitalize">
                {selectedItem.status}
              </Tag>
            </Flex>
          </Flex>
        )}

        {modalType === 'delete' && selectedItem && (
          <Flex>
            <Paragraph>
              Apakah Anda yakin ingin menghapus permintaan{' '}
              <strong>{selectedItem.request_title}</strong>?
            </Paragraph>
          </Flex>
        )}

        {modalType === 'upload_request' && selectedItem && (
          <Dragger {...uploadProps}>
            <InboxOutlined />
            <Paragraph className="ant-upload-text">
              Klik atau tarik file ke area ini
            </Paragraph>
            <Paragraph className="ant-upload-hint">
              Anda dapat mengunggah beberapa file sekaligus.
            </Paragraph>
          </Dragger>
        )}

        {modalType === 'delete_request' && selectedItem && (
          <Flex>
            <Paragraph>
              Apakah Anda yakin ingin menghapus permintaan{' '}
              <strong>{selectedItem.request_title}</strong>?
            </Paragraph>
          </Flex>
        )}
      </Form>
    </Modal>
  )
}

export default memo(DocsRequestModals)
