var table = document.getElementById("songs");

for (var i = 0; i < pieces.length; i++)
{
    // if (pieces[i][4] == 5)
    // {
    //     continue;
    // }
    var row = table.insertRow(-1);
    var id = row.insertCell(0);
    id.innerHTML = i + 1;
    var piece = row.insertCell(1);
    piece.innerHTML = pieces[i][0];
    var key = row.insertCell(2);
    key.innerHTML = pieces[i][1];
    var composer = row.insertCell(3);
    composer.innerHTML = pieces[i][2];
    var era = row.insertCell(4);
    era.innerHTML = pieces[i][5];
    var len = row.insertCell(5);
    len.innerHTML = (pieces[i][3] < 10 ? "0" : "") + pieces[i][3] + " min";
    var rating = row.insertCell(6);
    rating.innerHTML = "#" + pieces[i][4];
    // var tags = row.insertCell(6);
    // tags.innerHTML = pieces[i].slice(5, )
}

sorttable.makeSortable(table);
