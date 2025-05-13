import { z } from 'zod'

export const createCompanySchema = z.object({
  company_name: z.string().min(3),
  year_of_assignment: z.number().int(),
  start_audit_period: z.string().min(5),
  end_audit_period: z.string().min(5)
})
