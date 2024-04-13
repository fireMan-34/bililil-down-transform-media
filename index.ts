import { execFileSync } from "child_process";
import { ParsedPath, format, isAbsolute, join, parse, } from "path";
import { argv, cwd } from "process";

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
      // const videJson = JSON.parse(await readFile(format(videoPath), { encoding: 'utf8' }));
      // const audioJson = JSON.parse(await readFile(format(audioPath), { encoding: 'utf8' }));
      // const resultJson = JSON.stringify({
      //   ['video']: videJson,
      //   ['audio']: audioJson
      // }, null, 2);
      // await writeFile(join(dirPath, 'result.json'), resultJson, 'utf8');
    }
  });

program.parse(argv);
// D:\study\bililil-down-transform-media\ffmpeg-master-latest-win64-gpl-shared\bin\ffmpeg.exe -i D:\study\bililil-down-transform-media\demo\51448717\c_90053675\32\video.m4s -i D:\study\bililil-down-transform-media\demo\51448717\c_90053675\32\audio.m4s -c:v copy -strict experimental D:\study\bililil-down-transform-media\demo\51448717\c_90053675\32\result.mp4