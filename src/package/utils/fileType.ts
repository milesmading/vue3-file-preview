export type SupportedFileType = 
  | 'pdf' 
  | 'docx' 
  | 'xlsx' 
  | 'csv'
  | 'pptx'
  | 'md' 
  | 'txt' 
  | 'code'
  | 'json'
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'unknown'

export function detectFileType(fileNameOrPath: string, mimeType?: string): SupportedFileType {
  const name = fileNameOrPath.toLowerCase()

  if (mimeType) {
    if (mimeType.includes('pdf')) return 'pdf'
    if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) return 'docx'
    if (mimeType.includes('spreadsheetml') || mimeType.includes('excel')) return 'xlsx'
    if (mimeType.includes('presentationml') || mimeType.includes('powerpoint')) return 'pptx'
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('json')) return 'json'
    if (mimeType.includes('markdown')) return 'md'
  }

  const ext = name.split('.').pop() || ''

  switch (ext) {
    case 'pdf':
      return 'pdf'
    case 'docx':
    case 'doc':
      return 'docx'
    case 'xlsx':
    case 'xls':
      return 'xlsx'
    case 'csv':
      return 'csv'
    case 'pptx':
    case 'ppt':
      return 'pptx'
    case 'md':
    case 'markdown':
      return 'md'
    case 'txt':
      return 'txt'
    case 'json':
      return 'json'
    case 'js':
    case 'ts':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
    case 'c':
    case 'cpp':
    case 'go':
    case 'rs':
    case 'vue':
    case 'sh':
      return 'code'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'svg':
    case 'bmp':
    case 'ico':
      return 'image'
    case 'mp4':
    case 'webm':
    case 'ogg':
    case 'mov':
    case 'mkv':
      return 'video'
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return 'audio'
    default:
      return 'unknown'
  }
}
