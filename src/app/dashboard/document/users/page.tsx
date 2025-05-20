import AllUsers from '@/components/layouts/docs-users'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { seo_data } from '@/utils/constants/seo_data'
import { UserApi } from '@/utils/axios/api-service'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.user.users} | KAP Tambunan & Nasafi`,
  applicationName: 'KAP TNN Datatrail Website',
  creator: 'KAP TNN Tech Teams',
  alternates: {
    canonical: 'https://kaptnn.com/'
  },
  keywords: ['Data', 'Datatrail', 'Accountant', 'Document', 'Document Management']
}

const NotVerfiedPage = dynamic(() => import('@/components/elements/NotVerfiedPage'), {
  ssr: true,
  loading: () => (
    <main role="status" aria-live="polite" className="h-screen w-full bg-gray-50" />
  )
})

const AllUsersPage = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) return redirect('/login')

  const currentUser = await UserApi.getCurrentUser(token)
  const isAdmin = currentUser?.profile?.role === 'admin'

  if (!currentUser?.profile?.is_verified) return <NotVerfiedPage />

  return <AllUsers initialToken={token} isAdmin={isAdmin} currentUser={currentUser} />
}

export default AllUsersPage
