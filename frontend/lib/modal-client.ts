interface GenerateLogoParams {
  description: string
  style: string
  industry?: string
  colors?: string[]
  width?: number
  height?: number
  additionalDetails?: string
  seed?: number
}

interface GenerateLogoResponse {
  image_base64: string
  prompt_used: string
  seed: number
  generation_time_seconds: number
}

interface SegmentImageParams {
  image_base64: string
  points: number[][]
  labels: number[]
}

interface SegmentImageResponse {
  mask_base64: string
}

interface InpaintLogoParams {
  image_base64: string
  mask_base64: string
  edit_instruction: string
  seed?: number
}

interface InpaintLogoResponse {
  image_base64: string
  seed: number
  prompt_used: string
}

export async function generateLogoModal(params: GenerateLogoParams): Promise<GenerateLogoResponse> {
  const url = process.env.NEXT_PUBLIC_MODAL_GENERATE_URL
  
  console.log('=== Modal API Call Debug ===')
  console.log('URL:', url)
  console.log('Params:', params)
  
  if (!url) {
    throw new Error('NEXT_PUBLIC_MODAL_GENERATE_URL environment variable is not set. Please add it to frontend/.env.local')
  }
  
  const payload = {
    description: params.description,
    style: params.style,
    industry: params.industry,
    colors: params.colors,
    width: params.width || 1024,
    height: params.height || 1024,
    additional_details: params.additionalDetails,
    seed: params.seed,
  }
  
  console.log('Request payload:', JSON.stringify(payload, null, 2))
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  console.log('Response status:', response.status)
  console.log('Response headers:', Object.fromEntries(response.headers.entries()))

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error response:', errorText)
    const error = JSON.parse(errorText || '{}')
    throw new Error(error.detail || error.message || `Logo generation failed with status ${response.status}`)
  }

  const result = await response.json()
  console.log('Success! Received image_base64 length:', result.image_base64?.length || 0)
  console.log('Generation metadata:', { 
    seed: result.seed, 
    time: result.generation_time_seconds
  })
  console.log('FULL PROMPT SENT TO DIFFUSION MODEL:')
  console.log(result.prompt_used)
  console.log('--- END PROMPT ---')
  
  return result
}

export async function segmentImageModal(params: SegmentImageParams): Promise<SegmentImageResponse> {
  const response = await fetch(process.env.NEXT_PUBLIC_MODAL_SEGMENT_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Segmentation failed' }))
    throw new Error(error.detail || 'Image segmentation failed')
  }

  return response.json()
}

export async function inpaintLogoModal(params: InpaintLogoParams): Promise<InpaintLogoResponse> {
  const response = await fetch(process.env.NEXT_PUBLIC_MODAL_INPAINT_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Inpainting failed' }))
    throw new Error(error.detail || 'Logo editing failed')
  }

  return response.json()
}
