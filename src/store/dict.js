/**
 * src/store/dict.js
 * 字典数据仓库，缓存省份、城市、企业类型下拉选项
 * Vue3 + Pinia 写法
 */
import { defineStore } from 'pinia'
import { getProvinceApi, getCityApi, getNodeTypeApi } from '@/api/admin/dict'

export const useDictStore = defineStore('dict', {
  state() {
    return {
      // 企业类型字典
      typeList: [],
      // 全部省份列表
      provinceList: [],
      // 当前选中省份对应的城市列表
      cityList: []
    }
  },
  actions: {
    // 初始化加载全部字典（请求后端接口）
    async initDict() {
      // 请求企业类型，单独捕获异常，一个失败不影响另一个
      try {
        const typeRes = await getNodeTypeApi()
        if (typeRes.code === 200) {
          this.typeList = typeRes.data
        }
      } catch (err) {
        console.error('加载企业类型字典失败：', err)
        this.typeList = []
      }

      // 请求省份
      try {
        const provRes = await getProvinceApi()
        if (provRes.code === 200) {
          // 数据库字段转前端label/value格式
          this.provinceList = provRes.data.map(item => {
            return { label: item.provName, value: item.provId }
          })
        }
      } catch (err) {
        console.error('加载省份字典失败：', err)
        this.provinceList = []
      }
    },

    // 根据省份id加载城市
    async loadCityList(provId) {
      try {
        const res = await getCityApi(provId)
        if (res.code === 200) {
          this.cityList = res.data.map(item => {
            return { label: item.cityName, value: item.cityId }
          })
        } else {
          this.cityList = []
        }
      } catch (err) {
        console.error('加载城市字典失败：', err)
        this.cityList = []
      }
    },

    // 设置企业类型下拉数据
    setTypeList(list) {
      this.typeList = list
    },
    // 设置省份下拉数据
    setProvinceList(list) {
      this.provinceList = list
    },
    // 根据省份切换城市列表
    setCityList(list) {
      this.cityList = list
    },
    // 清空全部字典缓存
    clearDict() {
      this.typeList = []
      this.provinceList = []
      this.cityList = []
    }
  },
  persist: true
})
