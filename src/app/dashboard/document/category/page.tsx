import DocsCategory from '@/components/layouts/docs-category'
import { UserApi } from '@/utils/axios/api-service'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { seo_data } from '@/utils/constants/seo_data'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.document.category} | KAP Tambunan & Nasafi`,
  applicationName: 'KAP TNN Datatrail Website',
  creator: 'KAP TNN Tech Teams',
  alternates: {
    canonical: 'https://kaptnn.com/'
  },
  keywords: ['Data', 'Datatrail', 'Accountant', 'Document', 'Document Management']
}

const CategoryPage = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) return redirect('/login')

  const currentUser = await UserApi.getCurrentUser(token)
  const isAdmin = currentUser?.profile?.role === 'admin'

  if (!isAdmin) return redirect('/dashboard')

  return (
    <DocsCategory initialToken={token} isAdmin={isAdmin} currentUser={currentUser} />
  )
}

export default CategoryPage
