<template>
  <div class="xlsx-viewer-container">
    <div v-if="loading" class="xlsx-loading">
      <div class="spinner"></div>
      <span>解析 Excel 数据中...</span>
    </div>

    <div v-if="error" class="xlsx-error">
      <span>加载 Excel 失败: {{ error }}</span>
    </div>

    <template v-if="!loading && !error">
      <!-- 工作表 Table 内容 -->
      <div class="table-wrapper">
        <table class="excel-table">
          <thead>
            <tr>
              <th class="row-header">#</th>
              <th v-for="(col, index) in columns" :key="index">
                {{ getColumnName(index) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in currentSheetData" :key="rowIndex">
              <td class="row-header">{{ rowIndex + 1 }}</td>
              <td v-for="(cell, colIndex) in columns" :key="colIndex">
                {{ row[colIndex] ?? '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 底部工作表 (Sheet) 切换标签栏 -->
      <div class="sheet-tabs" v-if="sheetNames.length > 0">
        <button
          v-for="name in sheetNames"
          :key="name"
          class="sheet-tab"
          :class="{ active: currentSheet === name }"
          @click="switchSheet(name)"
        >
          📊 {{ name }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import { loadFileAsArrayBuffer } from '../../utils/fileLoader'

const props = defineProps<{
  src: string | File | Blob | ArrayBuffer
}>()

const emit = defineEmits(['load', 'error'])

const loading = ref(true)
const error = ref<string | null>(null)
const workbook = ref<XLSX.WorkBook | null>(null)
const sheetNames = ref<string[]>([])
const currentSheet = ref('')
const currentSheetData = ref<any[][]>([])
const columns = ref<number>(0)

// Excel 列字母转换规则 A, B, C... Z, AA, AB...
const getColumnName = (n: number): string => {
  let name = ''
  while (n >= 0) {
    name = String.fromCharCode((n % 26) + 65) + name
    n = Math.floor(n / 26) - 1
  }
  return name
}

const switchSheet = (sheetName: string) => {
  if (!workbook.value) return
  currentSheet.value = sheetName
  const worksheet = workbook.value.Sheets[sheetName]
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
  currentSheetData.value = data
  
  // 计算最大列数
  let maxCols = 0
  data.forEach(row => {
    if (row.length > maxCols) maxCols = row.length
  })
  columns.value = Math.max(maxCols, 5)
}

const loadExcel = async () => {
  loading.value = true
  error.value = null

  try {
    const arrayBuffer = await loadFileAsArrayBuffer(props.src)
    const wb = XLSX.read(arrayBuffer, { type: 'array' })
    workbook.value = wb
    sheetNames.value = wb.SheetNames

    if (wb.SheetNames.length > 0) {
      switchSheet(wb.SheetNames[0])
    }

    loading.value = false
    emit('load', { sheets: wb.SheetNames })
  } catch (err: any) {
    loading.value = false
    error.value = err.message || '解析 Excel 失败'
    emit('error', err)
  }
}

onMounted(() => {
  loadExcel()
})

watch(() => props.src, () => {
  loadExcel()
})
</script>

<style scoped>
.xlsx-viewer-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  overflow: hidden;
}

.xlsx-loading, .xlsx-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: #64748b;
  font-size: 14px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.excel-table {
  border-collapse: collapse;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 13px;
}

.excel-table th, .excel-table td {
  border: 1px solid #cbd5e1;
  padding: 10px 14px;
  text-align: left;
  white-space: nowrap;
  color: #0f172a;
  font-weight: 500;
}

.excel-table th {
  background-color: #e2e8f0;
  color: #020617;
  font-weight: 700;
}

.row-header {
  background-color: #f1f5f9 !important;
  color: #334155 !important;
  font-weight: 700;
  text-align: center !important;
  width: 45px;
  user-select: none;
}

.sheet-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 16px;
  background-color: #e2e8f0;
  border-top: 1px solid #cbd5e1;
  overflow-x: auto;
}

.sheet-tab {
  padding: 6px 14px;
  border: none;
  background-color: #f1f5f9;
  color: #475569;
  border-radius: 6px 6px 0 0;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sheet-tab:hover {
  background-color: #ffffff;
  color: #0f172a;
}

.sheet-tab.active {
  background-color: #ffffff;
  color: #10b981;
  font-weight: 600;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}
</style>
