export type LocaleType = 'zh-CN' | 'en-US'

export interface TranslationSchema {
  loadingDocx: string
  loadingPdf: string
  loadingXlsx: string
  loadingMd: string
  loadingText: string
  loadingImage: string
  loadingPptx: string
  nextPage: string
  prevPage: string
  slide: string
  zoomIn: string
  zoomOut: string
  rotate: string
  fullscreen: string
  unsupported: string
  download: string
  page: string
  total: string
}

export const locales: Record<LocaleType, TranslationSchema> = {
  'zh-CN': {
    loadingDocx: '解析 DOCX 文档中...',
    loadingPdf: '正在读取 PDF...',
    loadingXlsx: '解析 Excel 数据中...',
    loadingMd: '加载 Markdown 中...',
    loadingText: '读取文本中...',
    loadingImage: '加载图片中...',
    loadingPptx: '解析 PPTX 幻灯片中...',
    nextPage: '下一页',
    prevPage: '上一页',
    slide: '幻灯片',
    zoomIn: '放大',
    zoomOut: '缩小',
    rotate: '旋转',
    fullscreen: '全屏',
    unsupported: '暂不支持直接预览该格式',
    download: '下载源文件',
    page: '页',
    total: '共'
  },
  'en-US': {
    loadingDocx: 'Parsing DOCX document...',
    loadingPdf: 'Loading PDF...',
    loadingXlsx: 'Parsing Excel spreadsheet...',
    loadingMd: 'Loading Markdown...',
    loadingText: 'Reading text...',
    loadingImage: 'Loading image...',
    loadingPptx: 'Parsing PPTX slides...',
    nextPage: 'Next',
    prevPage: 'Prev',
    slide: 'Slide',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    rotate: 'Rotate',
    fullscreen: 'Fullscreen',
    unsupported: 'Preview not supported for this format',
    download: 'Download File',
    page: 'Page',
    total: 'Total'
  }
}

export function t(key: keyof TranslationSchema, locale: LocaleType = 'zh-CN', customDict?: Partial<TranslationSchema>): string {
  if (customDict && customDict[key]) {
    return customDict[key]!
  }
  const dict = locales[locale] || locales['zh-CN']
  return dict[key] || key
}
