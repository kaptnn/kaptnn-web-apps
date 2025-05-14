'use client'

import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Select, Typography } from 'antd'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { registerSchema } from '@/utils/constants/user'
import { z } from 'zod'
import { AuthApi } from '@/utils/axios/api-service'
import LoadingPage from '@/components/elements/LoadingPage'

const { Paragraph } = Typography

const Register = ({ companies }: { companies: { value: string; label: string }[] }) => {
  const [form] = Form.useForm()
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <LoadingPage />

  const handleFinish = (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        const response = await AuthApi.registerUser({
          name: values.name,
          email: values.email,
          company_id: values.company_id,
          password: values.password
        })

        if (response.status === 201) {
          router.push('/login')
        }
      } catch (error: unknown) {
        if (error) {
          const errorMessage = error || 'Something went wrong!'
          console.error('Login Error:', errorMessage)
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
                message: 'Masukkan nama lengkap anda!',
                whitespace: true
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: 'Masukkan nama lengkap anda!',
                whitespace: true
              }
            ]}
          >
            <Input />
          </Form.Item>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-6">
            <Form.Item
              name="phoneNumber"
              label="Nomor Telepon"
              rules={[{ required: true, message: 'Masukkan nomor telepon anda!' }]}
            >
              <Input addonBefore={'+62'} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="company_id"
              label="Nama Perusahaan"
              rules={[{ required: true, message: 'Masukkan nama perusahaan anda!' }]}
            >
              <Select placeholder="Pilih Metode Perhitungan" options={companies} />
            </Form.Item>
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-6">
            <Form.Item name="password" label="Kata Sandi" hasFeedback>
              <Input.Password />
            </Form.Item>

            <Form.Item name="confirmPassword" label="Konfirmasi Kata Sandi" hasFeedback>
              <Input.Password />
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
                    : Promise.reject(new Error('Should accept agreement'))
              }
            ]}
          >
            <Checkbox onChange={e => e.target.checked}>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isPending}
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

export default Register
