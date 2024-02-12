let albumTable = document.getElementById("albums");

for (const [key, pieceList] of albumMap.entries())
{
    const pieceList = albumMap.get(key);
    let albumInfo = document.createElement("p");
    let albumLen = 1;
    for (let i = 0; i < pieceList.length; i++)
    {
        const piece = pieceList[i];
        albumLen += (piece[2] - 0.5);
    }
    albumInfo.innerHTML = "<b>" + key + " </b><br>" + "<i>Length: " + Math.floor(albumLen) + " minutes</i><br>";
    for (let i = 0; i < pieceList.length; i++)
    {
        const piece = pieceList[i];
        albumInfo.innerHTML += (i + 1).toString() + ". " + piece[0] + " (ID: " + (piece[3] + 1) + ")<br>";
    }
    albumInfo.innerHTML += "\n";
    albumTable.append(albumInfo);
}