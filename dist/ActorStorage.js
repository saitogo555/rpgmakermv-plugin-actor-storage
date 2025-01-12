/// <reference types="../types/index.ts" />
(() => {
    //=============================================================================
    // ActorStorage.js
    //=============================================================================
    /*:
     * @plugindesc アクターを預けるためのストレージシステムを提供。
     * @author Go Saito
     *
     * @help
     * このプラグインは主にアクターを預かるためのストレージシステムを提供します。
     * 専用画面からパーティーと控えメンバーのアクターを出し入れ出来ます。
     *
     * 【機能】
     * ・アクターを預けるためのストレージ(控えメンバー)
     * ・各アクターのステータス表示
     * ・お別れシステム
     * ・パーティーの最大人数設定
     * ・パーティー人数が上限超えた時に自動的に控えメンバーへ移動
     *
     * 【使い方】
     * 1. イベントタイルを設置
     * 2. プラグインコマンドを選択
     * 3. 「ActorStorage open」を設定
     *
     * @param isAllowPartyEmpty
     * @text パーティー0人を許可
     * @desc パーティーから控えメンバーに移動させる際、パーティーが最後の1人の場合は移動出来ないようにする。
     * @default false
     * @type boolean
     *
     * @param partyMemberMaxNum
     * @text パーティー最大人数
     * @desc パーティーの最大人数を設定する。
     * @default 4
     * @type number
     *
     * @param isShowActorListIcon
     * @text リストに顔アイコン表示
     * @desc アクターリストに歩行画像の顔アイコンを表示する。
     * @default true
     * @type boolean
     *
     */
    const pluginName = "ActorStorage";
    const params = PluginManager.parameters(pluginName);
    const toNumber = (data) => {
        return Number.isNaN(data) ? 0 : Number(data);
    };
    const toBoolean = (data) => {
        return data === "true";
    };
    Game_System.prototype.ActorStorage = {
        addPartyMember: (actor) => {
            $gameParty.addActor(actor.actorId());
        },
        removePartyMember: (actor) => {
            $gameParty.removeActor(actor.actorId());
        },
        addReserveMember: (actor) => {
            $gameSystem._ActorStorage_reserveMembers.push(actor);
        },
        removeReserveMember: (actor) => {
            const actors = $gameSystem._ActorStorage_reserveMembers.map((member) => member.actorId());
            if (actors.indexOf(actor.actorId()) >= 0) {
                $gameSystem._ActorStorage_reserveMembers.splice(actors.indexOf(actor.actorId()), 1);
            }
        },
        getPartyMembers: () => $gameParty.members(),
        getReserveMembers: () => $gameSystem._ActorStorage_reserveMembers,
    };
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === pluginName) {
            switch (args[0]) {
                case "open":
                    SceneManager.push(Scene_ActorStorage);
                    break;
            }
        }
    };
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        const partyMembers = $gameSystem.ActorStorage.getPartyMembers();
        if (partyMembers.length > toNumber(params.partyMemberMaxNum)) {
            const actor = partyMembers[partyMembers.length - 1];
            $gameSystem.ActorStorage.addReserveMember(actor);
            $gameSystem.ActorStorage.removePartyMember(actor);
        }
    };
    class Scene_ActorStorage extends Scene_MenuBase {
        initialize() {
            super.initialize();
        }
        create() {
            super.create();
            this.createMenuWindow();
            this.createLeftSideTextWindow();
            this.createRightSideTextWindow();
            this.createPartyMembersWindow();
            this.createReserveMembersWindow();
            this.createStatusWindow();
            this.createCommandWindow();
            this.createConfirmWindow();
        }
        createMenuWindow() {
            this.menuWindow = new Window_ActorStorage_Menu();
            this.menuWindow.setHandler("party", () => {
                this.menuWindow.deactivate();
                this.partyMembersWindow.activate();
                this.partyMembersWindow.select(this.partyMembersWindow.maxItems() > 0 ? 0 : -1);
            });
            this.menuWindow.setHandler("reserve", () => {
                this.menuWindow.deactivate();
                this.reserveMembersWindow.activate();
                this.reserveMembersWindow.select(this.reserveMembersWindow.maxItems() > 0 ? 0 : -1);
            });
            this.addWindow(this.menuWindow);
        }
        createLeftSideTextWindow() {
            this.leftSideTextWindow = new Window_ActorStorage_LeftSideText();
            this.addWindow(this.leftSideTextWindow);
        }
        createRightSideTextWindow() {
            this.rightSideTextWindow = new Window_ActorStorage_RightSideText();
            this.addWindow(this.rightSideTextWindow);
        }
        createPartyMembersWindow() {
            this.partyMembersWindow = new Window_ActorStorage_PartyMembers();
            this.partyMembersWindow.setHandler("ok", () => {
                if (this.partyMembersWindow.index() < 0) {
                    return;
                }
                this.partyMembersWindow.deactivate();
                this.commandWindow.select(0);
                this.commandWindow.activate();
            });
            this.partyMembersWindow.setHandler("cancel", () => {
                this.partyMembersWindow.deselect();
                this.partyMembersWindow.deactivate();
                this.menuWindow.activate();
            });
            this.addWindow(this.partyMembersWindow);
        }
        createReserveMembersWindow() {
            this.reserveMembersWindow = new Window_ActorStorage_ReserveMembers();
            this.reserveMembersWindow.setHandler("ok", () => {
                if (this.reserveMembersWindow.index() < 0) {
                    return;
                }
                this.reserveMembersWindow.deactivate();
                this.commandWindow.select(0);
                this.commandWindow.activate();
            });
            this.reserveMembersWindow.setHandler("cancel", () => {
                this.reserveMembersWindow.deselect();
                this.reserveMembersWindow.deactivate();
                this.menuWindow.activate();
            });
            this.addWindow(this.reserveMembersWindow);
        }
        createStatusWindow() {
            this.statusWindow = new Window_ActorStorage_Status();
            this.addWindow(this.statusWindow);
        }
        createCommandWindow() {
            this.commandWindow = new Window_ActorStorage_Command();
            this.commandWindow.setHandler("add-party", () => {
                this.reserveMembersWindow.addMemberToParty();
                this.commandWindow.deselect();
                this.commandWindow.deactivate();
                if ($gameSystem.ActorStorage.getReserveMembers().length) {
                    this.reserveMembersWindow.activate();
                }
                else {
                    this.reserveMembersWindow.deselect();
                    this.reserveMembersWindow.deactivate();
                    this.menuWindow.activate();
                }
            });
            this.commandWindow.setHandler("add-reserve", () => {
                this.partyMembersWindow.addMemberToReserve();
                this.commandWindow.deselect();
                this.commandWindow.deactivate();
                if ($gameSystem.ActorStorage.getPartyMembers().length) {
                    this.partyMembersWindow.activate();
                }
                else {
                    this.partyMembersWindow.deselect();
                    this.partyMembersWindow.deactivate();
                    this.menuWindow.activate();
                }
            });
            this.commandWindow.setHandler("farewell", () => {
                this.confirmWindow.activate();
                this.confirmWindow.show();
                this.confirmWindow.showBackgroundDimmer();
                this.commandWindow.deactivate();
            });
            this.commandWindow.setHandler("cancel", () => {
                switch (this.menuWindow.index()) {
                    case 0:
                        if ($gameSystem.ActorStorage.getPartyMembers().length) {
                            this.partyMembersWindow.activate();
                        }
                        else {
                            this.partyMembersWindow.deselect();
                            this.partyMembersWindow.deactivate();
                            this.menuWindow.activate();
                        }
                        break;
                    case 1:
                        if ($gameSystem.ActorStorage.getReserveMembers().length) {
                            this.reserveMembersWindow.activate();
                        }
                        else {
                            this.reserveMembersWindow.deselect();
                            this.reserveMembersWindow.deactivate();
                            this.menuWindow.activate();
                        }
                        break;
                }
                this.commandWindow.deselect();
                this.commandWindow.deactivate();
            });
            this.addWindow(this.commandWindow);
        }
        createConfirmWindow() {
            this.confirmWindow = new Window_ActorStorage_Confirm();
            this.confirmWindow.hide();
            this.confirmWindow.setHandler("farewell", () => {
                switch (this.menuWindow.index()) {
                    case 0:
                        $gameSystem.ActorStorage.removePartyMember($gameSystem.ActorStorage.getPartyMembers()[this.partyMembersWindow.index()]);
                        if (this.partyMembersWindow.index() >=
                            this.partyMembersWindow.maxItems()) {
                            this.partyMembersWindow.select(this.partyMembersWindow.maxItems() - 1);
                        }
                        break;
                    case 1:
                        $gameSystem.ActorStorage.removeReserveMember($gameSystem.ActorStorage.getReserveMembers()[this.reserveMembersWindow.index()]);
                        if (this.reserveMembersWindow.index() >=
                            this.reserveMembersWindow.maxItems()) {
                            this.reserveMembersWindow.select(this.reserveMembersWindow.maxItems() - 1);
                        }
                        break;
                }
                this.commandWindow.callCancelHandler();
                this.confirmWindow.deselect();
                this.confirmWindow.deactivate();
                this.confirmWindow.hide();
            });
            this.confirmWindow.setHandler("cancel", () => {
                this.commandWindow.activate();
                this.confirmWindow.deselect();
                this.confirmWindow.deactivate();
                this.confirmWindow.hide();
            });
            this.addWindow(this.confirmWindow);
        }
        update() {
            super.update.call(this);
            this.partyMembersWindow.hide();
            this.reserveMembersWindow.hide();
            this.commandWindow.setEnableAddParty(false);
            this.commandWindow.setEnableAddReserve(false);
            this.commandWindow.setEnableFarewell(false);
            switch (this.menuWindow.index()) {
                case 0: // パーティー
                    this.partyMembersWindow.show();
                    this.statusWindow.setActor($gameSystem.ActorStorage.getPartyMembers()[this.partyMembersWindow.index()]);
                    if (this.commandWindow.isCursorMovable()) {
                        this.commandWindow.setEnableAddParty(false);
                        this.commandWindow.setEnableAddReserve(this.partyMembersWindow.maxItems() > 1 ||
                            params.isAllowPartyEmpty === "true");
                        this.commandWindow.setEnableFarewell(this.partyMembersWindow.maxItems() > 1 ||
                            params.isAllowPartyEmpty === "true");
                    }
                    break;
                case 1: // 控えメンバー
                    this.reserveMembersWindow.show();
                    this.statusWindow.setActor($gameSystem.ActorStorage.getReserveMembers()[this.reserveMembersWindow.index()]);
                    if (this.commandWindow.isCursorMovable()) {
                        this.commandWindow.setEnableAddParty($gameSystem.ActorStorage.getPartyMembers().length <
                            toNumber(params.partyMemberMaxNum));
                        this.commandWindow.setEnableAddReserve(false);
                        this.commandWindow.setEnableFarewell(true);
                    }
                    break;
            }
            if (this.menuWindow.isCursorMovable()) {
                if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
                    SoundManager.playCancel();
                    this.popScene();
                }
            }
        }
    }
    /**
     * メニューウィンドウ
     */
    class Window_ActorStorage_Menu extends Window_MenuCommand {
        initialize() {
            const x = 0;
            const y = 0;
            super.initialize(x, y);
        }
        maxCols() {
            return 2;
        }
        windowWidth() {
            return Graphics.boxWidth;
        }
        windowHeight() {
            return this.fittingHeight(1);
        }
        makeCommandList() {
            const currentPartyMemberNum = $gameSystem.ActorStorage.getPartyMembers().length;
            const maxPartyMemberNum = toNumber(params.partyMemberMaxNum);
            const partyNumText = `(${currentPartyMemberNum}/${maxPartyMemberNum})`;
            this.addCommand(`パーティー${partyNumText}`, "party", !!currentPartyMemberNum);
            const currentReserveMemberNum = $gameSystem.ActorStorage.getReserveMembers().length;
            const reserveNumText = `(${currentReserveMemberNum})`;
            this.addCommand(`控えメンバー${reserveNumText}`, "reserve", !!currentReserveMemberNum);
        }
        update() {
            super.update.call(this);
            this.refresh();
        }
    }
    /**
     * 左側のテキストウィンドウ
     */
    class Window_ActorStorage_LeftSideText extends Window_Base {
        initialize() {
            const x = 0;
            const y = this.fittingHeight(1);
            const width = Graphics.boxWidth / 2;
            const height = this.fittingHeight(1);
            super.initialize(x, y, width, height);
            this.drawText("メンバーリスト", 0, 0, this.contentsWidth(), "center");
        }
    }
    /**
     * 右側のテキストウィンドウ
     */
    class Window_ActorStorage_RightSideText extends Window_Base {
        initialize() {
            const x = Graphics.boxWidth / 2;
            const y = this.fittingHeight(1);
            const width = Graphics.boxWidth / 2;
            const height = this.fittingHeight(1);
            super.initialize(x, y, width, height);
            this.drawText("ステータス", 0, 0, this.contentsWidth(), "center");
        }
    }
    /**
     * パーティーメンバーウィンドウ
     */
    class Window_ActorStorage_PartyMembers extends Window_MenuStatus {
        initialize() {
            const x = 0;
            const y = this.fittingHeight(1) * 2;
            const width = Graphics.boxWidth / 2;
            const height = Graphics.boxHeight - this.fittingHeight(1) * 2 - this.fittingHeight(3);
            Window_Selectable.prototype.initialize.call(this, x, y, width, height);
            this.deselect();
            this.deactivate();
        }
        maxItems() {
            return $gameParty.members().length;
        }
        itemHeight() {
            return this.lineHeight();
        }
        drawCharacter(characterName, characterIndex, x, y) {
            const bitmap = ImageManager.loadCharacter(characterName);
            // @ts-ignore
            const big = ImageManager.isBigCharacter(characterName);
            const pw = bitmap.width / (big ? 3 : 12);
            const ph = bitmap.height / (big ? 4 : 8);
            const n = characterIndex;
            const sx = ((n % 4) * 3 + 1) * pw;
            const sy = Math.floor(n / 4) * 4 * ph;
            // @ts-ignore
            this.contents.blt(bitmap, sx, sy, pw, this.lineHeight(), x, y);
        }
        drawItem(index) {
            const actor = $gameSystem.ActorStorage.getPartyMembers()[index];
            const rect = this.itemRect(index);
            const x = rect.x;
            const y = rect.y;
            const width = rect.width;
            const offset = toBoolean(params.isShowActorListIcon) ? 48 : 0;
            if (toBoolean(params.isShowActorListIcon)) {
                this.drawActorCharacter(actor, x, y);
            }
            this.drawActorName(actor, x + offset, y, (width - offset) / 2);
            this.drawActorLevel(actor, x + (width - offset) / 2 + offset, y);
        }
        addMemberToReserve() {
            const index = this.index();
            if (index >= 0) {
                if (this.maxItems() <= 1 && params.isAllowPartyEmpty !== "true") {
                    return;
                }
                this.playOkSound();
                const actor = $gameSystem.ActorStorage.getPartyMembers()[index];
                $gameSystem.ActorStorage.addReserveMember(actor);
                $gameSystem.ActorStorage.removePartyMember(actor);
                if (this.maxItems() === 0) {
                    this.deselect();
                }
                else if (this.index() + 1 > this.maxItems()) {
                    this.select(this.maxItems() - 1);
                }
            }
        }
        update() {
            super.update.call(this);
            this.refresh();
        }
    }
    /**
     * 控えメンバーウィンドウ
     */
    class Window_ActorStorage_ReserveMembers extends Window_Selectable {
        initialize() {
            const x = 0;
            const y = this.fittingHeight(1) * 2;
            const width = Graphics.boxWidth / 2;
            const height = Graphics.boxHeight - this.fittingHeight(1) * 2 - this.fittingHeight(3);
            super.initialize(x, y, width, height);
            this.refresh();
            this.deselect();
            this.deactivate();
        }
        maxItems() {
            return $gameSystem.ActorStorage.getReserveMembers().length;
        }
        itemHeight() {
            return this.lineHeight();
        }
        drawCharacter(characterName, characterIndex, x, y) {
            const bitmap = ImageManager.loadCharacter(characterName);
            // @ts-ignore
            const big = ImageManager.isBigCharacter(characterName);
            const pw = bitmap.width / (big ? 3 : 12);
            const ph = bitmap.height / (big ? 4 : 8);
            const n = characterIndex;
            const sx = ((n % 4) * 3 + 1) * pw;
            const sy = Math.floor(n / 4) * 4 * ph;
            // @ts-ignore
            this.contents.blt(bitmap, sx, sy, pw, this.lineHeight(), x, y);
        }
        drawItem(index) {
            const actor = $gameSystem.ActorStorage.getReserveMembers()[index];
            const rect = this.itemRect(index);
            const x = rect.x;
            const y = rect.y;
            const width = rect.width;
            const offset = toBoolean(params.isShowActorListIcon) ? 48 : 0;
            if (toBoolean(params.isShowActorListIcon)) {
                this.drawActorCharacter(actor, x, y);
            }
            this.drawActorName(actor, x + offset, y, (width - offset) / 2);
            this.drawActorLevel(actor, x + (width - offset) / 2 + offset, y);
        }
        addMemberToParty() {
            const index = this.index();
            if (index >= 0) {
                if ($gameSystem.ActorStorage.getPartyMembers().length >=
                    toNumber(params.partyMemberMaxNum)) {
                    return;
                }
                this.playOkSound();
                const actor = $gameSystem.ActorStorage.getReserveMembers()[index];
                $gameSystem.ActorStorage.addPartyMember(actor);
                $gameSystem.ActorStorage.removeReserveMember(actor);
                if (this.maxItems() === 0) {
                    this.deselect();
                }
                else if (this.index() + 1 > this.maxItems()) {
                    this.select(this.maxItems() - 1);
                }
                this.refresh();
            }
        }
        update() {
            super.update.call(this);
            this.refresh();
        }
    }
    /**
     * ステータスウィンドウ
     */
    class Window_ActorStorage_Status extends Window_Base {
        initialize() {
            const x = Graphics.boxWidth - this.windowWidth();
            const y = this.fittingHeight(1) * 2;
            const width = this.windowWidth();
            const height = Graphics.boxHeight - this.fittingHeight(1) * 2;
            super.initialize(x, y, width, height);
            this.refresh();
        }
        setActor(actor) {
            this.actor = actor;
            this.refresh();
        }
        windowWidth() {
            return Graphics.boxWidth / 2;
        }
        drawActorName(actor, x, y) {
            const width = this.windowWidth();
            this.resetTextColor();
            this.drawText(`名  前: ${actor.name()}`, x, y, width);
        }
        drawActorClass(actor, x, y) {
            var _a;
            const width = this.windowWidth();
            this.resetTextColor();
            this.drawText(`職  業: ${(_a = actor.currentClass().name) !== null && _a !== void 0 ? _a : "----"}`, x, y, width);
        }
        drawActorNickname(actor, x, y) {
            const width = this.windowWidth();
            this.resetTextColor();
            this.drawText(`二つ名: ${actor.nickname()}`, x, y, width);
        }
        drawActorParam(actor, x, y, paramId) {
            const margin = 20;
            const width = this.contentsWidth() / 2 - margin;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(paramId), x, y, width - 60);
            this.resetTextColor();
            this.drawText(actor.param(paramId).toString(), x + width - 60, y, 60, "right");
        }
        drawActorStatus() {
            const actor = this.actor;
            if (!actor)
                return;
            const line = (num) => this.lineHeight() * (num - 1);
            this.drawActorName(actor, 0, line(1));
            this.drawActorNickname(actor, 0, line(2));
            this.drawActorClass(actor, 0, line(3));
            this.drawActorLevel(actor, 0, line(4.5));
            this.drawActorHp(actor, 0, line(5.5), this.contentsWidth());
            this.drawActorMp(actor, 0, line(6.5), this.contentsWidth());
            this.drawActorParam(actor, 0, line(8), 2);
            this.drawActorParam(actor, this.contentsWidth() / 2 + 20, line(8), 3);
            this.drawActorParam(actor, 0, line(9), 4);
            this.drawActorParam(actor, this.contentsWidth() / 2 + 20, line(9), 5);
            this.drawActorParam(actor, 0, line(10), 6);
            this.drawActorParam(actor, this.contentsWidth() / 2 + 20, line(10), 7);
        }
        refresh() {
            this.createContents();
            this.drawActorStatus();
        }
    }
    /**
     * コマンドウィンドウ
     */
    class Window_ActorStorage_Command extends Window_MenuCommand {
        initialize() {
            const x = 0;
            const y = Graphics.boxHeight - this.windowHeight();
            super.initialize(x, y);
            this.refresh();
            this.deselect();
            this.deactivate();
        }
        windowWidth() {
            return Graphics.boxWidth / 2;
        }
        windowHeight() {
            return this.fittingHeight(3);
        }
        setEnableAddParty(enabled) {
            this.isEnableAddParty = enabled;
        }
        setEnableAddReserve(enabled) {
            this.isEnableAddReserve = enabled;
        }
        setEnableFarewell(enabled) {
            this.isEnableFarewell = enabled;
        }
        commandIcon(index) {
            return this.icons[index];
        }
        addCommandWithIcon(name, icon, symbol, enabled) {
            this.addCommand(name, symbol, enabled);
            if (!this.icons)
                this.icons = [];
            this.icons.push(icon);
        }
        drawItem(index) {
            const rect = this.itemRectForText(index);
            const align = this.itemTextAlign();
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawIcon(this.commandIcon(index), rect.x, rect.y + 2);
            this.drawText(this.commandName(index), rect.x + this.lineHeight() + 10, rect.y, rect.width, align);
        }
        makeCommandList() {
            this.addCommandWithIcon("パーティーに入れる", 74, "add-party", this.isEnableAddParty);
            this.addCommandWithIcon("控えメンバーに入れる", 73, "add-reserve", this.isEnableAddReserve);
            this.addCommandWithIcon("お別れする", 82, "farewell", this.isEnableFarewell);
        }
        update() {
            super.update.call(this);
            this.refresh();
        }
    }
    /**
     * 確認ウィンドウ
     */
    class Window_ActorStorage_Confirm extends Window_MenuCommand {
        initialize() {
            const x = (Graphics.boxWidth - this.windowWidth()) / 2;
            const y = (Graphics.boxHeight - this.windowHeight()) / 2;
            super.initialize(x, y);
            this.refresh();
            this.deselect();
            this.deactivate();
        }
        windowWidth() {
            return Graphics.boxWidth / 3;
        }
        windowHeight() {
            return this.fittingHeight(2);
        }
        makeCommandList() {
            this.addCommand("お別れする", "farewell");
            this.addCommand("お別れしない", "cancel");
        }
    }
})();
