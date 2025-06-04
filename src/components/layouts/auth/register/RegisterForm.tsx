'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, notification, Select, Typography } from 'antd'
import { memo, useEffect, useState, useTransition } from 'react'
import { registerSchema } from '@/utils/constants/user'
import { z } from 'zod'
import { AuthApi } from '@/utils/axios/api-service'

const { Paragraph } = Typography

const LoadingPage = dynamic(() => import('@/components/elements/LoadingPage'), {
  ssr: false,
  loading: () => (
    <main role="status" aria-live="polite" className="h-screen w-full bg-gray-50" />
  )
})

const Register = ({ companies }: { companies: { value: string; label: string }[] }) => {
  const [form] = Form.useForm()
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <LoadingPage />

  const handleFinish = async (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        const response = await AuthApi.registerUser({
          name: values.name,
          email: values.email,
          company_id: values.company_id,
          password: values.password
        })

        if (response.status === 201) {
          notification.success({
            message: 'Registrasi Berhasil',
            description: 'Silakan login untuk melanjutkan.'
          })
          window.location.href = '/login'
        }
      } catch (error: unknown) {
        if (error) {
          const errorMessage = error || 'Something went wrong!'
          console.error('Login Error:', errorMessage)
          notification.error({
            message: 'Registrasi Gagal',
            description: 'Silakan coba lagi nanti.'
          })
        } else {
          console.error('Network Error:', error)
        }
      }
    })
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-16 bg-white pb-16 md:grid-cols-2 md:gap-6 md:pb-0">
      <div className="h-full min-h-32 w-full bg-blue-600 p-8 md:min-h-screen">
        <Button icon={<ArrowLeftOutlined />} href="/">
          Back to Home
        </Button>
      </div>
      <div className="flex w-full flex-col bg-white px-5 md:items-center md:justify-center md:px-24">
        <Form
          form={form}
          onFinish={handleFinish}
          className="w-full"
          layout="vertical"
          scrollToFirstError
        >
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
            <Select
              showSearch
              placeholder="Pilih Perusahaan"
              options={companies}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
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

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Anda harus setuju dengan perjanjian.'))
              }
            ]}
          >
            <Checkbox onChange={e => e.target.checked}>
              I have read the{' '}
              <Link href="/agreement" target="_blank" rel="noopener noreferrer">
                agreement
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isPending}
              aria-busy={isPending}
            >
              {isPending ? 'Tunggu Sebentar' : 'Daftar Sekarang'}
            </Button>
          </Form.Item>

          <Paragraph className="text-center">
            Sudah mempunyai akun?
            <Link href="/login"> Masuk</Link>
          </Paragraph>
        </Form>
      </div>
    </div>
  )
}

export default memo(Register)
