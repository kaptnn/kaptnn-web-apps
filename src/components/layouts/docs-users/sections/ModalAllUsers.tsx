/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  message,
  Typography,
  Select,
  Tag,
  Flex,
  Divider
} from 'antd'
import { useAllUsersStore } from '@/stores/useAllUsersStore'
import { memo, useCallback, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useCompanyStore } from '@/stores/useCompanyStore'
import { AuthApi, CompanyApi, UserApi } from '@/utils/axios/api-service'
import dayjs from 'dayjs'
import { CheckCircleFilled, CloseCircleFilled, GlobalOutlined } from '@ant-design/icons'

interface ModalComponentProps {
  token: string
}

const { Paragraph, Title } = Typography

const AllUsersModals: React.FC<ModalComponentProps> = ({ token }) => {
  const [form] = Form.useForm()
  const [isPending, startTransition] = useTransition()
  const { selectedItem, modalType, closeModal } = useAllUsersStore()
  const router = useRouter()

  const {
    data: compData,
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
    if (modalType === 'view' && selectedItem) {
      form.setFieldsValue({ ...selectedItem })
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
        const payload = { ...values }

        if (modalType === 'create') {
          await AuthApi.registerUser(payload, token)
          message.success('Pengguna baru berhasil ditambahkan.')
        } else if (modalType === 'delete' && selectedItem) {
          await UserApi.deleteUserById(selectedItem.id, token)
          message.success('Pengguna baru berhasil dihapus.')
        } else if (modalType === 'verify' && selectedItem) {
          await UserApi.updateUserById(
            selectedItem.id,
            {
              role: selectedItem.profile.role,
              membership_status: selectedItem.profile.membership_status,
              is_verified: true
            },
            token
          )
          message.success('Pengguna berhasil diverifikasi.')
        } else if (modalType === 'unverify' && selectedItem) {
          await UserApi.updateUserById(
            selectedItem.id,
            {
              role: selectedItem.profile.role,
              membership_status: selectedItem.profile.membership_status,
              is_verified: false
            },
            token
          )
          message.success('Pengguna berhasil dinonaktifkan.')
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

  const companies = compData?.map((company: any) => ({
    value: company.id,
    label: company.company_name
  }))

  return (
    <Modal
      open={!!modalType}
      title={
        {
          create: 'Buat Pengguna Baru',
          view: 'Detail Data Pengguna',
          delete: 'Hapus Data Pengguna',
          verify: 'Verifikasi Data Pengguna',
          unverify: 'Menonaktifkan Data Pengguna'
        }[modalType!]
      }
      centered
      onCancel={closeModal}
      onOk={handleFinish}
      okButtonProps={{
        danger: modalType === 'delete' || modalType === 'unverify',
        loading: isPending
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
        {modalType === 'create' && (
          <>
            <Form.Item
              name="name"
              label="Nama Lengkap"
              rules={[
                {
                  required: true,
                  message: 'Nama lengkap wajib diisi.',
                  whitespace: true
                }
              ]}
            >
              <Input autoComplete="name" placeholder="Masukkan nama lengkap" />
            </Form.Item>

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  required: true,
                  message: 'Masukkan email yang valid.',
                  whitespace: true,
                  type: 'email'
                }
              ]}
            >
              <Input placeholder="contoh@domain.com" autoComplete="email" />
            </Form.Item>

            <Form.Item
              name="company_id"
              label="Nama Perusahaan"
              rules={[{ required: true, message: 'Pilih perusahaan Anda.' }]}
            >
              <Select placeholder="Pilih Perusahaan" options={companies} />
            </Form.Item>

            <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-6">
              <Form.Item
                name="password"
                label="Kata Sandi"
                rules={[{ required: true, message: 'Kata sandi wajib diisi.' }]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Masukkan kata sandi"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Konfirmasi Kata Sandi"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Konfirmasi kata sandi wajib diisi.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Kata sandi tidak cocok.'))
                    }
                  })
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                />
              </Form.Item>
            </div>
          </>
        )}
        {modalType === 'view' && selectedItem && (
          <>
            <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
              {selectedItem.name}
            </Title>
            <Paragraph style={{ margin: 0, marginTop: 8 }}>
              Email: {selectedItem.email}
            </Paragraph>
            <Divider style={{ marginBlock: 16 }} />
            <Flex vertical gap={8}>
              <Flex align="center" gap={8}>
                <Tag
                  icon={<GlobalOutlined />}
                  color="blue"
                  style={{ margin: 0, borderRadius: 9999 }}
                >
                  {selectedItem.company_name}
                </Tag>
              </Flex>
              <div className="mt-2 grid w-full grid-cols-3 gap-6">
                <Flex vertical>
                  <Paragraph style={{ margin: 0 }}>Verifikasi:</Paragraph>
                  <Paragraph style={{ margin: 0, fontWeight: 600 }}>
                    {selectedItem.profile.is_verified ? (
                      <CheckCircleFilled style={{ color: 'green' }} />
                    ) : (
                      <CloseCircleFilled style={{ color: 'red' }} />
                    )}
                  </Paragraph>
                </Flex>
                <Flex vertical>
                  <Paragraph style={{ margin: 0 }}>Role:</Paragraph>
                  <Paragraph
                    style={{ margin: 0, fontWeight: 600 }}
                    className="capitalize"
                  >
                    {selectedItem.profile.role}
                  </Paragraph>
                </Flex>
                <Flex vertical>
                  <Paragraph style={{ margin: 0 }}>Status Membership:</Paragraph>
                  <Paragraph
                    style={{ margin: 0, fontWeight: 600 }}
                    className="capitalize"
                  >
                    {selectedItem.profile.membership_status}
                  </Paragraph>
                </Flex>
              </div>
            </Flex>
          </>
        )}
        {modalType === 'delete' && selectedItem && (
          <Paragraph>
            Apakah Anda yakin ingin menghapus permintaan{' '}
            <strong>{selectedItem.name}</strong>?
          </Paragraph>
        )}
        {modalType === 'verify' && selectedItem && (
          <Paragraph>
            Apakah Anda yakin ingin memverifikasi data pengguna{' '}
            <strong>{selectedItem.name}</strong>?
          </Paragraph>
        )}
        {modalType === 'unverify' && selectedItem && (
          <Paragraph>
            Apakah Anda yakin ingin menonaktifkan data pengguna{' '}
            <strong>{selectedItem.name}</strong>?
          </Paragraph>
        )}
      </Form>
    </Modal>
  )
}

export default memo(AllUsersModals)
