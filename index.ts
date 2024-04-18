import { execFileSync } from "child_process";
import { ParsedPath, format, isAbsolute, join, parse, } from "path";
import { argv, cwd } from "process";
import { unlinkSync } from 'fs';

import { program } from "commander";
import { glob } from "glob";

program
  .name("bililil-down-transofrm-media")
  .description("哔哩哔哩 app 下载转换命令")
  .version("0.0.1");

program
  .command("transform")
  .argument("<downPath>")
  .action(async function (...args) {
    const [downPathArg, opt, command] = args;
    const downPath = isAbsolute(downPathArg)
      ? downPathArg
      : join(process.cwd(), downPathArg);

    const waitWorkFilePaths = await glob(["**/video.m4s", "**/audio.m4s"], {
      root: downPath,
      absolute: true,
    });

    const waitWorkFileGrops = waitWorkFilePaths
      .map((p) => parse(p))
      .reduce((p, c) => {
        if (!p[c.dir]) {
          p[c.dir] = [];
        }
        p[c.dir].push(c);
        return p;
      }, {} as Record<string, Array<ParsedPath>>);

    for (const dirPath in waitWorkFileGrops) {
      const filePaths = waitWorkFileGrops[dirPath];
      if (filePaths.length !== 2) {
        continue;
      };
      const videoPath = filePaths.find(filePath => filePath.name === 'video');
      const audioPath = filePaths.find(filePath => filePath.name === 'audio');
      if (!videoPath || !audioPath) {
        continue;
      }
      execFileSync(join(cwd(), '/ffmpeg/bin/ffmpeg.exe'), [ 
        '-i', 
        format(videoPath), 
        '-i', 
        format(audioPath), 
        '-c:v',
        "copy", 
        '-strict',
        'experimental',
        '-y', 
        join(dirPath, 'result.mp4') 
      ]);
      console.log('路径:', dirPath);
      console.log('合成视频成功');
      unlinkSync(join(dirPath, 'video.m4s'));
      console.log('删除源视频');
      unlinkSync(join(dirPath, 'audio.m4s'));
      console.log('删除源音频');
    }
  });

program.parse(argv);