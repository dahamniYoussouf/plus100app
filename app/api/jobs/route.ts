import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic'

/**
 * API Route pour la recherche d'offres d'emploi réelles
 * 
 * Sources supportées :
 * 1. JSearch API (RapidAPI) - Recherche dans multiple sites
 * 2. Adzuna API - Base de données d'offres
 * 3. Google Jobs Scraping (fallback)
 */

interface JobOffer {
  id: number | string
  title: string
  company: string
  location: string
  salary: string
  type: string
  match: number
  description: string
  requirements: string[]
  link: string
}

// Mots-clés pertinents pour calculer le match
const relevantKeywords = [
  'agentforce', 'salesforce', 'wordpress', 'react', 'next.js', 'node.js',
  'typescript', 'javascript', 'full stack', 'fullstack', 'developer',
  'développeur', 'developer', 'engineer', 'ingénieur', 'frontend', 'backend',
  'api', 'rest', 'graphql', 'woocommerce', 'php', 'python'
]

function calculateMatch(jobTitle: string, jobDescription: string, keywords: string = ''): number {
  const searchText = `${jobTitle} ${jobDescription} ${keywords}`.toLowerCase()
  const matches = relevantKeywords.filter(keyword => 
    searchText.includes(keyword.toLowerCase())
  ).length
  return Math.min(85 + (matches * 2), 98)
}

function normalizeJob(job: any, source: string, keywords: string = ''): JobOffer {
  // Extraction des informations communes
  const title = job.title || job.job_title || job.position || 'Poste non spécifié'
  const company = job.company || job.company_name || job.employer_name || 'Entreprise non spécifiée'
  const location = job.location || job.job_city || job.area || 'Lieu non spécifié'
  const description = job.description || job.snippet || job.job_description || ''
  const link = job.url || job.job_url || job.link || job.apply_link || '#'
  
  // Extraction du salaire
  let salary = 'Non spécifié'
  if (job.salary) {
    salary = job.salary
  } else if (job.salary_min && job.salary_max) {
    salary = `${job.salary_min} - ${job.salary_max} ${job.salary_currency || ''}`
  } else if (job.salary_max) {
    salary = `Jusqu'à ${job.salary_max} ${job.salary_currency || ''}`
  }
  
  // Extraction du type
  const type = job.type || job.job_type || job.employment_type || 'Temps plein'
  
  // Extraction des requirements
  const requirements: string[] = []
  if (job.required_skills) {
    requirements.push(...job.required_skills)
  }
  if (job.required_qualifications) {
    requirements.push(...job.required_qualifications)
  }
  
  // Calcul du match
  const match = calculateMatch(title, description, keywords)
  
  return {
    id: job.id || job.job_id || `${source}-${Date.now()}-${Math.random()}`,
    title,
    company,
    location,
    salary,
    type,
    match,
    description: description.substring(0, 300) + (description.length > 300 ? '...' : ''),
    requirements: requirements.length > 0 ? requirements : ['Non spécifié'],
    link,
  }
}

// Recherche via JSearch API (RapidAPI)
async function searchJSearch(keywords: string, location: string = '') {
  try {
    const apiKey = process.env.RAPIDAPI_KEY || ''
    if (!apiKey) return []

    const query = keywords || 'developer full stack react'
    const locationParam = location ? `&location=${encodeURIComponent(location)}` : ''
    
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}${locationParam}&page=1&num_pages=3&employment_types=FULLTIME&remote_jobs_only=false`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
        next: { revalidate: 3600 } // Cache 1 heure
      }
    )

    if (!response.ok) {
      console.error('JSearch API error:', response.status)
      return []
    }

    const data = await response.json()
    if (data.data && Array.isArray(data.data)) {
      return data.data.slice(0, 20).map((job: any) => normalizeJob(job, 'jsearch', keywords))
    }
    return []
  } catch (error) {
    console.error('JSearch search error:', error)
    return []
  }
}

// Recherche via Adzuna API
async function searchAdzuna(keywords: string, location: string = 'fr') {
  try {
    const appId = process.env.ADZUNA_APP_ID || ''
    const appKey = process.env.ADZUNA_APP_KEY || ''
    
    if (!appId || !appKey) return []

    const query = keywords || 'developer'
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/${location}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${encodeURIComponent(query)}&content-type=application/json`,
      {
        next: { revalidate: 3600 } // Cache 1 heure
      }
    )

    if (!response.ok) {
      console.error('Adzuna API error:', response.status)
      return []
    }

    const data = await response.json()
    if (data.results && Array.isArray(data.results)) {
      return data.results.map((job: any) => normalizeJob(job, 'adzuna', keywords))
    }
    return []
  } catch (error) {
    console.error('Adzuna search error:', error)
    return []
  }
}

// Recherche via SerpAPI (Google Jobs)
async function searchGoogleJobs(keywords: string, location: string = '') {
  try {
    const apiKey = process.env.SERPAPI_KEY || ''
    if (!apiKey) return []

    const query = keywords || 'developer full stack'
    const locationParam = location || 'France'
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&location=${encodeURIComponent(locationParam)}&api_key=${apiKey}`,
      {
        next: { revalidate: 3600 } // Cache 1 heure
      }
    )

    if (!response.ok) {
      console.error('SerpAPI error:', response.status)
      return []
    }

    const data = await response.json()
    if (data.jobs_results && Array.isArray(data.jobs_results)) {
      return data.jobs_results.slice(0, 15).map((job: any) => normalizeJob(job, 'google', keywords))
    }
    return []
  } catch (error) {
    console.error('Google Jobs search error:', error)
    return []
  }
}

// Offres simulées en fallback
function getFallbackJobs(keywords: string = ''): JobOffer[] {
  const allJobs: JobOffer[] = [
    {
      id: 'fallback-1',
      title: 'Développeur Agentforce Senior',
      company: 'Levio',
      location: 'Montréal, QC / Remote',
      salary: '80k - 120k CAD',
      type: 'Temps plein',
      match: 98,
      description: 'Recherche développeur Agentforce expérimenté pour projets de transformation digitale.',
      requirements: ['Agentforce', 'JavaScript', 'React', 'API Integration', '5+ ans'],
      link: 'https://levio.ca/careers',
    },
    {
      id: 'fallback-2',
      title: '  (React/Node.js)',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '70k - 100k USD',
      type: 'Temps plein',
      match: 95,
      description: 'Développeur full stack pour application web moderne.',
      requirements: ['React', 'Next.js', 'Node.js', 'TypeScript', '4+ ans'],
      link: 'https://startupxyz.com/careers',
    },
    {
      id: 'fallback-3',
      title: 'WordPress Developer E-commerce',
      company: 'EcomSolutions',
      location: 'Remote',
      salary: '50k - 75k EUR',
      type: 'Temps plein',
      match: 90,
      description: 'Développeur WordPress/WooCommerce pour plateformes e-commerce.',
      requirements: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', '3+ ans'],
      link: 'https://ecomsolutions.com/jobs',
    },
  ]

  if (keywords) {
    const lowerKeywords = keywords.toLowerCase()
    return allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(lowerKeywords) ||
        job.company.toLowerCase().includes(lowerKeywords) ||
        job.description.toLowerCase().includes(lowerKeywords)
    )
  }

  return allJobs
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const keywords = searchParams.get('keywords') || 'developer full stack react'
    const location = searchParams.get('location') || ''
    const source = searchParams.get('source') || 'all'

    let allJobs: JobOffer[] = []

    // Recherche multi-sources en parallèle
    const searches: Promise<JobOffer[]>[] = []

    if (source === 'all' || source === 'jsearch') {
      searches.push(searchJSearch(keywords, location))
    }
    
    if (source === 'all' || source === 'adzuna') {
      searches.push(searchAdzuna(keywords, location || 'fr'))
    }
    
    if (source === 'all' || source === 'google') {
      searches.push(searchGoogleJobs(keywords, location))
    }

    // Attendre toutes les recherches
    const results = await Promise.allSettled(searches)
    
    // Combiner les résultats
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allJobs.push(...result.value)
      }
    })

    // Dédupliquer par titre et entreprise
    const uniqueJobs = Array.from(
      new Map(allJobs.map((job) => [`${job.title}-${job.company}`, job])).values()
    )

    // Trier par match décroissant
    uniqueJobs.sort((a, b) => b.match - a.match)

    // Limiter à 30 offres
    const limitedJobs = uniqueJobs.slice(0, 30)

    // Si aucune offre trouvée, utiliser le fallback
    if (limitedJobs.length === 0) {
      console.log('Aucune offre trouvée, utilisation du fallback')
      return NextResponse.json({
        jobs: getFallbackJobs(keywords),
        source: 'fallback',
        count: getFallbackJobs(keywords).length,
      })
    }

    return NextResponse.json({
      jobs: limitedJobs,
      source: source === 'all' ? 'multi' : source,
      count: limitedJobs.length,
    })
  } catch (error) {
    console.error('Job search API error:', error)
    
    // Fallback en cas d'erreur
    const keywords = request.nextUrl.searchParams.get('keywords') || ''
    return NextResponse.json({
      jobs: getFallbackJobs(keywords),
      source: 'fallback',
      count: getFallbackJobs(keywords).length,
      error: 'Erreur lors de la recherche, utilisation des offres de démonstration',
    })
  }
}



