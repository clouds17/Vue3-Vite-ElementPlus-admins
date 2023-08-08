<template>
    <div class="f-tag-list">
        <el-tabs
            v-model="activeTab"
            type="card"
            class="demo-tabs"
            @tab-remove="removeTab"
            @tab-change="changeTab"
        >
            <el-tab-pane
                v-for="item in tabList"
                :key="item.path"
                :label="item.title"
                :name="item.path"
                :closable="item.path != '/'"
            ></el-tab-pane>
        </el-tabs>

        <span class="el-dropdown-span">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon >
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="clearAll">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
</template>

<script setup>
import { useTagList } from '~/composables/useTagList.js'

const { 
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
 } = useTagList()


</script>

<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.f-tag-list {
    display: flex;
    overflow: hidden;
    .el-tabs {
        flex: 1;
        overflow: hidden;
        &:deep(.el-tabs__header) {
            margin: 0;
        }
        &:deep(.el-tabs__nav) {
            border: 0 !important;
        }
        &:deep(.el-tabs__item) {
            @apply bg-white mx-1 rounded;
            border: 0 !important;
            height: 32px;
            line-height: 32px;
        }
        &:deep(.el-tabs__nav-wrap.is-scrollable) {
            padding: 0 30px;
        }
        &:deep(.el-tabs__nav-next), :deep(.el-tabs__nav-prev) {
            line-height: 35px;
        }
        &:deep(.is-disabled) {
            cursor: not-allowed;
            @apply text-gray-300;
        }
    }
    .el-dropdown-span {
        width: 32px;
        height: 32px;
        margin-left: 10px;
        flex-shrink: 0;
        @apply flex items-center justify-center bg-white text-center rounded;
        .el-dropdown {
            margin-top: 3px;
        }
    }
}
</style>