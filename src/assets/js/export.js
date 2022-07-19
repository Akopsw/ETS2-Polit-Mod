import fileSave from '@/assets/js/saveFile'

export const codeListFoEach = {
    methods: {
        cycleCharacter(params, typeMode, lgMode) {
            let fileName = ''
            const matFileList = []
            const tobjFileList = []
            if (typeMode === 2) {
                if (lgMode === 0) {
                    // 简中
                    fileName = 'ZH-CN'
                } else if (lgMode === 1) {
                    // 繁中
                    fileName = 'ZH-TC'
                } else if (lgMode === 2) {
                    // 英
                    fileName = 'EU'
                } else if (lgMode === 3) {
                    // 日
                    fileName = 'JP'
                }
                // 只生成一个文件
                this.siiFileExportFun(params, fileName)
            } else if (typeMode === 1) {
                for (let i = 0; i < params; i++) {
                    // mat文件生成，需打包后下载，文件按驾驶员多少生成
                    matFileList.push(this.matFileExportFun(String(i)))
                }
                fileSave.zipFileExport(matFileList, 'mat')
            } else if (typeMode === 0) {
                for (let i = 0; i < params; i++) {
                    // 下标给转16进制方法进行转换，需打包后下载，文件按驾驶员多少生成
                    tobjFileList.push(this.sixteenBaseChangeFun(String(i)))
                }
                fileSave.zipFileExport(tobjFileList, 'tobj')
            }
        },
        tobjFileExportFun(params) {
            // 将最后几位数转16进制，写入tobj文件，单独导出，
            // 文件名的.的16进制为2e,
            // 大于4位数的截取为4位和2位，2位的拼接2e在结尾
            // 小于4位数的把2位的拼接
            const createArr = (str, start, end, unit) => {
                let arrString = '' //保存每次截取后的字符串
                let countCycle = Math.ceil(str.length / unit) //循环截取的次数,向上取整
                let codeNumber = ''
                // 长度为10~99的直接拼接，小于10或者大于99的就要循环截取
                if (str.length > 4 || str.length < 4 && str.length !== 4) {
                    for (let i = 0; i < countCycle; i++) {
                        let newStr = str.substring(start, end)
                        if (newStr.length >= 4) {
                            codeNumber = '1c00'
                            arrString += newStr + ' '
                        } else {
                            codeNumber = '1b00'
                            arrString += newStr + '2e 6464 73'
                        }
                        start = end
                        end += unit
                    }
                } else {
                    codeNumber = '1a00'
                    arrString += str + ' 2e64 6473'
                }
                return arrString
            }
            return '010a b170 0000 0000 0000 0000 0000 0000\n' +
                '0000 0000 0100 0000 0200 0303 0200 0202\n' +
                '0001 0000 0001 0100 ' + codeNumber + ' 0000 0000 0000\n' +
                '2f6d 6174 6572 6961 6c2f 7569 2f64 7269\n' +
                '7665 722f ' + createArr(params, 0, 4, 4)
        },
        matFileExportFun(i) {
            // 把每一个驾驶员单独导出成.mat文件
            const paCode = 'material : "ui" \n' +
                '{ \n' +
                '\ttexture : "' + i + '.tobj" \n' +
                '\ttexture_name : "texture" \n' +
                '} '
            return paCode
        },
        siiFileExportFun(params, lgName) {
            // 把完整的驾驶员名字导出成.sii文件
            const codeNameList = []
            for (let i = 0; i < params.length; i++) {
                // q,w,e,r,t,y,u,i,o,p,a,s,d,f,g
                const indexValue = i.toString().length >= 2 ? i : String('0' + i)
                codeNameList.push('\nname[' + indexValue + ']: "' + params[i] + '"')
            }
            const paList = 'SiiNunit\n' +
                '{\n' +
                'driver_names : .driver.names\n' +
                '{\n' +
                codeNameList +
                '\n\n}\n' +
                '}\n'
            // 调用下载
            fileSave.txtFileExport(paList, 'Pilot Name - ' + lgName + '.sii')
        },
        sixteenBaseChangeFun(params) {
            // 转16进制
            let baseCode = '';
            for (let i = 0; i < params.length; i++) {
                baseCode += params.charCodeAt(i).toString(16)
            }
            // tobj文件内容
            return this.tobjFileExportFun(baseCode)
        }
    }
}
