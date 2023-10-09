<template>
    <div v-loading="isLoading" class="bg-white p-4 rounded">
        <el-form :model="BuyForm" ref="BuyFormRef"  label-width="160px" >
            <el-tabs v-model="activeName" >
                <el-tab-pane label="支付设置" name="first">
                    <el-table :data="tableData" border >
                        <el-table-column label="支付方式" align="left">
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image :src="row.src" fit="fill" :lazy="true" style="width: 40px;height: 40px;" class="rounded mr-2"></el-image>
                                    <div>
                                        <h6>{{ row.name }}</h6>
                                        <small class="flex text-gray-500 text-xs">{{ row.desc }}</small>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="180">
                            <template #default="{ row }">
                                <el-button type="primary" @click="open(row.key)">配置</el-button>
                                
                            </template>
                        </el-table-column>
                    </el-table>
                    
                </el-tab-pane>
                <el-tab-pane label="购物设置" name="second" >
                    <el-form-item label="未支付订单" >
                        <el-input v-model="BuyForm.close_order_minute" type="number" style="max-width: 300px;">
                            <template #append>分钟后自动关闭</template>
                        </el-input>
                        <span class="text-sm text-gray-400 pl-2 w-full">订单下单未付款，n分钟后自动关闭，设置0不自动关闭</span>
                    </el-form-item>
                    <el-form-item label="已发货订单" >
                        <el-input v-model="BuyForm.auto_received_day" type="number" style="max-width: 300px;">
                            <template #append>天后自动确认收货</template>
                        </el-input>
                        <span class="text-sm text-gray-400 pl-2 w-full">如果在期间未确认收货，系统自动完成收货，设置0不自动收货</span>
                    </el-form-item>
                    <el-form-item label="已完成订单" >
                        <el-input v-model="BuyForm.after_sale_day" type="number" style="max-width: 300px;">
                            <template #append>天内允许申请售后</template>
                        </el-input>
                        <span class="text-sm text-gray-400 pl-2 w-full">订单完成后，用户在n天内可以发起售后申请，设置0不允许申请售后</span>
                    </el-form-item>
                    <el-form-item  class="mt-3">
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
            
            </el-tabs>
        </el-form>

        <form-drawer ref="FormDrawerRef" title="配置" @submit="onSubmit">
            <el-form :model="BuyForm"  label-width="80px" v-if="drawerType == 'alipay'">
                <el-form-item label="app_id">
                    <el-input v-model="BuyForm.alipay.app_id" placeholder="app_id" style="width: 90%;">
                        <template #a>
                            <div>
                                
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="ali_public_key">
                    <el-input v-model="BuyForm.alipay.ali_public_key" placeholder="ali_public_key" type="textarea" :rows="4" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="private_key">
                    <el-input v-model="BuyForm.alipay.private_key" placeholder="private_key" type="textarea" :rows="4" style="width: 90%;"></el-input>
                </el-form-item>
            </el-form>
            <el-form :model="BuyForm"  label-width="80px" v-if="drawerType == 'wxpay'">
                <el-form-item label="公众号 APPID">
                    <el-input v-model="BuyForm.wxpay.app_id" placeholder="公众号 APPID" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="小程序 APPID">
                    <el-input v-model="BuyForm.wxpay.miniapp_id" placeholder="小程序 APPID" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="小程序 secret">
                    <el-input v-model="BuyForm.wxpay.secret" placeholder="小程序 secret" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="BuyForm.wxpay.appid" placeholder="appid" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="BuyForm.wxpay.mch_id" placeholder="商户号" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="API 密钥">
                    <el-input v-model="BuyForm.wxpay.key" placeholder="API 密钥" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="cert_client">
                    <el-upload
                        class="upload-demo"
                        ref="uploadRef"
                        :action="upload_sysconfig_file"
                        :headers="{
                            token
                        }"
                        :limit="1"
                        accept=".pem"
                        :on-success="uploadCertSuccess"
                    >
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-red-500">{{ BuyForm.wxpay.cert_client ? BuyForm.wxpay.cert_client : '还未配置' }}</p>
                            <div class="el-upload__tip">
                                只能上传后缀.pem文件,例如:apiclient_cert.pem
                            </div>
                        </template>
                    </el-upload>
                    
                </el-form-item>
                <el-form-item label="cert_key">
                    <el-upload
                        class="upload-demo"
                        ref="uploadRef"
                        :action="upload_sysconfig_file"
                        :headers="{
                            token
                        }"
                        :limit="1"
                        accept=".pem"
                        :on-success="uploadKeySuccess"
                    >
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-red-500">{{ BuyForm.wxpay.cert_key ? BuyForm.wxpay.cert_key : '还未配置' }}</p>
                            <div class="el-upload__tip">
                                只能上传后缀.pem文件,例如:apiclient_key.pem
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
            
        </form-drawer>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { get_sysconfig_api, set_sysconfig_api, upload_sysconfig_file } from '~/api/sysconfig.js'
import { toast } from '~/composables/util.js';
import { genFileId } from 'element-plus'
import { getToken } from '~/composables/auth.js'
import FormDrawer from '~/components/FormDrawer.vue';

const isLoading = ref(false)

const token = getToken()

const tableData = [{
    name: "支付宝支付",
    desc: "该系统支持即时到账接口",
    src: "/vite.svg",
    key: "alipay"
}, {
    name: "微信支付",
    desc: "该系统支持微信网页支付喝扫码支付",
    src: "/vite.svg",
    key: "wxpay"
}]

const BuyForm = reactive({
    "close_order_minute": 30,
    "auto_received_day": 7,
    "after_sale_day": 23,
    "alipay": {
        "app_id": "...",
        "ali_public_key": "...",
        "private_key": "..."
    },
    "wxpay": {
        "app_id": "...",
        "miniapp_id": "...",
        "secret": "...",
        "appid": "...",
        "mch_id": "...",
        "key": "...",
        "cert_client": "....pem",
        "cert_key": "....pem"
    }
})
 

const activeName = ref('first')

function getData() {
    isLoading.value = true
    get_sysconfig_api().then(res => {
        // Object.assign(BuyForm, res)
        for (let key in BuyForm) {
            BuyForm[key] = res[key]
        }
    }).finally(() => {
        isLoading.value = false
    })
}

getData()

const FormDrawerRef = ref(null)
const drawerType = ref('alipay')

const open = (type = 'alipay') => {
    drawerType.value = type
    FormDrawerRef.value.open()
}
// 上传成功
const uploadCertSuccess = (response, uploadFile, uploadFiles) => {
    BuyForm.wxpay.cert_client = response.data
}

const uploadKeySuccess = (response, uploadFile, uploadFiles) => {
    BuyForm.wxpay.cert_key = response.data
}

const onSubmit = () => {
    isLoading.value = true
    set_sysconfig_api(BuyForm).then(res => {
        toast('修改成功')
    }).finally(() => {
        isLoading.value = false
    })
}
</script>

<style lang="scss" scoped>

</style>