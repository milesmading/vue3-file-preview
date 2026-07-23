export async function loadFileAsArrayBuffer(src: string | File | Blob | ArrayBuffer): Promise<ArrayBuffer> {
  if (src instanceof ArrayBuffer) {
    return src
  }
  if (src instanceof Blob || src instanceof File) {
    return await src.arrayBuffer()
  }
  if (typeof src === 'string') {
    const response = await fetch(src)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    return await response.arrayBuffer()
  }
  throw new Error('Unsupported file source type')
}

export async function loadFileAsText(src: string | File | Blob | ArrayBuffer): Promise<string> {
  if (typeof src === 'string') {
    // If it looks like a URL or file path with protocol/extension, fetch it, otherwise treat as inline string
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('/') || src.startsWith('./')) {
      const response = await fetch(src)
      return await response.text()
    }
    return src
  }
  const buffer = await loadFileAsArrayBuffer(src)
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(buffer)
}

export function loadFileAsUrl(src: string | File | Blob | ArrayBuffer): string {
  if (typeof src === 'string') {
    return src
  }
  if (src instanceof Blob || src instanceof File) {
    return URL.createObjectURL(src)
  }
  if (src instanceof ArrayBuffer) {
    const blob = new Blob([src])
    return URL.createObjectURL(blob)
  }
  return ''
}
