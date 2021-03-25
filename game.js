const _BLOCKS = [
    {
        startAt: 8000,
        span: 25,
        colliderSpan: 75,
        targetKey: "D"
    },
    {
        startAt: 8050,
        span: 25,
        colliderSpan: 75,
        targetKey: "F"
    },
    {
        startAt: 8100,
        span: 25,
        colliderSpan: 75,
        targetKey: "H"
    },
    {
        startAt: 8150,
        span: 25,
        colliderSpan: 75,
        targetKey: "D"
    },
    {
        startAt: 8200,
        span: 25,
        colliderSpan: 75,
        targetKey: "F"
    },
    {
        startAt: 8250,
        span: 25,
        colliderSpan: 75,
        targetKey: "H"
    },
    {
        startAt: 8300,
        span: 25,
        colliderSpan: 75,
        targetKey: "D"
    },
    {
        startAt: 8350,
        span: 25,
        colliderSpan: 75,
        targetKey: "H"
    },
    //end group
];

const keyToRow = (key) => {
    switch (key) {
        case "A": return 0;
        case "S": return 1;
        case "D": return 2;
        case "F": return 3;
        case "H": return 4;
        case "J": return 5;
        case "K": return 6;
        case "L": return 7;
        default: return 8;
    }
};

const GAME_STATE = {
    NONE: 0,
    IN_PROGRESS: 1,
    END: 2
};

const SPEED_MODIFIER = 4;
const REVERSED_SPEED_MODIFIER = (1 / SPEED_MODIFIER);

const GAME_BOARD_HEIGHT = _Drawer.getHeight();

const _GameBlock = (block) => {
    const state = {
        w: 20,
        h: block.span,
        x: (keyToRow(block.targetKey) * 50) + 15,
        y: 0,
        key: block.targetKey,
        checked: false,
    };
    
    const getRect = () => ({
        w: state.w,
        h: state.h,
        x: state.x,
        y: state.y - state.h
    });
    
    const update = (time) => {
        state.y = (time - block.startAt) * REVERSED_SPEED_MODIFIER;
    };
    
    const isObsolete = () => {
        return state.y - block.colliderSpan > GAME_BOARD_HEIGHT;
    };
    
    const isKey = (key) => {
        return state.key === key;
    };
    
    const pressFrame = () => {
        const t = state.y - GAME_BOARD_HEIGHT;
        return t > 0 && t < block.colliderSpan;
    };
    
    const check = () => {
        state.checked = true;
    };
    
    const onOut = () => {
        _Game.onBlockResult(state.checked);
    };
    
    return {
        getRect,
        update,
        isObsolete,
        isKey,
        pressFrame,
        check,
        onOut,
    }
};

const _Game = ((drawer) => {
    const state = {
        startTime: 0,
        time: 0,
        isPlaying: false,
        activeBlocks: [],
        lastBlockIndex: 0,
        
        gameState: GAME_STATE.NONE,
        success: 0,
        fails: 0,
    };
    
    const update = () => {
        state.time = (Date.now() - state.startTime);
        checkNewBlocks(state.time);
        checkObsoleteBlocks(state.time);
        
        drawer.clear();
        
        for(const block of state.activeBlocks) {
            block.update(state.time);
            drawer.draw(block.getRect());
        }
    
        state.gameState = checkGameState();
        
        if(state.gameState === GAME_STATE.IN_PROGRESS){
            window.requestAnimationFrame(update);
        }
    };
    
    const checkNewBlocks = (time) => {
        if(state.lastBlockIndex < _BLOCKS.length && _BLOCKS[state.lastBlockIndex].startAt < time){
            spawnBlock(_BLOCKS[state.lastBlockIndex]);
            state.lastBlockIndex++;
            return checkNewBlocks(time);
        }
        
        return null;
    };
    
    const checkObsoleteBlocks = (time) => {
        state.activeBlocks = state.activeBlocks.filter((block) => {
            if(block.isObsolete(time)){
                block.onOut();
                return false;
            } else {
                return true;
            }
        });
    };
    
    const checkGameState = () => {
        if(state.lastBlockIndex >= _BLOCKS.length && state.activeBlocks.length === 0){
            alert("END! " + state.success + " : " + state.fails);
            return GAME_STATE.END;
        }
        
        return state.gameState;
    }
    
    const spawnBlock = (block) => {
        state.activeBlocks.push(_GameBlock(block));
    };
    
    const onKey = (key) => {
        for(const block of state.activeBlocks) {
            if(block.isKey(key) && block.pressFrame(state.time)){
                console.log("Got key: " + key);
                block.check();
            }
        }
    };
    
    const start = () => {
        state.startTime = Date.now();
        state.gameState = GAME_STATE.IN_PROGRESS;
        _Audio.start();
        window.requestAnimationFrame(update);
    };
    
    const stop = () => {
        _Audio.pause();
        state.gameState = GAME_STATE.END;
    };
    
    const onBlockResult = (success) => {
        if(success){
            state.success++;
        } else {
            state.fails++;
        }
    };
    
    return {
        start,
        stop,
        onKey,
        onBlockResult,
    }
})(_Drawer);
