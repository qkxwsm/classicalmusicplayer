/**
 * Helper function, returns a random integer in the range [0, k).
 * @param {number} k - Non-negative integer.
 * @returns {number} - Random integer.
 */
function getRandom(k) {
    return Math.floor(Math.random() * k);
}

/**
 * Helper function, returns the filepath to the piece with the specified ID.
 * @param {number} pid - Integer piece ID.
 * @returns {string} - Filepath to the piece.
 */
function getFile(pid) {
    const piece = pieces[pid][0];
    const composer = pieces[pid][2];
    return `Music/${composer} ${piece}.mp4`;
}

/**
 * Helper function, returns a human-readable string of piece information.
 * @param {number} pid - Integer piece ID.
 * @param {boolean} flag - Determines whether to include the piece ID in the string.
 * @returns {string} - Human-readable string of piece information.
 */
function toString(pid, flag) {
    const piece = pieces[pid][0];
    const composer = pieces[pid][2];
    let result = `${piece} by ${composer}`;
    if (flag) {
        result += ` (ID: ${pid + 1})`;
    }
    return result;
}

let taken = new Set();
let autoPlay = false;
let condition_id = -1, required_value = "";
let queue = [], queueIndex = 0;

let listener = function (e) {
    playNext();
};

/*
 * Start playing a piece.
 * @param {number} piece - Integer piece index.
 */
function playMusic(piece) {
    taken.add(piece);
    console.log(toString(piece, false));
    const audio = document.getElementById('audio');
    const loc = getFile(piece);
    audio.setAttribute('src', loc);
    document.getElementById('current').textContent = toString(piece, true);
    audio.play();
}

/*
 * Updates the text box with the piece that's coming next.
 */
function updNext() {
    if (queueIndex !== queue.length) {
        const nxt = queue[queueIndex];
        document.getElementById('next').innerHTML = toString(nxt, true);
    } 
    else {
        document.getElementById('next').innerHTML = "undefined";
    }
}

/*
 * Adds a new piece to the queue and updates the piece that's coming next.
 */
function enqueue() {
    const nextSong = gen();
    if (nextSong === queue[queue.length - 1]) {
        if (autoPlay) {
            toggle();
            updNext();
        }
        return;
    }
    queue.push(nextSong);
    updNext();
}

/*
 * Plays the next piece in the queue. If none exists and autoplay is on, adds a new one to the queue.
 */
function playNext() {
    playMusic(queue[queueIndex]);
    queueIndex++;
    if (queueIndex === queue.length && autoPlay) {
        enqueue();
    } 
    else {
        updNext();
    }
}

/*
 * Toggles the autoplay functionality.
 */
function toggle() {
    if (autoPlay) {
        document.getElementById('audio').removeEventListener('ended', listener);
        document.getElementById('autoplay').innerHTML = "Off";
        autoPlay = false;
    } 
    else {
        document.getElementById('audio').addEventListener('ended', listener, false);
        enqueue();
        document.getElementById('autoplay').innerHTML = "On";
        autoPlay = true;
    }
    return;
}

/*
 * Generates a new piece id, according to the most recent conditions.
 * @returns {number} - Generated piece id.
 */
function gen() {
    let pid, cnt = 0;
    switch (condition_id) {
        case 0:
            // Name
            pid = 0;
            while (toString(pid, false) !== required_value) {
                pid++;
            }
            break;
        case 1: 
            // ID
            pid = required_value;
            break;
        case 2:
            // Advanced
            const candidates = pieces
                .map(([name, key, composer, duration, rating, era, playlist, album], pid) => ({
                    pid, name, key, composer, duration, rating, era, playlist, album,
                }))
                .filter(({ pid, composer, duration, rating, key, era, playlist }) =>
                    !taken.has(pid) &&
                    composer.includes(required_value[0]) &&
                    duration >= required_value[1] &&
                    duration <= required_value[2] &&
                    rating <= required_value[3] &&
                    key.endsWith(required_value[4]) &&
                    era.includes(required_value[5]) &&
                    (required_value[6] === "" || playlist.includes(required_value[6]))
                )
                .map(({ pid }) => pid);
            if (candidates.length) {
                return candidates[getRandom(candidates.length)];
            }
            if (taken.size === 0) {
                condition_id = -1;
                required_value = "";
                return gen();
            }
            taken.clear();
            pid = gen();
            break;
        case 3:
            pid = playlists[required_value][getRandom(playlists[required_value].length)] - 1;
            while (taken.has(pid)) {
                pid = playlists[required_value][getRandom(playlists[required_value].length)] - 1;
                cnt++;
                if (cnt >= 1000) {
                    taken.clear();
                }
            }
            break;
        default:
            pid = getRandom(pieces.length);
            while (taken.has(pid)) {
                pid = getRandom(pieces.length);
                cnt++;
                if (cnt >= 1000) {
                    taken.clear();
                }
            }
    }
    taken.add(pid);
    return pid;
}

/*
 * Generates a new piece and plays it.
 */
function play() {
    let piece = gen();
    queue.push(piece);
    playMusic(piece);
    queueIndex = queue.length;
    if (autoPlay) {
        enqueue();
    } 
    else {
        updNext();
    }
}

/*
 * Generates a new piece to be played. To be called upon the click of a button.
 * First, sets the condition to be equal to the type of button clicked.
 * Then, plays/enqueues one new piece according to the condition.
 * @param {string} type - The type of button that was clicked.
 * @param {boolean} forcePlay - Whether the new piece should be played (true) or enqueued (false).
 */
function playBy(type, forcePlay) {
    switch (type) {
        case "name":
            condition_id = 0;
            required_value = document.getElementById('names').value;
            if (required_value === 'random') {
                condition_id = -1;
                required_value = "";
            }
            break;
        case "id":
            condition_id = 1;
            required_value = document.getElementById('ids').value - 1;
            if (required_value == -1) {
                condition_id = -1;
                required_value = "";
            }
            break;
        case "advanced":
            condition_id = 2;
            required_value = [
                document.getElementById('composer').value,
                parseInt(document.getElementById('low').value),
                parseInt(document.getElementById('high').value),
                document.getElementById('tier').value,
                document.getElementById('key').value,
                document.getElementById('era').value,
                document.getElementById('playlist').value
            ];
            break;
    }
    if (forcePlay) {
        play();
    } 
    else {
        enqueue();
    }
}

/*
 * Plays the selected album by playing the first piece and adding the remaining pieces in the album to the queue.
 */
function playAlbum() {
    let album = document.getElementById('albums').value;
    if (album === 'random') {
        album = albumList[getRandom(albumList.length)];
    }
    const pieces = [...albumMap.get(album)];
    if (document.getElementById('random').checked) {
        for (let i = 1; i < pieces.length; i++) {
            const idx = getRandom(i + 1);
            if (i != idx) {
                [pieces[i], pieces[idx]] = [pieces[idx], pieces[i]];
            }
        }
    }
    condition_id = 0;
    for (let i = 0; i < pieces.length; i++) {
        required_value = pieces[i][0] + " by " + pieces[i][1];
        if (i == 0) {
            play();
        } 
        else {
            enqueue();
        }
    }
    if (!autoPlay) {
        toggle();
    }
}

/*
 * Clears the piece queue.
 */
function clearQueue() {
    while (queue.length > queueIndex) {
        queue.pop();
    }
    updNext();
}