import Register from '@/components/layouts/auth/register'
import { CompanyApi } from '@/utils/axios/api-service'
import { CompanyProps } from '@/utils/axios/company'
import { getCookie } from '@/utils/axios/utils'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { seo_data } from '@/utils/constants/seo_data'

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
  const token = await getCookie('access_token')
  if (token) redirect('/dashboard')

  const rawCompanies = await CompanyApi.getAllCompanies({}, token)

  const companies = rawCompanies.result.map((company: CompanyProps) => ({
    value: company.id,
    label: company.company_name
  }))

  return <Register companies={companies} />
}

export default RegisterPage
