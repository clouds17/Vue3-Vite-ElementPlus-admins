import { reactive, ref, computed } from 'vue';
import { toast } from '~/composables/util.js';

// 获取 表格列表, 搜索, 分页切换, 删除, switch切换状态 功能
export function useInitTable (options = {}) {
    // const searchForm = reactive({
    //     keyword: ''
    // })
    // const resetSearchForm = () => {
    //     searchForm.keyword = ''
    //     getTableData(1)
    // }
    // 搜索关键词
    let searchForm = null
    // 重置搜索框
    let resetSearchForm = null
    

    if (options.searchForm) {
        searchForm = reactive({ ...options.searchForm })
        resetSearchForm = () => {
            for (const key in searchForm) {
                searchForm[key] = options.searchForm[key]
                getTableData(1)
            }
        }
    }
    
    const tableData = ref([])
    const isLoading = ref(false)
    const page = ref(1)
    const limit = ref(10)
    const totalCount = ref(0)
    // 获取表单数据
    function getTableData(p = null) {
        if (typeof p == 'number') {
            page.value = p
        }
        isLoading.value = true

        options.getTableApi({
            page: page.value,
            limit: limit.value,
            ...searchForm
        }).then(res => {
            if (options.onGetListSuccess && typeof options.onGetListSuccess == 'function') {
                options.onGetListSuccess(res)
            } else {
                tableData.value = res.list
                totalCount.value = res.totalCount
            }
            
        }).finally(() => {
            isLoading.value = false
        })
        
    }

    getTableData()

    // 切换分页
    const changePage = (e) => {
        getTableData(e)
    }

    // 删除
    const handleDelete = (id) => {
        isLoading.value = true
        options.deleteApi({ id })
        .then(res => {
            toast('删除成功')
            getTableData()
        })
        .finally(() => {
            isLoading.value = false 
        })
    }

    // switch状态切换
    const switchChange = (status, row) => {
        row.isLoading = true
        options.updateStatusApi({
            id: row.id,
            status: status
        }).then(res => {
            toast('修改状态成功')
            row.status = status
        }).finally(() => {
            row.isLoading = false
        })
    }

    return {
        searchForm,
        resetSearchForm,
        tableData,
        isLoading,
        page,
        limit,
        totalCount,
        getTableData,
        changePage,
        handleDelete,
        switchChange
    }

}

// 表格 新增,修改 功能
export function useManipulateTable(options = {}) {
    const editId = ref(0)
    // 抽屉标题
    const drawerTitle = computed(() => editId.value == 0 ? '添加' : '修改')
    // 表单数据
    const formData = reactive({})
    // 重置formData
    function resetFormData() {
        if (options.formData && typeof options.formData == 'object') {
            for (const key in options.formData) {
                formData[key] = options.formData[key]
            }
        }
    }
    resetFormData()
    // 验证规则
    const formRules = options.formRules || {}
    // 打开抽屉
    const formDrawerRef = ref(null)
    const openDrawer = () => formDrawerRef.value.open()
    // 关闭抽屉
    const closeDrawer = () => {
        editId.value = 0
        resetFormData()
    }
    // 提交
    const formRef = ref(null)
    const handleSubmit = () => {
        formRef.value.validate(valid => {
            if (!valid) return
            formDrawerRef.value.showLoading()
    
            const resultFunc = editId.value == 0 ? 
                options.addApi(formData) : 
                options.updateApi({
                    id: editId.value,
                    ...formData
                })
    
                resultFunc
                .then(res => {
                    toast(drawerTitle.value + '成功')
                    options.getTableData(editId.value == 0 ? 1 : null)
                    
                    formDrawerRef.value.close()
                })
                .finally(() => {
                    formDrawerRef.value.hideLoading()
                })
        })
    }
    
    // 编辑
    const handleEdit = (index, row) => {
        for (const key in formData) {
            formData[key] = row[key]
        }
        editId.value = row.id
        openDrawer()
    }

    

    return {
        formDrawerRef,
        drawerTitle,
        formRef,
        formData,
        formRules,
        openDrawer,
        closeDrawer,
        handleSubmit,
        handleEdit
    }
}