window.addEventListener("load", function () {
    new Patcher("Arcaea 3.12.6c Modder", "armeabi-v7a/libcocos2dcpp.so", [
        {
            name: "检查songlist, packlist, unlocks文件Hash值",
            tooltip: "开启时将无法修改songlist, packlist, unlocks",
            patches: [
                { offset: 0x56506C, off: [ 0x00, 0xBF ], on: [ 0x60, 0xBB ] },
                { offset: 0x565076, off: [ 0x00, 0xBF ], on: [ 0x38, 0xBB ] },
                { offset: 0x565080, off: [ 0x00, 0xBF ], on: [ 0x10, 0xBB ] },
            ],
        }
    ]);
});