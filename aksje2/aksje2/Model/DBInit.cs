using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace aksje2.Model
{
    public static class DBInit
    {
        public static void Initialize(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<AksjeDB>();

                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();

                Aksje aksje1 = new Aksje { navn = "TSLA", verdi = 40, omsetning = 10000 };
                Aksje aksje2 = new Aksje { navn = "APPL", verdi = 20, omsetning = 20000 };

                context.akjser.Add(aksje1);
                context.akjser.Add(aksje2);

                List<Kjop> liste = new List<Kjop>();


                Person nyPerson = new Person { fornavn = "Line", etternavn = "Hansen", saldo = 1000, kjop = liste};

                List<Kjop> kjopListePortefolje = new List<Kjop>();
                Portfolje nyPortfolje = new Portfolje();
                nyPortfolje.aksjer = kjopListePortefolje;

                nyPerson.portfolje = nyPortfolje;

                context.personer.Add(nyPerson);
                context.porteFoljer.Add(nyPortfolje);
                context.SaveChanges();
            }
        }
    }
}

