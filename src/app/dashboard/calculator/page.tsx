import AllCalculator from '@/components/layouts/calculator'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { seo_data } from '@/utils/constants/seo_data'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import { UserApi } from '@/utils/axios/api-service'

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.calculator.page} | KAP Tambunan & Nasafi`,
  applicationName: 'KAP TNN Datatrail Website',
  creator: 'KAP TNN Tech Teams',
  alternates: {
    canonical: 'https://kaptnn.com/'
  },
  keywords: ['Data', 'Datatrail', 'Accountant', 'Document', 'Document Management']
}

const MaintainedPage = dynamic(() => import('@/components/elements/MaintainedPage'), {
  ssr: true,
  loading: () => (
    <main role="status" aria-live="polite" className="h-screen w-full bg-gray-50" />
  )
})

const NotVerfiedPage = dynamic(() => import('@/components/elements/NotVerfiedPage'), {
  ssr: true,
  loading: () => (
    <main role="status" aria-live="polite" className="h-screen w-full bg-gray-50" />
  )
})

const CalculatorPage = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) return redirect('/login')

  const maintained = true

  if (maintained) return <MaintainedPage />

  const currentUser = await UserApi.getCurrentUser(token)

  if (!currentUser?.profile?.is_verified) return <NotVerfiedPage />

  return <AllCalculator />
}

export default CalculatorPage
