import type { Audience, BenefitAudience } from './utils'

export type Category = {
  id: string
  name: string
  slug: string
  icon: string | null
  sort_order: number
  active: boolean
}

export type Benefit = {
  id: string
  title: string
  company_name: string
  category_id: string
  audience: BenefitAudience
  category?: Category
  logo_url: string | null
  cover_image_url: string | null
  short_description: string
  full_description: string
  who_can_apply: string
  how_to_apply: string
  how_to_redeem: string
  terms_conditions: string | null
  external_link: string | null
  contact_email: string | null
  contact_phone: string | null
  valid_from: string | null
  valid_until: string | null
  status: 'active' | 'inactive'
  is_featured: boolean
  is_new: boolean
  slug: string
  created_at: string
  updated_at: string
}

export type Faq = {
  id: string
  question: string
  answer: string
  audience: Audience
  sort_order: number
  active: boolean
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  audience: Audience
  status: 'pending' | 'read'
  created_at: string
}
