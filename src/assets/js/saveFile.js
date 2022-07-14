import FileSaver from 'file-saver'
import JSZip from 'jszip'

const fileSave = {
    txtFileExport(res, name) {
        // 单个下载，驾驶员数量过多生成文件时间太长，改为打包下载sii文件
        const fileZip = new JSZip()
        const fileBlob = new Blob([res], {type: 'text/plain;charset=UTF-8'})
        fileZip.file(name, fileBlob)
        fileZip.generateAsync({type: 'blob'}).then((content) => {
            FileSaver.saveAs(content, '.zip')
        })
    },
    zipFileExport(files, type) {
        // 打包下载tobj或mat文件
        const fileZip = new JSZip()
        files.forEach((v, i) => {
            const fileBlob = new Blob([v], {type: 'text/plain;charset=UTF-8'})
            const fileName = i + '.' + type
            fileZip.file(fileName, fileBlob)
        })
        fileZip.generateAsync({type: 'blob'}).then((content) => {
            FileSaver.saveAs(content, type + '.zip')
        })
    }
}

export default fileSave
