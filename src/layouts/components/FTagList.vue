<template>
    <div class="f-tag-list">
        <el-tabs
            v-model="editableTabsValue"
            type="card"
            class="demo-tabs"
            closable
            @tab-remove="removeTab"
        >
            <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            ></el-tab-pane>
        </el-tabs>

        <span class="el-dropdown-span">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue'

let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  }
])

const addTab = (targetName) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: 'New Tab',
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
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
            margin-left: -3px;
            margin-top: 3px;
        }
    }
}
</style>