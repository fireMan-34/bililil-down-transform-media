"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const process_1 = require("process");
const fs_1 = require("fs");
const commander_1 = require("commander");
const glob_1 = require("glob");
commander_1.program
    .name("bililil-down-transofrm-media")
    .description("哔哩哔哩 app 下载转换命令")
    .version("0.0.1");
commander_1.program
    .command("transform")
    .argument("<downPath>")
    .action(async function (...args) {
    const [downPathArg, opt, command] = args;
    const downPath = (0, path_1.isAbsolute)(downPathArg)
        ? downPathArg
        : (0, path_1.join)(process.cwd(), downPathArg);
    const waitWorkFilePaths = await (0, glob_1.glob)(["**/video.m4s", "**/audio.m4s"], {
        root: downPath,
        absolute: true,
    });
    const waitWorkFileGrops = waitWorkFilePaths
        .map((p) => (0, path_1.parse)(p))
        .reduce((p, c) => {
        if (!p[c.dir]) {
            p[c.dir] = [];
        }
        p[c.dir].push(c);
        return p;
    }, {});
    for (const dirPath in waitWorkFileGrops) {
        const filePaths = waitWorkFileGrops[dirPath];
        if (filePaths.length !== 2) {
            continue;
        }
        ;
        const videoPath = filePaths.find(filePath => filePath.name === 'video');
        const audioPath = filePaths.find(filePath => filePath.name === 'audio');
        if (!videoPath || !audioPath) {
            continue;
        }
        (0, child_process_1.execFileSync)((0, path_1.join)((0, process_1.cwd)(), '/ffmpeg/bin/ffmpeg.exe'), [
            '-i',
            (0, path_1.format)(videoPath),
            '-i',
            (0, path_1.format)(audioPath),
            '-c:v',
            "copy",
            '-strict',
            'experimental',
            '-y',
            (0, path_1.join)(dirPath, 'result.mp4')
        ]);
        console.log('路径:', dirPath);
        console.log('合成视频成功');
        (0, fs_1.unlinkSync)((0, path_1.join)(dirPath, 'video.m4s'));
        console.log('删除源视频');
        (0, fs_1.unlinkSync)((0, path_1.join)(dirPath, 'audio.m4s'));
        console.log('删除源音频');
    }
});
commander_1.program.parse(process_1.argv);
