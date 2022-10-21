let id = localStorage.getItem('data');

$(function () {
    hentSaldo();
    hentPortefolje();
})


function hentSaldo() {
    const url = "aksje/hentSaldo?id=" + id;

    $.get(url, function (saldo) {
        if (saldo != -1) {
            document.getElementById("felt-for-saldo").innerHTML = saldo.toFixed(2) + " USD";
        }
        else {
            console.log("Det har oppstått en feil, saldo er ikke tilgjengelig");
        }

    })
}

function hentPortefolje() {
    const url = "aksje/hentPortefolje?id=" + id;

    $.get(url, function (portefolje) {

        if (portefolje != null) {
            formaterPortefolje(portefolje);
        }
        else {
            console.log("Det har oppstått en feil. Venligst prøv igjen senere");
        }
    })
}

function formaterPortefolje(portefolje) {
    let ut = "<table class='table'><thead class='thead-light'>" + "<tr>" +
        "<th scope='col'>Navn</th>" +
        "<th scope='col'>Antall</th>" +
        "<th scope='col'>Verdi (USD)</th>" +
        "<th style='width: 150px' scope = 'col'>selg</th>" +
        "</tr></thead><tbody>";

    for (let aksje of portefolje) {
        ut += "<tr>" +
            "<th scope='row'>" + aksje.aksje.navn + "</th>" +
            "<td>" + aksje.antall + "</td>" +
            "<td>" + aksje.pris.toFixed(2) + "</td>" +
            "<td> <button class='btn btn-danger' data-toggle='modal' data-target='#selg_popupBox' onclick='selg(" + aksje.aksje.id + ")'>selg</button></td>" +
            "</tr>";

        console.log(aksje.aksje.id);
    }

    ut += "</tbody></table>";
    document.querySelector(".portefolje-container").innerHTML = ut;
}

function selg(id) {
    const url = "aksje/hentEn?id=" + id;

    $.get(url, function (aksje) {
        //informasjon skal kun opprettes hvis get kallet er suksessfullt
        //kan hende at bestilling navn og kurs bør defineres utenfor en funksjon slik at man ikke trenger å hente de hver gang

        document.getElementById("popupBox").innerHTML = "Selg " + "(" + aksje.navn + ")";
        document.getElementById("selg-knapp").onclick = function () { fullforSalg(aksje.id, aksje.verdi, aksje.navn); }
    });

}


function fullforSalg(aksje_id, verdi, aksje_navn) {
    let input_antall = document.getElementById("typeNumber");
    let antall = Number(input_antall.value);

    if (isNaN(antall) || input_antall == '') {
        console.log("Venligst oppgi et gyldig antall");
    }

    let selg_objekt =
    {
        personId: id,
        aksjeId: aksje_id,
        antall: antall
    }

    $.post("aksje/selg", selg_objekt, function (OK) {
        if (OK) {
            console.log("Solgt: " + aksje_navn + ", verdi: " + verdi * antall);
            hentSaldo();
            hentPortefolje();
            console.log(OK);
        }
        else {
            // midlertidig

            console.log("Selg: Det har oppstått en feil")
        }
    })
}
