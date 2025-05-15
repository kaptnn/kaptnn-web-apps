import { Modal, Form, Input, message, Typography } from 'antd'
import { useDocsCategoryStore } from '@/stores/useDocsCategory'
import { memo, useCallback, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DocsCategoryApi } from '@/utils/axios/api-service'

interface ModalComponentProps {
  token: string
}

const { Paragraph } = Typography

const DocsCategoryModals: React.FC<ModalComponentProps> = ({ token }) => {
  const [form] = Form.useForm()
  const [isPending, startTransition] = useTransition()
  const { selectedItem, modalType, closeModal } = useDocsCategoryStore()
  const router = useRouter()

  const {
    setData: setDocCatData,
    setTotal: setDocCatTotal,
    setLoading: setDocCatLoading
  } = useDocsCategoryStore()

  const fetchData = useCallback(async () => {
    setDocCatLoading(true)
    try {
      const [docCatRes] = await Promise.all([
        DocsCategoryApi.getAllDocsCategory({}, token)
      ])

      setDocCatData(docCatRes.result)
      setDocCatTotal(docCatRes.meta.totalItems)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      message.error('Failed to fetch dashboard data.')
    } finally {
      setDocCatLoading(false)
    }
  }, [token, setDocCatLoading, setDocCatData, setDocCatTotal])

  useEffect(() => {
    fetchData()
    if ((modalType === 'edit' || modalType === 'view') && selectedItem) {
      form.setFieldsValue({ ...selectedItem })
    } else {
      form.resetFields()
    }
  }, [modalType, selectedItem, fetchData, form])

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
          await DocsCategoryApi.createDocsCategory(payload, token)
        } else if (modalType === 'edit' && selectedItem) {
          await DocsCategoryApi.updateDocsCategory(selectedItem.id, payload, token)
        } else if (modalType === 'delete' && selectedItem) {
          await DocsCategoryApi.deleteDocsCategory(selectedItem.id, token)
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
          create: 'Buat Kategori Dokumen',
          view: 'Detail Kategori Dokumen',
          edit: 'Edit Kategori Dokumen',
          delete: 'Hapus Kategori Dokumen'
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
          <Form.Item name="name" label="Nama Kategori" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}
        {modalType === 'view' && selectedItem && (
          <>
            <p>
              <strong>Nama Kategori:</strong> {selectedItem.name}
            </p>
            <p>
              <strong>Dokumen Terbuat:</strong> {selectedItem.document_created}
            </p>
            <p>
              <strong>Dokumen Selesai:</strong> {selectedItem.document_finished}
            </p>
          </>
        )}
        {modalType === 'delete' && selectedItem && (
          <Paragraph>
            Apakah Anda yakin ingin menghapus kategori dokumen{' '}
            <strong>{selectedItem.name}</strong>?
          </Paragraph>
        )}
      </Form>
    </Modal>
  )
}

export default memo(DocsCategoryModals)
