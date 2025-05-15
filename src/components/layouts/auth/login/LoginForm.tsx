'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import axiosInstance from '@/utils/axios'
import useAuthStore from '@/stores/AuthStore'
import { z } from 'zod'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Flex, Typography, notification } from 'antd'
import { memo, useEffect, useState, useTransition } from 'react'
import { loginSchema } from '@/utils/constants/user'
import { AuthApi, CompanyApi, UserApi } from '@/utils/axios/api-service'

const { Paragraph } = Typography

const LoadingPage = dynamic(() => import('@/components/elements/LoadingPage'), {
  ssr: false,
  loading: () => (
    <main role="status" aria-live="polite" className="h-screen w-full bg-white">
      Loading...
    </main>
  )
})

const Login = () => {
  const [form] = Form.useForm()
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const setAuth = useAuthStore(state => state.setAuth)
  const setUserInfo = useAuthStore(state => state.setUserInfo)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <LoadingPage />

  const handleFinish = async (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        const response = await AuthApi.loginUser({
          email: values.email,
          password: values.password
        })
        if (!response?.access_token) {
          notification.error({
            message: 'Login Gagal',
            description: 'Email atau kata sandi salah.'
          })
          window.location.href = '/login'
          return
        }

        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.access_token}`

        const now = new Date()
        const accessTokenExp = new Date(now.getTime() + 60 * 60 * 1000)
        const refreshTokenExp = new Date(now.getTime() + 60 * 60 * 1000 * 24 * 7)

        document.cookie = `access_token=${
          response.access_token
        }; expires=${accessTokenExp.toUTCString()}; path=/; secure; samesite=strict`
        document.cookie = `refresh_token=${
          response.refresh_token
        }; expires=${refreshTokenExp.toUTCString()}; path=/; secure; samesite=strict`

        setAuth(response.access_token, response.refresh_token)

        const rawCurrentUserData = await UserApi.getCurrentUser(response.access_token)
        const rawCompanyByIdData = await CompanyApi.getCompanyById(
          rawCurrentUserData.company_id,
          response.access_token
        )

        setUserInfo({
          ...rawCurrentUserData,
          company_name: rawCompanyByIdData.company_name
        })

        notification.success({
          message: 'Berhasil Masuk',
          description: 'Selamat datang kembali!'
        })
        window.location.href = '/dashboard'
      } catch (error: unknown) {
        let errorMessage = 'Something went wrong!'
        if (error instanceof Error) {
          errorMessage = error.message
        }
        console.error('Login Error:', errorMessage)
      }
    })
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-16 bg-white md:mb-0 md:grid-cols-2 md:gap-6">
      <div className="h-full w-full bg-blue-600 p-8 md:min-h-screen">
        <Button icon={<ArrowLeftOutlined />} href="/">
          Back to Home
        </Button>
      </div>
      <div className="flex w-full flex-col px-5 md:items-center md:justify-center md:px-24">
        <Form
          form={form}
          onFinish={handleFinish}
          className="w-full"
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[{ required: true, message: 'Email wajib diisi' }]}
          >
            <Input
              autoComplete="email"
              type="email"
              placeholder="Masukkan email anda"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Kata Sandi"
            rules={[{ required: true, message: 'Kata sandi wajib diisi' }]}
          >
            <Input.Password
              autoComplete="current-password"
              placeholder="Masukkan kata sandi anda"
            />
          </Form.Item>

          <Form.Item name="rememberMe">
            <Flex justify="space-between" align="center">
              <Checkbox onChange={e => e.target.checked}>Remember me</Checkbox>
              <Link href="/forgot-password">Lupa Kata Sandi?</Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={isPending}>
              {isPending ? 'Tunggu Sebentar' : 'Masuk'}
            </Button>
          </Form.Item>

          <Paragraph className="text-center">
            Belum mempunyai akun? <Link href="/register">Daftar Sekarang</Link>
          </Paragraph>
        </Form>
      </div>
    </div>
  )
}

export default memo(Login)
