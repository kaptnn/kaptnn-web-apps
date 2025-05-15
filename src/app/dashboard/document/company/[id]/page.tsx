import { UserApi } from '@/utils/axios/api-service'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const CompanyByIdPage = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) return redirect('/login')

  const currentUser = await UserApi.getCurrentUser(token)
  const isAdmin = currentUser?.profile?.role === 'admin'

  if (!isAdmin) return redirect('/dashboard')

  return <main>CompanyByIdPage</main>
}

export default CompanyByIdPage
