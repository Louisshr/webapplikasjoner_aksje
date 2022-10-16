let personId = 1;
localStorage.setItem('data', personId);

$(function () {
    hentAlleAksjer();
})



function hentAlleAksjer() {
    $.get("aksje/hentAksjer", function (aksjer) {
        formaterAksjer(aksjer);
    })
}

function formaterAksjer(aksjer) {
    let ut = "<table class = 'table table-striped'>" +
        "<tr>" +
        "<th>Aksje</th><th>Pris</th><th>Omsetning</th>" +
        "<tr>";

    for (let aksje of aksjer) {
        ut += "<tr>" +
            "<td>" + aksje.navn + "</td>" +
            "<td>" + aksje.verdi + "</td>" +
            "<td>" + aksje.omsetning + "</td>" +
            "<td> <button class='btn btn-primary' onclick='kjop(" + aksje.id + ")'>Kjøp</button></td>" +
            "</tr>"
    }
    ut += "</table>";
    document.querySelector(".output").innerHTML = ut;
}


function kjop(id) {
    const url = "aksje/hentEn?id=" + id;
    const antall = 2;                   // i endelig program, skal antall velges av bruker

    let pris = undefined;

    $.get(url, function (aksje) {
        utforKjop(aksje.verdi, antall, id, aksje.navn);
    });
}

function utforKjop(verdi, antall, id, aksjeNavn) {

    let totalPris = verdi * antall;

    let salgObjekt =
    {
        person: personId,
        antall: antall,
        pris: totalPris,
        aksje: id
    }

    $.post("aksje/kjopAksje", salgObjekt, function (OK) {
        let ut = "";

        if (OK) {
            ut = "Kjøp er gjennomført. Du handlet " + antall + " " + aksjeNavn + " aksjer. ";
        }
        else {
            ut = "Det oppstod en feil under kjøpet. Kjøpet er avbrutt";
        }

        document.querySelector(".resultat").innerHTML = ut;

    })

}



function send() {

    $.get("aksje/hentPortfolje", function (aksjer) {
        ut = "";
        for (let i of aksjer) {
            ut += i.aksje.navn + ", antall: " + i.antall + ", pris: " + i.pris + ", ";

        }

        document.querySelector(".resultat").innerHTML = ut;
    });

    /*
    
    let id = 1;
    const url = "aksje/sjekk?id=" + id;
    $.get(url, function (OK) {
        if (OK) {
            console.log("RIKTIG");
        }
        else {
            console.log("FEIL");
        }

    });
    */
}
