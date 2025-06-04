import LoadingPage from '@/components/elements/LoadingPage'
import { seo_data } from '@/utils/constants/seo_data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${seo_data.title.loading} | KAP Tambunan & Nasafi`,
  applicationName: 'KAP TNN Datatrail Website',
  creator: 'KAP TNN Tech Teams',
  alternates: {
    canonical: 'https://kaptnn.com/'
  },
  keywords: ['Data', 'Datatrail', 'Accountant', 'Document', 'Document Management']
}

const Loading = () => {
  return <LoadingPage />
}

export default Loading
