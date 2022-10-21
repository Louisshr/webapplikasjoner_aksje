let personId = 1;
localStorage.setItem('data', personId);

$(function () {
    hentAlleAksjer();
})

function hentAlleAksjer() {
    $.get("aksje/hentAksjer", function (aksjer) {
        if (aksjer != null) {
            formaterAksjer(aksjer);
        }
        else {
            // midlertidig

            console.log("Ikke mulig å hente aksjer");
        }
    });

}



function formaterAksjer(aksjer) {
    let ut = "<table class='table table-sm'>" + "<thead class='thead-light'>" + "<tr>" +
        "<th scope='col'>Navn</th>" +
        "<th style='width: 200px' scope='col'>Lav</th>" +
        "<th style='width: 200px' scope='col'>Høy</th>" +
        "<th style='width: 200px' scope='col'>Åpning</th>" +
        "<th style='width: 200px' scope='col'>Kjøp</th>" +
        "<th style='width: 200px' scope='col'>Omsetning</th>" +
        "<th style='width: 200px' scope='col'></th>" +
        "</thead>" +
        "<tbody>";


    for (let aksje of aksjer) {
        ut += "<tr>" +
            "<th scope='row'>" + aksje.navn + "</th>" +
            "<td>" + aksje.low + "</td>" +
            "<td>" + aksje.high + "</td>" +
            "<td>" + aksje.open + "</td>" +
            "<td>" + aksje.verdi + "</td>" +
            "<td>" + aksje.omsetning + "</td>" +
            "<td> <button type='button' class='btn btn-success' data-toggle='modal' data-target='#kjop_popupBox' onclick='kjop(" + aksje.id + ")'>Kjøp</button></td>"
        "</tr>";
    }

    ut += "</table>";

    document.querySelector(".aksje-oversikt").innerHTML = ut;
}

function kjop(id) {
    const url = "aksje/hentEn?id=" + id;

    $.get(url, function (aksje) {
        if (aksje !== null) {
            //informasjon skal kun opprettes hvis get kallet er suksessfullt (skal være en if setning)
            //kan hende at bestilling navn og kurs bør defineres utenfor en funksjon slik at man ikke trenger å hente de hver gang

            document.getElementById("popupBox").innerHTML = "Kjøp " + "(" + aksje.navn + ")";
            document.getElementById("kjop-knapp").onclick = function () { fullforKjop(aksje.id, aksje.verdi, aksje.navn); }
        }
        else {
            console.log("Kjop: Ikke mulig å hente aksje")
        }

    });

}


function fullforKjop(id, verdi, aksje) {

    let antall_input = document.getElementById("typeNumber").value;
    let antall = Number(antall_input);
    let melding_ut = document.getElementById("melding_ut");

    // mulig å endre slik at det vises forskjellig feilmelding avhengig av om input er bokstaver eller om input feltet er tomt.

    if (isNaN(antall) || antall_input == '') {
        document.getElementById("bestilling-feil").innerHTML = "Venligst oppgi et gyldig antall";
    }
    else {
        let total_pris = verdi * antall;

        let salgObjekt =
        {
            person: personId,
            antall: antall,
            pris: total_pris,
            aksje: id
        }
        $.post("aksje/kjopAksje", salgObjekt, function (OK) {
            let ut = "";

            if (OK) {
                ut = "Kjøp er gjennomført. Du handlet " + antall + " " + aksje + " aksjer. ";
            }
            else {
                ut = "Det oppstod en feil under kjøpet. Kjøpet er avbrutt";
            }

            console.log(ut);


        })


    }

}