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
        }
    ]);
});