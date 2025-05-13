import AllDocsManager from '@/components/layouts/docs'
import { getCookie } from '@/utils/axios/utils'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { seo_data } from '@/utils/constants/seo_data'
import { UserApi } from '@/utils/axios/api-service'

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.document.request} | KAP Tambunan & Nasafi`,
  applicationName: 'KAP TNN Datatrail Website',
  creator: 'KAP TNN Tech Teams',
  alternates: {
    canonical: 'https://kaptnn.com/'
  },
  keywords: ['Data', 'Datatrail', 'Accountant', 'Document', 'Document Management']
}

const DocumentManagementPage = async () => {
  const token = await getCookie('access_token')
  if (!token) redirect('/login')

  const currentUser = await UserApi.getCurrentUser(token)
  const isAdmin = currentUser.profile.role === 'admin'

  return (
    <AllDocsManager initialToken={token} isAdmin={isAdmin} currentUser={currentUser} />
  )
}

export default DocumentManagementPage
