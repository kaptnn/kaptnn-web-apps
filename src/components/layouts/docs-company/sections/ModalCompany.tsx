/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  InputNumber,
  Typography,
  Divider,
  Flex,
  Tag
} from 'antd'
import { useCompanyStore } from '@/stores/useCompanyStore'
import { memo, useCallback, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useAllUsersStore } from '@/stores/useAllUsersStore'
import { CompanyApi, UserApi } from '@/utils/axios/api-service'
import dayjs from 'dayjs'
import { GlobalOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

interface ModalComponentProps {
  token: string
}

const CompanyModals: React.FC<ModalComponentProps> = ({ token }) => {
  const [form] = Form.useForm()
  const [isPending, startTransition] = useTransition()
  const { selectedItem, modalType, closeModal } = useCompanyStore()
  const router = useRouter()

  const {
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading
  } = useCompanyStore()

  const {
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading
  } = useAllUsersStore()

  const fetchData = useCallback(async () => {
    setCompLoading(true)
    setUsersLoading(true)
    try {
      const [compRes, usersRes] = await Promise.all([
        CompanyApi.getAllCompanies({}, token),
        UserApi.getAllUsers({}, token)
      ])

      const formattedCompanies = compRes.result.map((c: any) => ({
        ...c,
        key: c.id,
        start_audit_period: dayjs(c.start_audit_period).format('DD-MMMM-YYYY'),
        end_audit_period: dayjs(c.end_audit_period).format('DD-MMMM-YYYY')
      }))

      setCompData(formattedCompanies)
      setCompTotal(compRes.meta.totalItems)

      setUsersData(usersRes.result)
      setUsersTotal(usersRes.meta.totalItems)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      message.error('Failed to fetch dashboard data.')
    } finally {
      setCompLoading(false)
      setUsersLoading(false)
    }
  }, [
    token,
    setCompLoading,
    setUsersLoading,
    setCompData,
    setCompTotal,
    setUsersData,
    setUsersTotal
  ])

  useEffect(() => {
    fetchData()
    if ((modalType === 'edit' || modalType === 'view') && selectedItem) {
      form.setFieldsValue({
        ...selectedItem,
        start_audit_period: selectedItem.start_audit_period
          ? dayjs(selectedItem.start_audit_period)
          : null,
        end_audit_period: selectedItem.end_audit_period
          ? dayjs(selectedItem.end_audit_period)
          : null
      })
    } else {
      form.resetFields()
    }
  }, [modalType, selectedItem, form, fetchData])

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
          start_audit_period: dayjs(values.start_audit_period),
          end_audit_period: dayjs(values.end_audit_period)
        }

        if (modalType === 'create') {
          await CompanyApi.createCompany(payload, token)
          message.success('Perusahaan berhasil dibuat.')
        } else if (modalType === 'edit' && selectedItem) {
          await CompanyApi.updateCompany(selectedItem.id, payload, token)
          message.success('Perusahaan berhasil diubah.')
        } else if (modalType === 'delete' && selectedItem) {
          await CompanyApi.deleteCompany(selectedItem.id, token)
          message.success('Perusahaan berhasil dihapus.')
        }

        closeModal()
        router.refresh()
      } catch (error: unknown) {
        if (error) {
          const errorMessage = error || 'Something went wrong!'
          console.error('Login Error:', errorMessage)
          message.error('Terjadi kesalahan, silakan coba lagi.')
        } else {
          console.error('Network Error:', error)
        }
      }
    })
  }, [closeModal, form, modalType, router, selectedItem, token])

  return (
    <Modal
      open={!!modalType}
      title={
        {
          create: 'Buat Data Perusahaan Baru',
          view: 'Detail Data Perusahaan',
          edit: 'Edit Data Perusahaan',
          delete: 'Hapus Data Perusahaan'
        }[modalType!]
      }
      centered
      onCancel={closeModal}
      onOk={handleFinish}
      okButtonProps={{ danger: modalType === 'delete', loading: isPending }}
      cancelText="Batal"
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
        {(modalType === 'create' || modalType === 'edit') && (
          <>
            <Form.Item
              name="company_name"
              label="Nama Perusahaan"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="year_of_assignment"
              label="Tahun Penugasan"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                name="start_audit_period"
                label="Waktu Periode Mulai"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="end_audit_period"
                label="Waktu Periode Selesai"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </div>
          </>
        )}
        {modalType === 'view' && selectedItem && (
          <>
            <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
              {selectedItem.company_name}
            </Title>
            <Divider style={{ marginBlock: 16 }} />
            <Flex vertical gap={8}>
              <Flex align="center" gap={8}>
                <Tag
                  icon={<GlobalOutlined />}
                  color="blue"
                  style={{ margin: 0, borderRadius: 9999 }}
                >
                  Tahun Penugasan
                </Tag>
                <Paragraph style={{ margin: 0, fontWeight: 600 }}>
                  {selectedItem.year_of_assignment}
                </Paragraph>
              </Flex>
              <div className="grid w-full grid-cols-2 gap-6">
                <Flex vertical>
                  <Paragraph style={{ margin: 0 }}>Tanggal Mulai Audit:</Paragraph>
                  <Paragraph style={{ margin: 0, fontWeight: 600 }}>
                    {dayjs(selectedItem.start_audit_period).format('DD-MMMM-YYYY')}
                  </Paragraph>
                </Flex>
                <Flex vertical>
                  <Paragraph style={{ margin: 0 }}>Tanggal Selesai Audit:</Paragraph>
                  <Paragraph style={{ margin: 0, fontWeight: 600 }}>
                    {dayjs(selectedItem.end_audit_period).format('DD-MMMM-YYYY')}
                  </Paragraph>
                </Flex>
              </div>
            </Flex>
          </>
        )}
        {modalType === 'delete' && selectedItem && (
          <Paragraph>
            Apakah Anda yakin ingin menghapus data perusahaan{' '}
            <strong>{selectedItem.company_name}</strong>?
          </Paragraph>
        )}
      </Form>
    </Modal>
  )
}

export default memo(CompanyModals)
