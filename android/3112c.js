window.addEventListener("load", function () {
    new Patcher("Arcaea 3.11.2c Modder", "armeabi-v7a/libcocos2dcpp.so", [
        {
            name: "检查songlist, packlist, unlocks文件Hash值",
            tooltip: "开启时将无法修改songlist, packlist, unlocks",
            patches: [
                { offset: 0xE0FFD4, off: [0x00, 0xBF, 0x00, 0xBF, 0x00, 0xBF], on: [0x94, 0xF7, 0xA2, 0xFA, 0x60, 0xBB] },
                { offset: 0xE0FFDE, off: [0x00, 0xBF, 0x00, 0xBF, 0x00, 0xBF], on: [0x94, 0xF7, 0x9D, 0xFA, 0x38, 0xBB] },
                { offset: 0xE0FFE8, off: [0x00, 0xBF, 0x00, 0xBF, 0x00, 0xBF], on: [0x94, 0xF7, 0x98, 0xFA, 0x10, 0xBB] }
            ],
        },
        {
            name: "songlist 完整性检查(Testing)",
            tooltip: "开启时 Tempestissimo 或 Sayonara Hatsukoi 不存在于songlist将会闪退",
            patches: [
                {
                    offset: 0xC57E36, off: [
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF,
                        0x00, 0xBF, 0x00, 0xBF
                    ], on: [
                        0x76, 0x49, 0x81, 0xAD,
                        0x79, 0x44, 0x28, 0x46,
                        0xDB, 0xF0, 0x10, 0xFC
                    ]
                },
                {
                    offset: 0xB7E6C8, off: nopList(38), on: codeToArray(`
                05 AD 91 49 79 44 28 46 B4 F1 C7 FF 40 46 29 46
                97 F5 29 FF 01 46 08 A8 00 22 00 23 D7 F2 76 FD
                05 A8 45 F3 72 ED
                `)
                }
            ]
        },
        {
            name: "SSL Pinning",
            tooltip: "开启时将无法抓包或修改服务器地址",
            patches: [
                {
                    offset: 0xACD02C, off: nopList(458), on: codeToArray(`
                    B2 48 29 46 B2 4C 78 44 7C 44 00 68 22 46 F7 F3
                    4A E8 4F F0 7F 50 4F F4 FA 78 2D 90 4F F0 64 09
                    A5 48 06 F1 10 05 2B 90 FA 20 2A 90 03 22 A3 48
                    29 90 28 46 CD F8 B0 80 CD F8 A0 90 28 A9 2C F1
                    A3 F8 A4 48 29 46 22 46 78 44 F7 F3 2C E8 14 20
                    F7 F3 60 E8 04 46 00 21 EF F1 2A FB 06 F1 3C 05
                    21 46 28 46 10 F2 22 FB 9B 48 29 46 9B 4C 78 44
                    7C 44 22 46 F7 F3 16 E8 4F F4 7A 70 06 F1 1C 05
                    2A 90 03 22 CD E9 28 98 28 A9 28 46 73 F3 4B FD
                    93 48 29 46 22 46 78 44 F7 F3 04 E8 0D A8 91 49
                    79 44 66 F2 C8 FA 19 AC 8F 49 79 44 20 46 66 F2
                    C2 FA 01 25 8D 49 04 F1 0C 00 79 44 66 F2 BB FA
                    02 25 8B 49 04 F1 18 00 79 44 66 F2 B4 FA 03 25
                    88 49 04 F1 24 00 79 44 66 F2 AD FA 04 25 86 49
                    04 F1 30 00 79 44 66 F2 A6 FA 0D F1 64 0B 08 A8
                    05 22 59 46 88 F1 12 F8 0D F1 A0 09 0D A9 08 AA
                    48 46 CA F1 B8 FF 05 A8 7C 49 79 44 66 F2 93 FA
                    10 AC 7B 49 79 44 20 46 66 F2 8D FA 01 25 79 49
                    04 F1 0C 00 79 44 66 F2 86 FA 02 25 76 49 04 F1
                    18 00 79 44 66 F2 7F FA 10 AC 68 46 03 22 21 46
                    87 F1 EC FF 09 F1 20 00 05 A9 6A 46 CA F1 93 FF
                    06 F1 28 09 28 AD 02 22 B0 46 48 46 29 46 55 F2
                    D5 FE 20 26 A8 19 03 F7 6D FA 20 3E 16 F1 20 00
                    F8 D1 68 46 05 F5 75 FF 18 25 60 19 F7 F3 12 E8
                    0C 3D 15 F1 0C 00 F8 D1 05 A8 F7 F3 0C E8 08 A8
                    05 F5 67 FF 30 24 0B EB 04 00 F7 F3 04 E8 0C 3C
                    14 F1 0C 00 F7 D1 0D A8 F6 F3 FC EF 57 48 49 46
                    57 4C 78 44 7C 44 22 46 F6 F3 74 EF 55 48 41 46
                    22 46 78 44 00 68 F6 F3 6E EF
                `)
                },
            ],
        },
    ]);
});