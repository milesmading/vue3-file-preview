import { Component, shallowRef } from 'vue'

const customRenderers = new Map<string, Component>()

/**
 * 注册自定义渲染器插件 (如 CAD .dwg, 3D .stl, Photoshop .psd 等)
 * @param fileType 文件扩展名或自定义类型 (如 'dwg', 'stl', 'psd')
 * @param component Vue 3 组件定义
 */
export function registerRenderer(fileType: string, component: Component) {
  customRenderers.set(fileType.toLowerCase(), shallowRef(component))
}

/**
 * 获取已被注册的自定义渲染器
 */
export function getRegisteredRenderer(fileType: string): Component | undefined {
  return customRenderers.get(fileType.toLowerCase())
}

/**
 * 获取所有已注册的类型列表
 */
export function getRegisteredTypes(): string[] {
  return Array.from(customRenderers.keys())
}
