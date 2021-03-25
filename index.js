const _Audio = (() => {
	const audio = new Audio('./audio/audio.mp3');
	let isPlaying = false;

	const start = () => {
		audio.currentTime = 0;
		audio.play();
		isPlaying = true;
	}

	const pause = () => {
		audio.pause();
		isPlaying = false;
	}

	return {
		start,
		pause
	};
})();

const _Key = (props) => {
	const state = {
		active: false,
		element: props.keyElement,
		key: props.targetKey
	};

	const press = () => {
		state.element.classList.add("active");
		state.active = true;
		_Game.onKey(state.key);
	};

	const release = () => {
		state.element.classList.remove("active");
		state.active = false;
	};

	return {
		press,
		release
	}
};

const _Keys = (() => {
	const keyElements = document.querySelectorAll("[key]");
	const keys = {};

	for(let keyElement of keyElements) {
		const targetKey = keyElement.getAttribute("key");
		keys[targetKey] = _Key({
			targetKey,
			keyElement
		});
	}

	const onKeydown = (targetKey) => {
		targetKey = targetKey.toUpperCase();
		if(keys[targetKey] != null) {
			keys[targetKey].press();
		}
	}

	const onKeyup = (targetKey) => {
		targetKey = targetKey.toUpperCase();
		if(keys[targetKey] != null) {
			keys[targetKey].release();
		}
	}

	return {
		onKeydown,
		onKeyup
	}
})();

const _Drawer = ((canvas) => {
	const ctx = canvas.getContext("2d");
	const width = 400;
	const height = 300;

	const draw = ({ x, y, w, h, color }) => {
		ctx.fillStyle = color || 'black';
		ctx.fillRect(x, y, w, h);
	};

	const clear = () => {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, width, height);
	};
	
	const getWidth = () => width;
	const getHeight = () => height;
	
	return {
		draw,
		clear,
		getWidth,
		getHeight,
	}
})(document.getElementById("gameCanvas"));

const play = () => {
	_Game.start();
};

const pause = () => {
	_Game.stop();
};

document.addEventListener("keydown", (e) => {
	_Keys.onKeydown(e.key);
});


document.addEventListener("keyup", (e) => {
	_Keys.onKeyup(e.key);
});
