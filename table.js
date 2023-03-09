let table = document.getElementById("songs");

for (let i = 0; i < pieces.length; i++)
{
    let row = table.insertRow(-1);
    let id = row.insertCell(0);
    id.innerHTML = i + 1;
    let piece = row.insertCell(1);
    piece.innerHTML = pieces[i][0];
    let key = row.insertCell(2);
    key.innerHTML = pieces[i][1];
    let composer = row.insertCell(3);
    composer.innerHTML = pieces[i][2];
    let era = row.insertCell(4);
    era.innerHTML = pieces[i][5];
    let len = row.insertCell(5);
    len.innerHTML = (pieces[i][3] < 10 ? "0" : "") + pieces[i][3] + " min";
    let rating = row.insertCell(6);
    rating.innerHTML = "#" + pieces[i][4];
}

sorttable.makeSortable(table);
