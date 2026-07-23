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
  pdfPages: string
}

export const locales: Record<LocaleType, TranslationSchema> = {
  'zh-CN': {
    loadingDocx: '正在解析 DOCX 文档...',
    loadingPdf: '正在读取 PDF...',
    loadingXlsx: '正在解析 Excel 数据表...',
    loadingMd: '正在加载 Markdown...',
    loadingText: '正在读取文本文件...',
    loadingImage: '正在加载图片...',
    loadingPptx: '正在解析 PPTX 幻灯片...',
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
    total: '共',
    pdfPages: '共计页面'
  },
  'en-US': {
    loadingDocx: 'Parsing DOCX document...',
    loadingPdf: 'Loading PDF document...',
    loadingXlsx: 'Parsing Excel spreadsheet...',
    loadingMd: 'Loading Markdown note...',
    loadingText: 'Reading text file...',
    loadingImage: 'Loading image...',
    loadingPptx: 'Parsing PPTX presentation...',
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
    total: 'Total',
    pdfPages: 'Total Pages'
  }
}

export function t(key: keyof TranslationSchema, locale: LocaleType = 'zh-CN', customDict?: Partial<TranslationSchema>): string {
  if (customDict && customDict[key]) {
    return customDict[key]!
  }
  const dict = locales[locale] || locales['zh-CN']
  return dict[key] || key
}
