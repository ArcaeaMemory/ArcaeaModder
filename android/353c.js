window.addEventListener("load", function () {
    new Patcher("Arcaea 3.5.3c Modder", "armeabi-v7a/libcocos2dcpp.so", [
        {
            name: "检查songlist, packlist, unlocks文件Hash值",
            tooltip: "开启时将无法修改songlist, packlist, unlocks",
            patches: [
                { offset: 0x564EDE, off: [0x00, 0xBF], on: [0x90, 0xBB] }, // songlist
                { offset: 0x564EEE, off: [0x00, 0xBF], on: [0x50, 0xBB] }, // packlist
                { offset: 0x564EFE, off: [0x00, 0xBF], on: [0x10, 0xBB] } // unlocks
            ],
        },
        {
            name: "更改流速限制至25.5",
            patches: [
                { offset: 0x496FB4, off: [0x88, 0xBF, 0x08, 0x46], on: [0x00, 0xBF, 0x00, 0xBF] }, // 解锁
                { offset: 0x49694A, off: [0x41], on: [0xFF] } // 修改最高值
            ]
        },
        {
            name: "未购买曲包的锁定图标",
            patches: [
                { offset: 0x4979F8, off: [0x01], on: [0x00] }
            ]
        },
        {
            name: "允许离线游玩 Beyond 难度",
            patches: [
                { offset: 0x5352BC, off: [0x03], on: [0x2A] }, // 显示 Beyond 开始按键
                { offset: 0x57A010, off: [0x03], on: [0x2A] }, // 显示开始按钮
                { offset: 0x4BC6DE, off: [0x03], on: [0x2A] }, // 去除联网登录提示
                { offset: 0x540CA6, off: [0x03], on: [0x2A] } // 使游戏识别 3.aff
            ]
        },
        {
            name: "检查 Tempestissimo 是否存在于songlist",
            tooltip: "开启时如果Tepestissimo不存在于songlist将会闪退",
            patches: [
                {
                    offset: 0x4B9824, off: [
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF
                    ], on: [
                        0xCB, 0xF6, 0x44, 0xEE,
                        0x0B, 0xA9, 0x20, 0x46,
                        0xCD, 0xF6, 0x90, 0xE8,
                        0xD2, 0xF6, 0xCE, 0xEF,
                        0x04, 0x46, 0x0B, 0xA8,
                        0xCB, 0xF6, 0x5E, 0xEE,
                        0x30, 0x68, 0x00, 0x28,
                        0x14, 0xBF, 0x80, 0x68,
                        0x00, 0x20, 0x4C, 0xB3,
                        0x01, 0x21, 0xD2, 0xF6,
                        0xC8, 0xEF
                    ]
                }
            ]
        },
        {
            name: "启用 scenecontrol 语句",
            patches: [
                { offset: 0x516D48, off: [0x3F, 0xF4], on: [0x00, 0xBF] }, // LogicChart::setupNotesFromParsed
                { offset: 0x4D2C43, off: [0xF0], on: [0xBF] } // GameSceneVisualControlHandler::handleLogicSceneControl
            ]
        },
        {
            name: "启用 camera 语句",
            patches: [
                { offset: 0x517DC6, off: [0x08, 0xB1], on: [0x00, 0xBF] },
                { offset: 0x518456, off: [0x02], on: [0x03] }
            ]
        },

        /*
        以下内容来自 ArcaeaModderv2
        https://github.com/notmee1/ArcaeaModder
        感谢对本项目的支持
        有兴趣的话可以交个朋友
        */
        {
            name: "离线时限制搭档能力",
            patches: [
                { offset: 0x49A62C, off: [0x00, 0xBF, 0x00, 0xBF], on: [0xEB, 0xF6, 0xD0, 0xED] }, // CharacterAbility::setLimitations
            ]
        },
        {
            name: "总是触发异象",
            patches: [
                { offset: 0x54DEB0, off: [0x37, 0xF6, 0x4E, 0xEC], on: [0x00, 0xBF, 0x00, 0xBF] }, // <AnomalySongFinished>(): call to UnlockManager::insertOrUpdateChallengeUnlock()
                { offset: 0x54E0F8, off: [0x37, 0xF6, 0x2A, 0xEB], on: [0x00, 0xBF, 0x00, 0xBF] }, // <AnomalySongFinished>(): call to UnlockManager::insertOrUpdateChallengeUnlock()
                { offset: 0x54DED4, off: [0x3D, 0xF6, 0x26, 0xED], on: [0x00, 0xBF, 0x00, 0xBF] }, // <AnomalySongFinished>(): call to UnlockManager::saveUnlockStates()
                { offset: 0x54E020, off: [0x3D, 0xF6, 0x80, 0xEC], on: [0x00, 0xBF, 0x00, 0xBF] }, // <AnomalySongFinished>(): call to UnlockManager::saveUnlockStates()
            ]
        },
        {
            name: "启用单首曲目下载",
            tooltip: "下载单首曲目而不是完整的曲包",
            patches: [
                { offset: 0x4BC27A, off: [0x28, 0xB9], on: [0x05, 0xE0] }, // SongSelectScene::promptDownload()
                { offset: 0x5410AC, off: [0x06, 0xD0], on: [0x06, 0xE0] } // Song::isRemoteDownloadPresent()
            ]
        },
        {
            name: "下载空谱面文件时报错",
            patches: [
                { offset: 0x4A3FEA, off: [0x00, 0xBF], on: [0xE8, 0xB1] }, // Check downloaded data on startup: don't consider empty file's MD5 as non-exist
                { offset: 0x4A3FFE, off: [0x00, 0xBF], on: [0x13, 0xDD] }, // Check downloaded data on startup: don't consider file size < 500 bytes as non-exist
                { offset: 0x55DBDE, off: [0x14, 0xE0], on: [0x14, 0xDA] } // lambda[at DownloadFileTask::run](): don't fail file size < 500 bytes
            ]
        },
    ]);
});