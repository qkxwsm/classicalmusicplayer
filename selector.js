let composers = new Set();

names = document.getElementById("names");

for (let i = 0; i < pieces.length; i++)
{
    let piece = pieces[i][0];
    let composer = pieces[i][2];
    composers.add(composer);
    opt = document.createElement('option');
    opt.value = opt.innerHTML = piece + " by " + composer;;
    names.add(opt);
}

composer = document.getElementById("composer");
composerlist = Array.from(composers).sort();
for (let i = 0; i < composerlist.length; i++)
{
    opt = document.createElement('option');
    opt.value = opt.innerHTML = composerlist[i];
    composer.add(opt);
}
