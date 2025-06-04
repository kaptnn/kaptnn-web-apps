import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { seo_data } from '@/utils/constants/seo_data'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: `${seo_data.title.auth['forgot-password']} | KAP Tambunan & Nasafi`,
  applicationName: 'KAP TNN Datatrail Website',
  creator: 'KAP TNN Tech Teams',
  alternates: {
    canonical: 'https://kaptnn.com/'
  },
  keywords: ['Data', 'Datatrail', 'Accountant', 'Document', 'Document Management']
}

const ForgotPasswordPage = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token || token) return redirect('/login')

  return <main></main>
}

export default ForgotPasswordPage
