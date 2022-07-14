<!--
* @fileDescription: Home
* @Author: zichu
* @Date: 2022/7/12
* @LastEditors: zichu
* @LastEditTime: 2022/7/12
-->

<template>
    <div class="body-head">
        <h2>欧卡2驾驶员mod自动生成</h2>
    </div>
    <div class="div-body">
        <form class="form-body">
            <div>
                <label for="fileType">文件类型：</label>
                <select v-model="fileType" id="fileType" @change="fileChange">
                    <option :value="0">.tobj</option>
                    <option :value="1">.mat</option>
                    <option :value="2">.sii</option>
                </select>
                <span>{{ fileMsg }}</span>
            </div>
            <div v-if="lgState">
                <label for="languageType">生成语言：</label>
                <select v-model="lgType" id="languageType" @change="lgChange">
                    <option :value="0" selected>中文-简体</option>
                    <option :value="1">中文-繁体</option>
                    <option :value="2">英文</option>
                    <option :value="3">日文</option>
                </select>
                <span>{{ typeMsg }}</span>
            </div>
            <div v-if="!siiState">
                <label for="nameSize">清单总数：</label>
                <input v-model.trim="nameSize" type="number" id="nameSize" placeholder="请输入数量" @input="sizeChange"/>
                <span>用于指定tobj和mat文件生成多少个（一定要和sii的驾驶员数量一致）</span>
            </div>
            <div v-if="siiState">
                <label for="nameInput">姓名输入：</label>
                <input v-model.trim="nameInput" id="nameInput" placeholder="姓名"/>
                <span>驾驶员名字，一个就行</span>
            </div>
            <div v-if="siiState">
                <label for="nameNumber">遍历次数：</label>
                <input v-model.trim="nameNumber" id="nameNumber" type="number"/>
            </div>
            <div v-if="siiState">
                <label for="startBtn">操作：</label>
                <button class="primary" type="button" id="startBtn" @click.prevent="startFun">开始遍历</button>
                <button class="routine" type="button" id="clearBtn" @click.prevent="clearFun">清空</button>
            </div>
            <div v-if="siiState">
                <label for="versionName">驾驶员名称：</label>
                <textarea v-model.trim="nameList" rows="5" cols="60" id="versionName" @input="nameCode"/>
                <span>识别时是用英文逗号识别的，请使用英文的”,“而不是中文的”，“</span>
            </div>
            <div>
                <label>操作：</label>
                <button v-if="!btnState" class="success" :disabled="btnState" @click.prevent="fileExport">生成</button>
                <button class="routine" @click.prevent="fileReset">重置</button>
            </div>
        </form>
    </div>
    <div class="body-bottom">
        <h3><a target="_blank" href="https://github.com/Akopsw/ETS2-Polit-Mod/wiki">说明文档</a></h3>
    </div>
</template>

<script>

    import {codeListFoEach} from '@/assets/js/export'

    export default {
        name: "HomePage",
        // 引入模板
        components: {},
        mixins: [codeListFoEach],
        // 数据初始
        data() {
            return {
                nameList: '',
                fileType: 0,
                lgType: 0,
                btnState: true,
                lgState: false,
                nameInput: '',
                nameNumber: '',
                siiState: false,
                nameSize: null,
                fileMsg: '默认生成的是tobj文件，用于指定dds文件路径',
                typeMsg: '实际上按照输入的驾驶员的语言来生成的文件（写中文请选择生成中文，写英文请选择生成英文）'
            }
        },
        // 组件实例
        methods: {
            nameCode(row) {
                const maxStrCode = new RegExp("[-`~!@#$^&*()=|{}':;'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
                const rowCode = row.data
                if (maxStrCode.test(rowCode) === true) {
                    this.btnState = true
                    alert('请删除特殊字符')
                } else {
                    this.btnState = false
                }
            },
            fileChange() {
                this.lgState = this.fileType === 2;
                if (this.fileType === 0) {
                    this.clearFun()
                    this.siiState = false
                    this.fileMsg = 'tobj文件，用于指定dds文件路径'
                } else if (this.fileType === 1) {
                    this.clearFun()
                    this.siiState = false
                    this.fileMsg = 'mat文件用于指定tobj文件路径'
                } else {
                    this.btnState = true
                    this.siiState = true
                    this.fileMsg = 'sii文件用于配置驾驶员信息列表'
                }
            },
            lgChange() {
                if (this.lgType === 0) {
                    this.typeMsg = '生成中文简体的驾驶员信息列表（请输入简中驾驶员姓名）'
                }else if (this.lgType === 1) {
                    this.typeMsg = '生成中文繁体的驾驶员信息列表（请输入繁中驾驶员姓名）'
                }else if (this.lgType === 2) {
                    this.typeMsg = '生成英文的驾驶员信息列表（请输入英文驾驶员姓名）'
                } else {
                    this.typeMsg = '生成日文的驾驶员信息列表（请输入日文驾驶员姓名）'
                }
            },
            fileExport() {
                if (this.siiState === true) {
                    if (this.nameList) {
                        // 根据逗号分割
                        if (this.fileType === 2) {
                            const nameCodeList = this.nameList.split(",")
                            this.cycleCharacter(nameCodeList, this.fileType, this.lgType)
                        } else {
                            this.cycleCharacter(Number(this.nameSize), this.fileType, this.lgType)
                        }
                    } else {
                        alert('请输入名字')
                    }
                } else {
                    this.cycleCharacter(Number(this.nameSize), this.fileType, this.lgType)
                }
            },
            fileReset() {
                this.clearFun()
                this.nameList = ''
                this.fileType = 0
                this.lgType = 0
                this.btnState = true
                this.lgState = false
                this.fileMsg = 'tobj文件，用于指定dds文件路径'
                this.typeMsg = '生成中文简体的驾驶员信息列表'
            },
            startFun() {
                if (this.nameInput && this.nameNumber && this.nameNumber > 0) {
                    const nameIpt = this.nameInput;
                    let nameInt = this.nameNumber;
                    this.btnState = false
                    // console.log(nameIpt + nameInt)
                    let nameList = ''
                    // 循环130次
                    for (let i = 0; i < Number(nameInt); i++) {
                        // 名字就叫打工人+编号，\n是换行的意思，不想换行删掉\n就行
                        nameList += (nameIpt + i + ',\n')
                    }
                    // 去掉最后一个逗号，这个如果是html显示的话不晓得为啥会没用，控制台打印的时候倒是有用
                    nameList = nameList.substr(0, nameList.length - 1)
                    // 去掉输出的打工人名字带双引号，我改成用html显示了就注释掉，想直接用控制台打印的放开就行，记得把下面的document一行注释
                    // console.log(nameList.replace(/\"/g, ""))
                    // 使用html显示，等于号后面的实际上就是上面那行去掉最后一个逗号的
                    this.nameList = nameList.substr(0, nameList.length - 1)
                } else {
                    alert('请填写姓名输入框和遍历次数')
                }
            },
            clearFun() {
                this.nameInput = ''
                this.nameNumber = ''
                this.nameList = ''
            },
            sizeChange() {
                if (this.nameSize > 0) {
                    this.btnState = false
                }
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/index.css";
</style>
