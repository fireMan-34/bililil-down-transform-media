# bililil-down-transform-media
bilili 简单的媒体转换脚本。 (仅用于 window 环境)

## overflow

1. 将需要转换的目录通通放到 demo 目录下，每一个子目录中包含一个 audio.m4s 和 video.m4s，最后运行 `npm run dev` 命令进行转换即可。
2. 目前功能基础实现，但没有添加一些有效的功能，如果感兴趣的可以提个 issue，力所能及的话，我会改进的。
3. 如果有用的话，希望能 star 一下，非常感谢。
4. 最后要感谢一下知乎这位大佬，说实话，我对这个一窍不通，https://zhuanlan.zhihu.com/p/642447186，没有他的解决方案，我也没法实现转换。

## tips
1. 首先在 `https://github.com/BtbN/FFmpeg-Builds/releases` 下载 ffmpeg，然后解压到 项目根目录下，记得把目录重命名为 `ffmpeg`，保持 `/ffmpeg/bin/ffmpeg.exe` 从根目录下能寻找到这个文件。
2. 在根目录 `npm install`  后运行 `npm run transform`。（需要 node 环境 https://nodejs.org/en/download， node 16+）