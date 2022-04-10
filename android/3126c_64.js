window.addEventListener("load", function () {
    new Patcher("Arcaea 3.12.6c Modder", "arm64-v8a/libcocos2dcpp.so", [
        {
            name: "检查songlist, packlist, unlocks文件Hash值",
            tooltip: "开启时将无法修改songlist, packlist, unlocks",
            patches: [
                { offset: 0x9B0DB4, off: codeToArray("1F 20 03 D5"), on: codeToArray("61 10 00 54") },
                { offset: 0x9B0DD0, off: codeToArray("1F 20 03 D5"), on: codeToArray("80 0F 00 35") },
                { offset: 0x9B0DFC, off: codeToArray("1F 20 03 D5"), on: codeToArray("21 0E 00 54") },
                { offset: 0x9B0E18, off: codeToArray("1F 20 03 D5"), on: codeToArray("40 0D 00 35") },
                { offset: 0x9B0E44, off: codeToArray("1F 20 03 D5"), on: codeToArray("E1 0B 00 54") },
                { offset: 0x9B0E60, off: codeToArray("1F 20 03 D5"), on: codeToArray("00 0B 00 35") },
            ],
        },

        // 参考 https://github.com/5u5u5u5us/ArcaeaModder/blob/master/ios/3126.js
        {
            name: "读取特效语句(camera, scenecontrol, etc...)",
            patches: [
                {
                    offset: 0x80BE04,
                    off: codeToArray("FF 83 02 D1 FD 7B 04 A9"),
                    on: codeToArray("20 00 80 D2 C0 03 5F D6")
                }
            ]
        },
        {
            name: "允许离线游玩 Beyond 难度",
            patches: [
                { offset: 0x604F38, off: codeToArray("4A 04 00 34"), on: codeToArray("1F 20 03 D5") }, // 显示 Beyond 开始按键
                { offset: 0x604F64, off: [0x04], on: [0x19] },
                { offset: 0x9E4DB1, off: [0x0D], on: [0xA9] }, // 显示开始按钮
                { offset: 0x7C845D, off: [0x0E], on: [0xAA] }, // 去除联网登录提示
                { offset: 0x803CF9, off: [0x0E], on: [0x1E] }, // 使游戏识别 3.aff
                { offset: 0x803D11, off: [0x0E], on: [0x1E] },
            ]
        },
        {
            name: "移除残片上限",
            patches: [
                {
                    offset: 0x573570,
                    off: codeToArray("A9 A5 8E 52 1F 01 09 6B 08 B1 89 1A"),
                    on: codeToArray("1F 20 03 75 1F 20 03 75 1F 20 03 75")
                }
            ]
        },

        /* 实验功能
        {
            name: "资源文件外置(未测试)",
            tooltip: "理论上可行，实际上不可行：在sdcard目录新建“Arcaea_assets”文件夹用于放置资源文件，给予应用存储读取权限，[apk包内保留app-data与audio文件夹](可选)",
            patches: [
                {
                    offset: 0x31C300,
                    off: nullList(35),
                    on: asciiToArray("/storage/emulated/0/Arcaea_assets/")
                }, //存储字符串
                {offset: 0x7CA108, off: [0xA1, 0xDE], on: [0x81, 0xDA]}, // 更改 "assets/" 引用
                {offset: 0x7CA115, off: [0xA8, 0x3B], on: [0x00, 0x0C]},
                {offset: 0x8D415C, off: [0x60, 0xD6], on: [0x40, 0xD2]},
                {offset: 0x8D4161, off: [0xA8, 0x3B], on: [0x00, 0x0C]},
            ]
        },
        */
    ]);
});