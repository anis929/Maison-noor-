export type ProductShape    = 'rond' | 'carre' | 'aviateur' | 'papillon' | 'pantos' | 'geometrique'
export type ProductMaterial = 'corne-buffle' | 'acetate' | 'metal-or' | 'metal-titane' | 'mixte'
export type ProductCategory = 'optique' | 'solaire'
export type ProductGender   = 'homme' | 'femme' | 'mixte'

export interface ProductSpecs {
  dimensions: string
  weight:     string
  origin:     string
}

export interface Product {
  slug:        string
  name:        string
  price:       number
  category:    ProductCategory
  shape:       ProductShape
  material:    ProductMaterial
  color:       string
  gender:      ProductGender
  edition:     number
  images:      string[]
  description: string
  story:       string
  specs:       ProductSpecs
}

export interface RitualStep {
  number:   string
  title:    string
  body:     string
  keyword:  string
}

export interface NavLink {
  href:  string
  label: string
}
