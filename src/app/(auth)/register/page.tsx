import Register from '@/components/layouts/auth/register'
import { CompanyApi } from '@/utils/axios/api-service'
import { CompanyProps } from '@/utils/axios/company'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { seo_data } from '@/utils/constants/seo_data'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: `${seo_data.title.auth.register} | KAP Tambunan & Nasafi`,
  applicationName: 'KAP TNN Datatrail Website',
  creator: 'KAP TNN Tech Teams',
  alternates: {
    canonical: 'https://kaptnn.com/'
  },
  keywords: ['Data', 'Datatrail', 'Accountant', 'Document', 'Document Management']
}

const RegisterPage = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (token) return redirect('/dashboard')

  const params = {
    limit: 100
  }

  const rawCompanies = await CompanyApi.getAllCompanies(params, token)

  const companies = rawCompanies?.result.map((company: CompanyProps) => ({
    value: company.id,
    label: company.company_name
  }))

  return <Register companies={companies} />
}

export default RegisterPage
