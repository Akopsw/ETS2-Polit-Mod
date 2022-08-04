const fs = require("fs");
const iconv = require('iconv-lite')
const path = require('path');// 解析需要遍历的文件夹
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question(`请输入tobj文件夹的文件路径：`, name => {
    console.log(`开始遍历 ${name} 文件夹内的tobj文件`)
    const filePath = path.resolve(name);

    findFilesDisplay(filePath)

    function findFilesDisplay(filePath) {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err)
            } else {
                // 遍历读取到的文件列表
                files.forEach(function (filename) {
                    // 获取文件后缀
                    const extName = path.extname(filename)
                    if (extName === '.tobj') {
                        // 获取当前文件的绝对路径
                        const filedir = path.join(filePath, filename);
                        // 根据文件路径获取文件信息，返回一个fs.Stats对象
                        fs.stat(filedir, function (error, stats) {
                            if (error) {
                                console.warn('获取文件stats失败');
                            } else {
                                const isFile = stats.isFile();// 是文件
                                if (isFile) {

                                    try {
                                        // 读取文件内容
                                        const data = fs.readFileSync(filedir)
                                        // 转buffer
                                        const bufferData = Buffer.from(data)
                                        // 转string
                                        const repCOde = bufferData.toString()
                                        // 去除字符串空格
                                        const lastCode = repCOde.replace(/ /g, '')
                                        // 去除字符串换行符
                                        const rnCode = lastCode.replace(/[\r\n]/g, "")
                                        // 转码
                                        const laCode = iconv.encode(rnCode, 'latin1').toString('latin1')
                                        // 转格式
                                        const newCode = Buffer.from(laCode, 'hex')
                                        // 写入文件
                                        fs.writeFile(filedir, newCode.toString('latin1'), 'latin1', (err) => {
                                            if (err)
                                                console.log(err);
                                            else {
                                                console.log(filedir + '转码成功');
                                            }
                                        });
                                    } catch (err) {
                                        console.error(err)
                                    }
                                }
                            }
                        })
                    }
                });
            }
        });
    }

    readline.close()
})

// ../../assets/file/1.tobj, ascii to latin1 or Latin_1

// 创建一个可读流
// const readerStream = fs.createReadStream('../../assets/file/1.tobj', 'ascii');

// 创建一个可写流
// const writerStream = fs.createWriteStream('../../assets/file/0.tobj', 'latin1');

// 管道读写操作
// 读取指定文件内容，并将内容写入到指定的输出文件中
// readerStream.pipe(writerStream);

// console.log("程序执行完毕");

