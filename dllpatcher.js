(function(window, document) {
    "use strict";
    
    // form labels often need unique IDs - this can be used to generate some
    window.Patcher_uniqueid = 0;
    var createID = function() {
        window.Patcher_uniqueid++;
        return "dllpatch_" + window.Patcher_uniqueid;
    };
    
    var bytesMatch = function(buffer, offset, bytes) {
        for(var i = 0; i < bytes.length; i++) {
            if(buffer[offset+i] != bytes[i])
                return false;
        }
        return true;
    };
    
    var replace = function(buffer, offset, bytes) {
        for(var i = 0; i < bytes.length; i++) {
            buffer[offset+i] = bytes[i];
        }
    }
    
    var whichBytesMatch = function(buffer, offset, bytesArray) {
        for(var i = 0; i < bytesArray.length; i++) {
            if(bytesMatch(buffer, offset, bytesArray[i]))
                return i;
        }
        return -1;
    }
    
    // Each unique kind of patch should have createUI, validatePatch, applyPatch,
    // updateUI
    
    class StandardPatch {
        constructor(options) {
            this.name = options.name;
            this.patches = options.patches;
            this.tooltip = options.tooltip;
        }
    
        createUI(parent) {
            var id = createID();
            var label = this.name;
            var patch = $('<label>', {'class' : 'mdui-checkbox'});
            this.checkbox = $('<input type="checkbox" id="' + id + '">')[0];
            patch.append(this.checkbox);
            patch.append('<i class="mdui-checkbox-icon"></i>' + label);
            if(this.tooltip) {
                patch.append(`<button class="mdui-btn mdui-btn-icon"
                    mdui-tooltip="{content: '${this.tooltip}', position: 'right', delay: 150}">
                    <i class="mdui-icon material-icons">help</i>
                    </button>`
                );
            }
            var div = $("<div>", {"id": "patch"});
            div.append(patch);
            parent.append(div);
        }
    
        updateUI(file) {
            this.checkbox.checked = this.checkPatchBytes(file) === "on";
        }
    
        validatePatch(file) {
            var status = this.checkPatchBytes(file);
            if(status === "on") {
                console.log('"' + this.name + '"', "is enabled!");
            } else if(status === "off") {
                console.log('"' + this.name + '"', "is disabled!");
            } else {
                return '"' + this.name + '" 选项不匹配！请检查是否加载了正确文件。';
            }
        }
    
        applyPatch(file) {
            this.replaceAll(file, this.checkbox.checked);
        }
    
        replaceAll(file, featureOn) {
            for(var i = 0; i < this.patches.length; i++) {
                replace(file, this.patches[i].offset,
                        featureOn? this.patches[i].on : this.patches[i].off);
            }
        }
    
        checkPatchBytes(file) {
            var patchStatus = "";
            for(var i = 0; i < this.patches.length; i++) {
                var patch = this.patches[i];
                if(bytesMatch(file, patch.offset, patch.off)) {
                    if(patchStatus === "") {
                        patchStatus = "off";
                    } else if(patchStatus != "off"){
                        return "on/off mismatch within patch";
                    }
                } else if(bytesMatch(file, patch.offset, patch.on)) {
                    if(patchStatus === "") {
                        patchStatus = "on";
                    } else if(patchStatus != "on"){
                        return "on/off mismatch within patch";
                    }
                } else {
                    return "patch neither on nor off";
                }
            }
            return patchStatus;
        }
    }

    
    class Patcher {
        constructor(title, fname, args) {
            this.mods = [];
            for(var i = 0; i < args.length; i++) {
                var mod = args[i];
                if(mod.type) {
                    if(mod.type === "union") {
                        this.mods.push(new UnionPatch(mod));
                    }
                } else { // standard patch
                    this.mods.push(new StandardPatch(mod));
                }
            }
    
            this.filename = fname;
            this.title = title;
    
            this.multiPatcher = false;
            this.createUI();
            this.loadPatchUI();
        }
    
        createUI() {
            var self = this;
            this.mainContainer = $("<div>", {"class": "mdui-container mdui-typo", "id": "mainContainer"});
            var title = this.title;
            this.mainContainer.html('<div class="mdui-typo-display-2 mdui-text-center">' + title + '</div>');
            this.card = $("<div>", {"class": "mdui-card"});
            this.container = $("<div>", {"class": "mdui-container mdui-m-y-4", "id": "patchContainer"});
            var header = this.filename;
            this.container.html('<h4>' + header + '</h4>');
    
            this.noticeDiv = $("<div>", {"class": "mdui-p-t-2", "id": "notice"})
            this.successDiv = $("<div>", {"class": "mdui-text-color-green", "id": "success"});
            this.errorDiv = $("<div>", {"class": "mdui-text-color-red", "id": "error"});
            this.noticeDiv.append(this.successDiv);
            this.noticeDiv.append(this.errorDiv);

            this.patchDiv = $("<div>", {"class": "mdui-p-y-2", "id": "patches"});
    
            var saveButton = $("<button>", {"class": "mdui-btn mdui-color-theme-accent mdui-btn-raised mdui-ripple"});
            saveButton.prop('disabled', true)
            saveButton.text('请先加载文件');
            saveButton.on('click', this.saveDll.bind(this));
            this.saveButton = saveButton;
    
            if (!this.multiPatcher) {
                $('html').on('dragover dragenter', function() {
                    self.container.addClass('dragover');
                    return true;
                })
                .on('dragleave dragend drop', function() {
                    self.container.removeClass('dragover');
                    return true;
                })
                .on('dragover dragenter dragleave dragend drop', function(e) {
                    e.preventDefault();
                });
    
                this.container.on('drop', function(e) {
                    var files = e.originalEvent.dataTransfer.files;
                    if(files && files.length > 0)
                        self.loadFile(files[0]);
                });
    
                var filepickerId = createID();
                this.fileInput = $("<input>",
                    {"style": "display: none;",
                     "id" : filepickerId,
                     "type" : 'file'});
                var label = $("<label>", {"for": filepickerId});
                label.html('<div class="mdui-btn mdui-color-theme-accent mdui-btn-raised mdui-ripple">加载文件</div> 或直接拖拽到窗口。');
    
                this.fileInput.on('change', function(e) {
                    if(this.files && this.files.length > 0)
                        self.loadFile(this.files[0]);
                });
    
                this.container.append(this.fileInput);
                this.container.append(label);
                this.card.append(this.container);
                this.mainContainer.append(this.card);
            }
    
            this.container.append(this.noticeDiv);
            this.container.append(this.patchDiv);
            this.container.append(saveButton);
            $("body").append(this.mainContainer);
        }
    
        destroyUI() {
            if (this.hasOwnProperty("container"))
                this.container.remove();
        }
    
        loadBuffer(buffer) {
            this.dllFile = new Uint8Array(buffer);
            if(this.validatePatches()) {
                this.successDiv.css("display", "inline");
                this.successDiv.html("文件加载成功！");
            } else {
                this.successDiv.css("display", "none");
            }
            // Update save button regardless
            this.saveButton.prop('disabled', false);
            this.saveButton.text('保存文件');
            this.errorDiv.html(this.errorLog);
        }
    
        loadFile(file) {
            var reader = new FileReader();
            var self = this;
    
            reader.onload = function(e) {
                self.loadBuffer(e.target.result);
                self.updatePatchUI();
            };
    
            reader.readAsArrayBuffer(file);
        }
    
        saveDll() {
            if(!this.dllFile || !this.mods || !this.filename)
                return;
    
            for(var i = 0; i < this.mods.length; i++) {
                this.mods[i].applyPatch(this.dllFile);
            }
    
            var blob = new Blob([this.dllFile], {type: "application/octet-stream"});
            saveAs(blob, this.filename);
        }
    
        loadPatchUI() {
            for(var i = 0; i < this.mods.length; i++) {
                this.mods[i].createUI(this.patchDiv);
            }
        }
    
        updatePatchUI() {
            for(var i = 0; i < this.mods.length; i++) {
                this.mods[i].updateUI(this.dllFile);
            }
        }
    
        validatePatches() {
            this.errorLog = "";
            var success = true;
            this.validPatches = 0;
            this.totalPatches = this.mods.length;
            for(var i = 0; i < this.mods.length; i++) {
                var error = this.mods[i].validatePatch(this.dllFile);
                if(error) {
                    this.errorLog += error + "<br/>";
                    success = false;
                } else {
                    this.validPatches++;
                }
            }
            return success;
        }
    }
    
    window.Patcher = Patcher;
    
    })(window, document);