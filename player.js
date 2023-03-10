function getRandom(k)
{
    return Math.floor(Math.random() * k);
}

let taken = new Set();
let autoPlay = false;
let cid = -1, cv = "";
let queue = [], queueIndex = 0;

let listener = function (e) {
    playNext();
};
function playMusic(piece)
{
    taken.add(piece);
    console.log(getHash(piece));
    let audio = document.getElementById('audio');
    let loc = getFile(piece);
    audio.setAttribute('src', loc);
    document.getElementById('current').textContent = getTitle(piece);
    audio.play();
}
function updNext()
{
    console.log("Index", queueIndex, "length", queue.length);
    if (queueIndex != queue.length)
    {
        console.log("but somehow we go here");
        nxt = queue[queueIndex];
        document.getElementById('next').innerHTML = getTitle(nxt); 
    } 
    else
    {
        document.getElementById('next').innerHTML = "undefined"; 
    }
}
function enqueue()
{
    let nextSong = gen();
    if (nextSong == queue[queue.length - 1])
    {
        if (autoPlay)
        {
            toggle();
            updNext();
        }
        return;
    }
    queue.push(nextSong);
    updNext();
}
function playNext()
{   
    // if (autoPlay)
    // {
        playMusic(queue[queueIndex]);
        queueIndex++;
        if (queueIndex == queue.length && autoPlay)
        {
            enqueue();
        }
        else
        {
            updNext();
        }
    // }
    // else
    // {
    //     console.log("reached");
    //     let audio = document.getElementById('audio');
    //     audio.removeAttribute('src');
    //     updNext();
    // }
}
function toggle()
{
    if (autoPlay)
    {
        document.getElementById('audio').removeEventListener('ended', listener);
        document.getElementById('autoplay').innerHTML = "Off";
        autoPlay = false;
    }
    else
    {
        document.getElementById('audio').addEventListener('ended', listener, false);
        enqueue();
        document.getElementById('autoplay').innerHTML = "On";
        autoPlay = true;
    }
}
function getFile(pid)
{
    piece = pieces[pid][0];
    composer = pieces[pid][2];
    return "Music/" + composer + " " + piece + ".mp4";
}
function getHash(pid)
{
    piece = pieces[pid][0];
    composer = pieces[pid][2];
    return piece + " by " + composer;
}
function getTitle(pid)
{
    piece = pieces[pid][0];
    composer = pieces[pid][2];
    return piece + " by " + composer + " (ID: " + (pid + 1) + ")";
}
function check(id, pid, val)
{
    if (!val)
    {
        return true;
    }
    if (id == 2)
    {
        return pieces[pid][2].includes(val);
    }
    if (id == 3)
    {
        let high = val % 100;
        let low = (val - high) / 100 + 1;
        return (low <= pieces[pid][3] && pieces[pid][3] <= high);
    }
    if (id == 4)
    {
        return pieces[pid][4] <= val;
    }
    if (id == 5)
    {
        return pieces[pid][1].endsWith(val);
    }
    if (id == 6)
    {
        return pieces[pid][5].includes(val);
    }
    if (id == 7)
    {
        return pieces[pid][6].includes(val);
    }
}
function gen()
{
    let pid;
    if (cid == 0)
    {
        pid = 0;
        while(getHash(pid) != cv)
        {
            pid++;
        }
    }
    else if (cid == 1)
    {
        pid = cv;
    }
    else if (cid == 2)
    {
        let cnt = 0, oks = [];
        for (pid = 0; pid < pieces.length; pid++)
        {
            if (taken.has(pid))
            {
                continue;
            }
            let ok = true;
            for (let id = 0; id < cv.length; id++)
            {
                if (!check(id + 2, pid, cv[id]))
                {
                    ok = false;
                }
            }
            if (ok)
            {
                oks.push(pid);
            }
        }
        if (oks.length)
        {
            return oks[getRandom(oks.length)];
        }
        if (taken.size == 0)
        {
            cid = -1;
            cv = "";
            return gen();
        }
        taken.clear();
        return gen();
    }
    else if (cid == 3)
    {
        pid = playlists[cv][getRandom(playlists[cv].length)] - 1;
        let cnt = 0;
        while(taken.has(pid))
        {
            pid = playlists[cv][getRandom(playlists[cv].length)] - 1;
            cnt++;
            if (cnt >= 1000)
            {
                taken.clear();
            }
        }
        return pid;
    }
    else
    {
        pid = getRandom(pieces.length);
        let cnt = 0;
        while(taken.has(pid))
        {
            pid = getRandom(pieces.length);
            cnt++;
            if (cnt >= 1000)
            {
                taken.clear();
            }
        }
    }
    taken.add(pid);
    return pid;
}
function workName()
{
    cid = 0;
    cv = document.getElementById('names').value;
}
function workID()
{
    cid = 1;
    cv = document.getElementById('ids').value - 1;
    if (cv == -1)
    {
        cid = -1;
        cv = "";
    }
}
function workAdvanced()
{
    cid = 2;
    cv = [document.getElementById('composer').value,
    100 * parseInt(document.getElementById('low').value) + parseInt(document.getElementById('high').value),
    document.getElementById('tier').value,
    document.getElementById('key').value,
    document.getElementById('era').value,
    document.getElementById('playlist').value];
}
function play()
{
    let piece = gen();
    queue.push(piece);
    playMusic(piece);
    queueIndex = queue.length;
    if (autoPlay)
    {
        enqueue();
    }
    else
    {
        updNext();
    }
}
function playName()
{
    workName();
    play();
}
function playID()
{
    workID();
    play();
}
function playAdvanced()
{
    workAdvanced();
    play();
}
function enqueueName()
{
    workName();
    enqueue();
}
function enqueueID()
{
    workID();
    enqueue();
}
function enqueueAdvanced()
{
    workAdvanced();
    enqueue();
}
function clearQueue()
{
    while(queue.length > queueIndex)
    {
        queue.pop();
    }
    updNext();
}
