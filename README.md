<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Storium Interactive</title>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 0; }
        .tabs { display: flex; border-bottom: 2px solid #ccc; }
        .tab {
            padding: 12px 24px;
            cursor: pointer;
            border: none;
            background: #f7f7f7;
            font-weight: bold;
            outline: none;
        }
        .tab.active { background: #fff; border-bottom: 2px solid #fff; }
        .tab-content { display: none; padding: 24px; }
        .tab-content.active { display: block; }
        .dropdown-editable {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        .dropdown-editable select, .dropdown-editable input[type="text"] {
            font-size: 1em;
            padding: 4px;
        }
        .crud-btn {
            background: #eee;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 2px 6px;
            margin-left: 2px;
            cursor: pointer;
            font-size: 1em;
        }
        .treeview { margin-left: 16px; }
        .tree-group {
            margin-bottom: 8px;
            border-left: 2px solid #ddd;
            padding-left: 8px;
        }
        .tree-item {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 2px;
        }
        .tree-label { font-weight: 500; }
        .scene, .character, .desc { margin-left: 16px; }
        .character-cards {
            display: flex;
            overflow-x: auto;
            gap: 8px;
            max-width: 320px;
            margin-left: 32px;
            margin-bottom: 8px;
        }
        .character-card {
            min-width: 90px;
            border: 1px solid #bbb;
            border-radius: 4px;
            padding: 6px;
            background: #fafafa;
            text-align: center;
        }
        .textarea-large {
            width: 100%;
            min-height: 180px;
            font-size: 1em;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            resize: vertical;
        }
        .icon-btn {
            background: #e0e0e0;
            border: 1px solid #bbb;
            border-radius: 3px;
            padding: 4px 10px;
            margin-right: 6px;
            cursor: pointer;
            font-size: 1em;
            vertical-align: middle;
        }
        .todo-area {
            width: 100%;
            min-height: 120px;
            margin-bottom: 8px;
            border: 1px dashed #bbb;
            background: #f9f9f9;
            color: #aaa;
            padding: 8px;
            border-radius: 4px;
            resize: vertical;
        }
    </style>
</head>
<body>
    <div class="tabs">
        <button class="tab active" onclick="showTab(0)">Storium</button>
        <button class="tab" onclick="showTab(1)">Table Builder</button>
    </div>
    <div class="tab-content active" id="tab1">
        <!-- Editable Dropdown with CRUD -->
        <div class="dropdown-editable">
            <label for="gamesDropdown"><b>Games</b></label>
            <select id="gamesDropdown"></select>
            <button class="crud-btn" title="Create Game" onclick="createGame()">＋</button>
            <button class="crud-btn" title="Remove Game" onclick="removeGame()">🗑</button>
            <button class="crud-btn" title="Update Game" onclick="updateGame()">✎</button>
        </div>
        <!-- TreeView for chosen game -->
        <div id="treeView"></div>
    </div>
    <div class="tab-content" id="tab2">
        <textarea class="textarea-large" id="tableTextArea" placeholder="Edit or paste table definitions here..."></textarea>
        <div>
            <button class="icon-btn" onclick="buildTables()">🔨 Build</button>
            <button class="icon-btn" onclick="loadFromTree()">⟳ Load from Tree</button>
        </div>
        <textarea class="todo-area" readonly placeholder="TODO: Area 2 (unimplemented)"></textarea>
        <textarea class="todo-area" readonly placeholder="TODO: Area 3 (unimplemented)"></textarea>
    </div>
    <script>


        // --- StoriumDataLib: Data Model & Logic (IIFE) ---
        window.StoriumDataLib = (function() {
            // Private data
            let games = [];
            let players = [];
            let gameSettings = [];
            let characters = [];
            let playersCharacters = [];
            let cardTypes = [];
            let cards = [];
            let charactersCards = [];
            let scenes = [];
            let sceneCharacters = [];
            let conflicts = [];
            let conflictPips = [];
            let cardInstances = [];
            let moves = [];
            let goals = [];
            let sceneGoals = [];
            let assets = [];
            let sceneAssets = [];
            let subplots = [];
            let subplotsProgress = [];
            let hostActions = [];
            let selectedGameIdx = 0;

            // --- Table Parser ---
            function parseTables(text) {
                const lines = text.split(/\r?\n/);
                let currentTable = null;
                let columns = [];
                let tables = {};
                for (let line of lines) {
                    line = line.trim();
                    if (!line || line.startsWith('//')) { currentTable = null; continue; }
                    if (line.startsWith('tbl') && line.includes(':')) {
                        const [tableName, colStr] = line.split(':');
                        columns = colStr.split('|').map(s => s.trim());
                        currentTable = tableName.trim();
                        tables[currentTable] = tables[currentTable] || [];
                        continue;
                    }
                    if (currentTable) {
                        const values = line.split('|').map(s => s.trim());
                        let row = {};
                        columns.forEach((col, i) => row[col] = values[i] !== undefined ? values[i] : null);
                        tables[currentTable].push(row);
                    }
                }
                return tables;
            }

            // --- Build Data Model from Tables ---
            function buildDataModelFromTables(tables) {
                function int(v) { return v === undefined || v === null ? null : parseInt(v, 10); }
                games = (tables.tblGames||[]).map(r => ({ id: int(r.id), name: r.name, desc: r.desc }));
                players = (tables.tblPlayers||[]).map(r => ({ id: int(r.id), name: r.name }));
                gameSettings = (tables.tblGameSettings||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), key: r.setting_key, value: r.setting_value }));
                characters = (tables.tblCharacters||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, status: r.status, is_pc: r.is_pc === '1' }));
                playersCharacters = (tables.tblPlayersCharacters||[]).map(r => ({ id: int(r.id), player_id: int(r.player_id), character_id: int(r.character_id), is_primary: r.is_primary === '1' }));
                cardTypes = (tables.tblCardTypes||[]).map(r => ({ id: int(r.id), name: r.name, category: r.category, is_wild: r.is_wild === '1' }));
                cards = (tables.tblCards||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc, card_type_id: int(r.card_type_id) }));
                charactersCards = (tables.tblCharactersCards||[]).map(r => ({ id: int(r.id), character_id: int(r.character_id), card_id: int(r.card_id), count: int(r.count) }));
                scenes = (tables.tblScenes||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc, place_card_id: int(r.place_card_id), status: r.status, intro_narration: r.intro_narration }));
                sceneCharacters = (tables.tblSceneCharacters||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), character_id: int(r.character_id), is_npc: r.is_npc === '1' }));
                conflicts = (tables.tblConflicts||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), card_id: int(r.card_id), type: r.type, name: r.name, desc: r.desc, max_pips: int(r.max_pips), status: r.status }));
                conflictPips = (tables.tblConflictPips||[]).map(r => ({ id: int(r.id), conflict_id: int(r.conflict_id), pip_number: int(r.pip_number), assigned_character_id: int(r.assigned_character_id), assigned_card_instance_id: int(r.assigned_card_instance_id), outcome: r.outcome, narrative: r.narrative }));
                cardInstances = (tables.tblCardInstances||[]).map(r => ({ id: int(r.id), card_id: int(r.card_id), owner_character_id: int(r.owner_character_id), scene_id: int(r.scene_id), custom_name: r.custom_name, custom_desc: r.custom_desc, timestamp: r.timestamp, spent: r.spent === '1' }));
                moves = (tables.tblMoves||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), conflict_id: int(r.conflict_id), card_instance_id: int(r.card_instance_id), player_id: int(r.player_id), text: r.text, timestamp: r.timestamp }));
                goals = (tables.tblGoals||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc }));
                sceneGoals = (tables.tblSceneGoals||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), goal_id: int(r.goal_id), assigned_character_id: int(r.assigned_character_id), status: r.status }));
                assets = (tables.tblAssets||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc }));
                sceneAssets = (tables.tblSceneAssets||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), asset_id: int(r.asset_id), assigned_character_id: int(r.assigned_character_id), status: r.status }));
                subplots = (tables.tblSubplots||[]).map(r => ({ id: int(r.id), card_id: int(r.card_id), name: r.name, desc: r.desc }));
                subplotsProgress = (tables.tblSubplotsProgress||[]).map(r => ({ id: int(r.id), character_id: int(r.character_id), subplot_id: int(r.subplot_id), scene_id: int(r.scene_id), progress_note: r.progress_note, timestamp: r.timestamp }));
                hostActions = (tables.tblHostActions||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), action_type: r.action_type, details: r.details, timestamp: r.timestamp }));
            }

            // --- CRUD and Accessors ---
            function getGames() { return games; }
            function getSelectedGameIdx() { return selectedGameIdx; }
            function setSelectedGameIdx(idx) { selectedGameIdx = idx; }
            function getPlayers() { return players; }
            function getGameSettings() { return gameSettings; }
            function getCharacters() { return characters; }
            function getScenes() { return scenes; }
            // ...add more as needed

            // Game CRUD
            function createGame(name) {
                const newGame = { id: games.length ? Math.max(...games.map(g=>g.id||0))+1 : 1, name, desc: '', scenes: [] };
                games.push(newGame);
                selectedGameIdx = games.length - 1;
                return newGame;
            }
            function removeGame(idx) {
                if (games.length === 0) return;
                games.splice(idx, 1);
                selectedGameIdx = Math.max(0, selectedGameIdx - 1);
            }
            function updateGame(idx, name) {
                if (games.length === 0) return;
                games[idx].name = name;
            }
            function updateGameDesc(idx, desc) {
                if (games.length === 0) return;
                games[idx].desc = desc;
            }

            // Expose API
            return {
                parseTables,
                buildDataModelFromTables,
                getGames,
                getSelectedGameIdx,
                setSelectedGameIdx,
                getPlayers,
                getGameSettings,
                getCharacters,
                getScenes,
                createGame,
                removeGame,
                updateGame,
                updateGameDesc
                // ...add more as needed
            };
        })();

        // --- Table Parser ---
        function parseTables(text) {
            const lines = text.split(/\r?\n/);
            let currentTable = null;
            let columns = [];
            let tables = {};
            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith('//')) { currentTable = null; continue; }
                if (line.startsWith('tbl') && line.includes(':')) {
                    const [tableName, colStr] = line.split(':');
                    columns = colStr.split('|').map(s => s.trim());
                    currentTable = tableName.trim();
                    tables[currentTable] = tables[currentTable] || [];
                    continue;
                }
                if (currentTable) {
                    const values = line.split('|').map(s => s.trim());
                    let row = {};
                    columns.forEach((col, i) => row[col] = values[i] !== undefined ? values[i] : null);
                    tables[currentTable].push(row);
                }
            }
            return tables;
        }

        // --- Build Data Model from Tables ---
        function buildDataModelFromTables(tables) {
            // Helper: parse int fields
            function int(v) { return v === undefined || v === null ? null : parseInt(v, 10); }
            // Assign to global arrays
            games = (tables.tblGames||[]).map(r => ({ id: int(r.id), name: r.name, desc: r.desc }));
            players = (tables.tblPlayers||[]).map(r => ({ id: int(r.id), name: r.name }));
            gameSettings = (tables.tblGameSettings||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), key: r.setting_key, value: r.setting_value }));
            characters = (tables.tblCharacters||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, status: r.status, is_pc: r.is_pc === '1' }));
            playersCharacters = (tables.tblPlayersCharacters||[]).map(r => ({ id: int(r.id), player_id: int(r.player_id), character_id: int(r.character_id), is_primary: r.is_primary === '1' }));
            cardTypes = (tables.tblCardTypes||[]).map(r => ({ id: int(r.id), name: r.name, category: r.category, is_wild: r.is_wild === '1' }));
            cards = (tables.tblCards||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc, card_type_id: int(r.card_type_id) }));
            charactersCards = (tables.tblCharactersCards||[]).map(r => ({ id: int(r.id), character_id: int(r.character_id), card_id: int(r.card_id), count: int(r.count) }));
            scenes = (tables.tblScenes||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc, place_card_id: int(r.place_card_id), status: r.status, intro_narration: r.intro_narration }));
            sceneCharacters = (tables.tblSceneCharacters||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), character_id: int(r.character_id), is_npc: r.is_npc === '1' }));
            conflicts = (tables.tblConflicts||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), card_id: int(r.card_id), type: r.type, name: r.name, desc: r.desc, max_pips: int(r.max_pips), status: r.status }));
            conflictPips = (tables.tblConflictPips||[]).map(r => ({ id: int(r.id), conflict_id: int(r.conflict_id), pip_number: int(r.pip_number), assigned_character_id: int(r.assigned_character_id), assigned_card_instance_id: int(r.assigned_card_instance_id), outcome: r.outcome, narrative: r.narrative }));
            cardInstances = (tables.tblCardInstances||[]).map(r => ({ id: int(r.id), card_id: int(r.card_id), owner_character_id: int(r.owner_character_id), scene_id: int(r.scene_id), custom_name: r.custom_name, custom_desc: r.custom_desc, timestamp: r.timestamp, spent: r.spent === '1' }));
            moves = (tables.tblMoves||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), conflict_id: int(r.conflict_id), card_instance_id: int(r.card_instance_id), player_id: int(r.player_id), text: r.text, timestamp: r.timestamp }));
            goals = (tables.tblGoals||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc }));
            sceneGoals = (tables.tblSceneGoals||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), goal_id: int(r.goal_id), assigned_character_id: int(r.assigned_character_id), status: r.status }));
            assets = (tables.tblAssets||[]).map(r => ({ id: int(r.id), game_id: int(r.game_id), name: r.name, desc: r.desc }));
            sceneAssets = (tables.tblSceneAssets||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), asset_id: int(r.asset_id), assigned_character_id: int(r.assigned_character_id), status: r.status }));
            subplots = (tables.tblSubplots||[]).map(r => ({ id: int(r.id), card_id: int(r.card_id), name: r.name, desc: r.desc }));
            subplotsProgress = (tables.tblSubplotsProgress||[]).map(r => ({ id: int(r.id), character_id: int(r.character_id), subplot_id: int(r.subplot_id), scene_id: int(r.scene_id), progress_note: r.progress_note, timestamp: r.timestamp }));
            hostActions = (tables.tblHostActions||[]).map(r => ({ id: int(r.id), scene_id: int(r.scene_id), action_type: r.action_type, details: r.details, timestamp: r.timestamp }));
        }

        // --- Build Button Handler ---
        function buildTables() {
            const text = document.getElementById('tableTextArea').value;
            const tables = parseTables(text);
            buildDataModelFromTables(tables);
            // Rebuild games[] for dropdown and treeview
            // (For now, only support one game for demo)
            if (games.length > 0) selectedGameIdx = 0;
            renderGamesDropdown();
            renderTreeView();
        }

        // --- StoriumUILib: UI Rendering & Event Handlers (IIFE) ---
        window.StoriumUILib = (function() {
            const Data = window.StoriumDataLib;

            // --- Tab Logic ---
            function showTab(idx) {
                document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === idx));
                document.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === idx));
                if (idx === 0) renderTreeView();
            }

            // --- Dropdown CRUD ---
            function renderGamesDropdown() {
                const dd = document.getElementById('gamesDropdown');
                dd.innerHTML = '';
                const games = Data.getGames();
                games.forEach((g, i) => {
                    const opt = document.createElement('option');
                    opt.value = i;
                    opt.textContent = g.name;
                    dd.appendChild(opt);
                });
                dd.selectedIndex = Data.getSelectedGameIdx();
            }

            function onGamesDropdownChange() {
                Data.setSelectedGameIdx(document.getElementById('gamesDropdown').selectedIndex);
                renderTreeView();
            }

            function createGame() {
                const name = prompt("Game name?");
                if (!name) return;
                Data.createGame(name);
                renderGamesDropdown();
                renderTreeView();
            }
            function removeGame() {
                const idx = Data.getSelectedGameIdx();
                if (Data.getGames().length === 0) return;
                if (!confirm("Delete this game?")) return;
                Data.removeGame(idx);
                renderGamesDropdown();
                renderTreeView();
            }
            function updateGame() {
                const idx = Data.getSelectedGameIdx();
                const games = Data.getGames();
                if (games.length === 0) return;
                const name = prompt("Edit game name:", games[idx].name);
                if (!name) return;
                Data.updateGame(idx, name);
                renderGamesDropdown();
                renderTreeView();
            }

            // --- TreeView CRUD ---
            function renderTreeView() {
                const games = Data.getGames();
                const selectedGameIdx = Data.getSelectedGameIdx();
                const container = document.getElementById('treeView');
                container.innerHTML = '';
                if (!games[selectedGameIdx]) return;
                const game = games[selectedGameIdx];

                // Game Desc & Settings
                const gameDesc = document.createElement('div');
                gameDesc.className = 'tree-item';
                gameDesc.innerHTML = `<span class="tree-label">Desc:</span> <span>${game.desc || '<i>none</i>'}</span>
                    <button class="crud-btn" title="Edit Desc" data-action="editGameDesc">✎</button>`;
                container.appendChild(gameDesc);

                // Game Settings
                if (game.settings && game.settings.length) {
                    const settingsDiv = document.createElement('div');
                    settingsDiv.className = 'tree-group';
                    settingsDiv.innerHTML = `<b>Settings</b><ul style="margin:0 0 0 16px;">${game.settings.map(s => `<li><span class='tree-label'>${s.key}:</span> ${s.value}</li>`).join('')}</ul>`;
                    container.appendChild(settingsDiv);
                }

                // Players
                if (game.players && game.players.length) {
                    const playersDiv = document.createElement('div');
                    playersDiv.className = 'tree-group';
                    playersDiv.innerHTML = `<b>Players</b><ul style="margin:0 0 0 16px;">${game.players.map(p => `<li>${p.name}</li>`).join('')}</ul>`;
                    container.appendChild(playersDiv);
                }

                // Scenes group
                const scenesGroup = document.createElement('div');
                scenesGroup.className = 'tree-group';
                scenesGroup.innerHTML = `<b>Scenes</b>
                    <button class="crud-btn" title="Add Scene" data-action="addScene">＋</button>`;
                // List scenes
                (game.scenes||[]).forEach((scene, si) => {
                    const sceneDiv = document.createElement('div');
                    sceneDiv.className = 'scene tree-group';
                    sceneDiv.innerHTML = `
                        <div class="tree-item">
                            <span class="tree-label">${scene.name}</span> <span style="font-size:0.9em;color:#888;">[${scene.status}]</span>
                            <button class="crud-btn" title="Edit Scene" data-action="editScene" data-si="${si}">✎</button>
                            <button class="crud-btn" title="Remove Scene" data-action="removeScene" data-si="${si}">🗑</button>
                        </div>
                        <div class="desc tree-item">
                            <span class="tree-label">Desc:</span> <span>${scene.desc || '<i>none</i>'}</span>
                            <button class="crud-btn" title="Edit Desc" data-action="editSceneDesc" data-si="${si}">✎</button>
                        </div>
                        <div class="tree-item"><span class="tree-label">Pips:</span> ${scene.pips || 0}</div>
                        <div class="tree-group">
                            <b>Obstacles</b>
                            <ul style="margin:0 0 0 16px;">
                            ${(scene.obstacles||[]).map(ob => `<li><span class='tree-label'>${ob.name}</span> <span style='color:#888;'>[${ob.status}${ob.outcome ? ', ' + ob.outcome : ''}]</span>${ob.assigned && ob.assigned.length ? ' <span style=\"color:#666;\">Assigned: ' + ob.assigned.map(cid => (game.characters.find(c=>c.id===cid)||{}).name).join(', ') + '</span>' : ''}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="tree-group">
                            <b>Scene Characters</b>
                            <ul style="margin:0 0 0 16px;">
                            ${(scene.scene_characters||[]).map(sc => `<li><span class='tree-label'>${sc.name}</span> <span style='color:#888;'>${sc.desc||''}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="tree-group">
                            <b>Goals</b>
                            <ul style="margin:0 0 0 16px;">
                            ${(scene.goals||[]).map(goal => `<li><span class='tree-label'>${goal.name}</span> <span style='color:#888;'>[${goal.status}]</span> <span style='color:#666;'>(${(game.characters.find(c=>c.id===goal.character_id)||{}).name||''})</span> <span style='color:#888;'>${goal.desc||''}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="tree-group">
                            <b>Assets</b>
                            <ul style="margin:0 0 0 16px;">
                            ${(scene.assets||[]).map(asset => `<li><span class='tree-label'>${asset.name}</span> <span style='color:#888;'>[${asset.status}]</span> <span style='color:#666;'>(${(game.characters.find(c=>c.id===asset.character_id)||{}).name||''})</span> <span style='color:#888;'>${asset.desc||''}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="tree-group">
                            <b>Characters</b>
                            <div class="character-cards">
                                ${(scene.characters||[]).map(cid => {
                                    const char = game.characters.find(c=>c.id===cid);
                                    if (!char) return '';
                                    let playerNames = (char.playerIds||[]).map(pid => (game.players.find(p=>p.id===pid)||{}).name).join(', ');
                                    let charCards = (char.cards||[]).map(cardId => {
                                        const card = cards.find(c=>c.id===cardId);
                                        if (!card) return '';
                                        const type = cardTypes.find(t=>t.id===card.card_type_id);
                                        return `<div style='font-size:0.9em;'>${card.name} <span style='color:#888;'>[${type ? type.name : ''}${type && type.is_wild ? ', Wild' : ''}]</span></div>`;
                                    }).join('');
                                    let charAssets = (char.assets||[]).map(aid => {
                                        const asset = (scene.assets||[]).find(a=>a.id===aid);
                                        return asset ? `<div style='font-size:0.9em;color:#008;'>Asset: ${asset.name}</div>` : '';
                                    }).join('');
                                    let charGoals = (char.goals||[]).map(gid => {
                                        const goal = (scene.goals||[]).find(g=>g.id===gid);
                                        return goal ? `<div style='font-size:0.9em;color:#080;'>Goal: ${goal.name} [${goal.status}]</div>` : '';
                                    }).join('');
                                    let charSubplots = (char.subplots||[]).map(spid => {
                                        const subplot = subplots.find(s=>s.id===spid);
                                        return subplot ? `<div style='font-size:0.9em;color:#a60;'>Subplot: ${subplot.progress_note}</div>` : '';
                                    }).join('');
                                    let charMoves = (char.moves||[]).map(mid => {
                                        const move = moves.find(m=>m.id===mid);
                                        if (!move) return '';
                                        const ci = cardInstances.find(ci=>ci.id===move.card_instance_id);
                                        return `<div style='font-size:0.85em;color:#555;margin-top:2px;'>Move: ${move.text} <span style='color:#888;'>[${ci ? ci.custom_name : ''}]</span></div>`;
                                    }).join('');
                                    return `<div class=\"character-card\">
                                        <b>${char.name}</b> <span style='color:#888;font-size:0.9em;'>[${char.status}]</span>
                                        <div style='font-size:0.85em;color:#666;'>Players: ${playerNames}</div>
                                        ${charCards}
                                        ${charAssets}
                                        ${charGoals}
                                        ${charSubplots}
                                        ${charMoves}
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                    scenesGroup.appendChild(sceneDiv);
                });
                container.appendChild(scenesGroup);
            }

            function editGameDesc() {
                const idx = Data.getSelectedGameIdx();
                const games = Data.getGames();
                const desc = prompt("Edit game description:", games[idx].desc || "");
                if (desc !== null) { Data.updateGameDesc(idx, desc); renderTreeView(); }
            }
            function addScene() {
                // Placeholder: implement scene add logic as needed
                alert('Add Scene (not implemented)');
            }
            function editScene(si) {
                // Placeholder: implement scene edit logic as needed
                alert('Edit Scene (not implemented)');
            }
            function removeScene(si) {
                // Placeholder: implement scene remove logic as needed
                alert('Remove Scene (not implemented)');
            }
            function editSceneDesc(si) {
                // Placeholder: implement scene desc edit logic as needed
                alert('Edit Scene Desc (not implemented)');
            }

            // --- Table Builder Tab ---
            function buildTables() {
                const text = document.getElementById('tableTextArea').value;
                const tables = Data.parseTables(text);
                Data.buildDataModelFromTables(tables);
                if (Data.getGames().length > 0) Data.setSelectedGameIdx(0);
                renderGamesDropdown();
                renderTreeView();
            }
            function loadFromTree() {
                const games = Data.getGames();
                const selectedGameIdx = Data.getSelectedGameIdx();
                const game = games[selectedGameIdx];
                let txt = `Game: ${game.name}\nDesc: ${game.desc}\nScenes:\n`;
                (game.scenes||[]).forEach(scene => {
                    txt += `  - Scene: ${scene.name}\n    Desc: ${scene.desc}\n    Characters:\n`;
                    (scene.characters||[]).forEach(char => {
                        txt += `      * ${char.name}: ${char.desc}\n`;
                    });
                });
                document.getElementById('tableTextArea').value = txt;
            }

            // --- Event Wiring ---
            function wireEvents() {
                document.querySelectorAll('.tab').forEach((tab, i) => {
                    tab.onclick = () => showTab(i);
                });
                document.getElementById('gamesDropdown').onchange = onGamesDropdownChange;
                document.querySelector('button[title="Create Game"]').onclick = createGame;
                document.querySelector('button[title="Remove Game"]').onclick = removeGame;
                document.querySelector('button[title="Update Game"]').onclick = updateGame;
                document.querySelector('button.icon-btn[onclick*="buildTables"]').onclick = buildTables;
                document.querySelector('button.icon-btn[onclick*="loadFromTree"]').onclick = loadFromTree;
                // TreeView dynamic buttons
                document.getElementById('treeView').onclick = function(e) {
                    if (e.target && e.target.dataset && e.target.dataset.action) {
                        const action = e.target.dataset.action;
                        const si = e.target.dataset.si !== undefined ? parseInt(e.target.dataset.si, 10) : undefined;
                        if (action === 'editGameDesc') editGameDesc();
                        if (action === 'addScene') addScene();
                        if (action === 'editScene') editScene(si);
                        if (action === 'removeScene') removeScene(si);
                        if (action === 'editSceneDesc') editSceneDesc(si);
                    }
                };
            }

            // --- Init ---
            function init() {
                renderGamesDropdown();
                renderTreeView();
                wireEvents();
            }

            // Expose API
            return {
                init,
                renderGamesDropdown,
                renderTreeView,
                buildTables,
                loadFromTree
            };
        })();
    </script>
    <script>
    // --- Main App Entry Point: Only expose window.Storium ---
    window.Storium = {
        Data: window.StoriumDataLib,
        UI: window.StoriumUILib
    };
    // Initialize UI on page load
    window.addEventListener('DOMContentLoaded', function() {
        window.Storium.UI.init();
    });
    </script>
</body>
</html>
