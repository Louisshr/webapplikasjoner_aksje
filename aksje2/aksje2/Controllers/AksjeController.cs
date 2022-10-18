using System;
using System.Collections.Generic;
using System.Linq;
using aksje2.Model;
using Microsoft.AspNetCore.Mvc;

namespace aksje2.Controllers
{
    [Route("[controller]/[action]")]
    public class AksjeController : ControllerBase
    {
        public readonly AksjeDB db;

        public AksjeController(AksjeDB aksjeDb)
        {
            db = aksjeDb;
        }

        

        public List<Aksje> hentAksjer()
        {
            try
            {
                List<Aksje> alleAksjer = db.akjser.ToList();
                return alleAksjer;
            }
            catch
            {
                return null;
            }
            
        }

        public Aksje hentEn(int id)
        {
            
            try
            {
                Aksje enAksje = db.akjser.Find(id);
                return enAksje;
            }
            catch
            {
                return null;
            }
        }

        public bool kjopAksje(Salg innSalg)
        {
            try
            {
                // finner først aksjen som handles, person som kjøper aksjen, og porteføljen til personen
                // Hvis en av disse feiler (returnerer null), returner funksjonen false. Som vil si at kjøpet avbrytes

                Aksje enAksje = db.akjser.Find(innSalg.aksje);
                Person enPerson = db.personer.Find(innSalg.person);
                Portfolje enPortefolje = db.porteFoljer.Find(enPerson.id);

                if (enAksje == null || enPerson == null || enPortefolje == null)
                {
                    return false;
                }

                // beregner total pris for handelen, og sjekker om personen har nok penger på konto for å betale for kjøpet

                var kjopPris = enAksje.verdi * innSalg.antall;

                if (enPerson.saldo < kjopPris)
                {
                    return false;
                }




                // oppretter nytt kjop

                Kjop nyttKjop = new Kjop();
                nyttKjop.person = enPerson;
                nyttKjop.aksje = enAksje;
                nyttKjop.antall = innSalg.antall;
                nyttKjop.pris = kjopPris;


                // oppretter en bool variabel, funnet
                // Denne holder styr på om aksjen som handles eksiterer i porteføljen til kunden eller ikke

                bool funnet = false;

                // går i igjennom porteføljen til kunden for å se om aksjen allerede finnes            

                foreach (Kjop i in enPortefolje.aksjer)
                {
                    if (i.aksje == enAksje)
                    {
                        i.pris += kjopPris;
                        i.antall += innSalg.antall;
                        funnet = true;
                    }
                }


                // aksjen ble ikke funnet i kundens portefølje
                if (!funnet)
                {
                    enPortefolje.aksjer.Add(nyttKjop);
                }

                enPerson.kjop.Add(nyttKjop);
                enPerson.saldo = enPerson.saldo - kjopPris;

                db.kjopt.Add(nyttKjop);
                db.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        // brukes ikke
        public List<Kjop> hentPortfolje()
        {
            try
            {
                Person enPerson = db.personer.Find(1);
                return null;
            }
            catch
            {
                return null;
            }
            
        }

        

        public int hentSaldo(int id)
        {
            try
            {
                Person enPerson = db.personer.Find(id);
                return enPerson == null ? -1 : enPerson.saldo;                
            }
            catch
            {
                return -1;
            }

            
        }

        public List<Kjop> hentPortefolje(int id)
        {
            try
            {
                Person enPerson = db.personer.Find(id);

                if (enPerson == null)
                {
                    return null;
                }

                Portfolje portefolje = enPerson.portfolje;
                return portefolje.aksjer;
            }
            catch
            {
                return null;
            }
        }

        public bool selg(Selg innSelg)
        {
            try
            {
                Person enPerson = db.personer.Find(innSelg.personId);
                Aksje enAksje = db.akjser.Find(innSelg.aksjeId);

                if (enPerson == null || enAksje == null)
                {
                    // person ble ikke funnet eller aksje ble ikke funnet, kjøp avbrytes
                    return false;
                }

                List<Kjop> aksjer_til_kunde = enPerson.portfolje.aksjer;


                foreach (Kjop kjop in aksjer_til_kunde)
                {
                    if (kjop.aksje.id == enAksje.id)
                    {
                        if (kjop.antall >= innSelg.antall)
                        {
                            var salg_pris = enAksje.verdi * innSelg.antall;

                            Console.WriteLine("TOTALT PRIS: " + salg_pris);
                            kjop.antall = kjop.antall - innSelg.antall;
                            kjop.pris = kjop.pris - salg_pris;
                            enPerson.saldo = enPerson.saldo + salg_pris;

                            if (kjop.antall == 0)
                            {
                                aksjer_til_kunde.Remove(kjop);
                            }

                            Console.WriteLine("Antall elementer i liste: " + aksjer_til_kunde.Count);
                            db.SaveChanges();
                            return true;
                        }
                        else
                        {
                            // kunden har ikke så mange aksjer som det kunden forsøker å selge
                            return false;
                        }
                    }
                }

                // Kunden har ikke den aksjen han prøver å selge
                return false;
            }
            catch
            {
                return false;
            }
            
        }

        public bool sjekk(int id)
        {
            if (id == 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }       
    }
}

/*
public bool kjopAksje(Salg innSalg)
{

    Kjop nyttKjop = new Kjop();
    nyttKjop.antall = innSalg.antall;
    nyttKjop.pris = innSalg.pris;

    Aksje enAksje = db.akjser.Find(innSalg.aksje);
    Person enPerson = db.personer.Find(innSalg.person);
    Portfolje enPortefolje = db.porteFoljer.Find(enPerson.id);

    if (enAksje == null || enPerson == null)
    {
        return false;
    }

    enPerson.saldo = enPerson.saldo - innSalg.pris;  // denne skal fjernes. vi skal først sjekke om det er nok penger på kontoen til brukeren. 

    nyttKjop.person = enPerson;
    nyttKjop.aksje = enAksje;

    bool funnet = false;

    foreach (Kjop i in enPortefolje.aksjer)
    {
        if (i.aksje == enAksje)
        {
            i.pris += innSalg.pris;
            i.antall += innSalg.antall;

            funnet = true;
        }
    }

    if (!funnet)
    {
        enPortefolje.aksjer.Add(nyttKjop);
    }

    enPerson.kjop.Add(nyttKjop);

    db.kjopt.Add(nyttKjop);
    db.SaveChanges();
    return true;
}
*/