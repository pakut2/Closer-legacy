const stopInput = document.querySelector(".stop-input");
const submitButton = document.querySelector(".submit-button");

function autocomplete(input, array) {
  let currentFocus;
  input.addEventListener("input", function (e) {
    let list,
      line,
      i,
      val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    list = document.createElement("DIV");
    list.setAttribute("id", this.id + "autocomplete-list");
    list.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(list);
    for (i = 0; i < array.length; i++) {
      if (
        latinize(array[i].substr(0, val.length).toUpperCase()) ==
        latinize(val.toUpperCase())
      ) {
        line = document.createElement("DIV");
        line.innerHTML =
          "<strong>" + array[i].substr(0, val.length) + "</strong>";
        line.innerHTML += array[i].substr(val.length);
        line.innerHTML += "<input type='hidden' value='" + array[i] + "'>";
        line.addEventListener("click", function (e) {
          input.value = this.getElementsByTagName("input")[0].value;
          submitButton.click();
          closeAllLists();
        });
        list.appendChild(line);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  input.addEventListener("keydown", function (e) {
    let listIndex = document.getElementById(this.id + "autocomplete-list");
    if (listIndex) listIndex = listIndex.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(listIndex);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(listIndex);
    } else if (e.keyCode == 13) {
      if (currentFocus > -1) {
        if (listIndex) listIndex[currentFocus].click();
      }
    }
  });

  /*a function to classify an item as "active":*/
  function addActive(listIndex) {
    if (!listIndex) return false;
    removeActive(listIndex);
    if (currentFocus >= listIndex.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = listIndex.length - 1;
    listIndex[currentFocus].classList.add("autocomplete-active");
  }

  /*a function to remove the "active" class from all autocomplete items:*/
  function removeActive(listIndex) {
    for (let i = 0; i < listIndex.length; i++) {
      listIndex[i].classList.remove("autocomplete-active");
    }
  }

  /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
  function closeAllLists(element) {
    let items = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < items.length; i++) {
      if (element != items[i] && element != input) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

const busStops = [
  "Abrahama",
  "Agrarna",
  "Akademia Muzyczna",
  "Aksamitna",
  "AmberExpo",
  "Andruszkiewicza",
  "Archikatedra Oliwska",
  "Astronautów",
  "Bajana",
  "Bajki",
  "Barniewicka",
  "Bartnicza",
  "Baza Manipulacyjna",
  "Baśniowa",
  "Bażyńskiego",
  "Belgradzka",
  "Bema",
  "Beniowskiego",
  "Benzynowa",
  "Biała",
  "Biały Dwór",
  "Biblioteka Główna UG",
  "Biwakowa",
  "Bluszczowa",
  "Bobrowa",
  "Boguckiego",
  "Bora Komorowskiego",
  "Borska",
  "Botaniczna",
  "Brama Nizinna",
  "Brama Oliwska",
  "Brama Oruńska",
  "Brama Wyżynna",
  "Brama Żuławska",
  "Bratki",
  "Brodnicka",
  "Brzeźno",
  "Brętowo PKM",
  "Budapesztańska",
  "Budzysza",
  "Bursztynowa",
  "Bysewo",
  "Błonia",
  "Cebertowicza",
  "Centrostal",
  "Centrum Medycyny Inwazyjnej",
  "Charpentiera",
  "Chałubińskiego",
  "Chełm - Więckowskiego",
  "Chełm Cienista",
  "Chełm Witosa",
  "Chmielna",
  "Chodowieckiego",
  "Chrobrego",
  "Chłopska",
  "Ciasna",
  "Cieszyńskiego",
  "Ciołkowskiego",
  "Cmentarna",
  "Cmentarz Oliwski",
  "Cmentarz Srebrzysko",
  "Cmentarz Łostowicki",
  "Cystersów",
  "Czarny Dwór",
  "Czermińskiego",
  "Czerwony Dwór",
  "Czyżewskiego",
  "Damroki",
  "De Plelo",
  "Derdowskiego",
  "Dickensa",
  "Dobra",
  "Dobrowolskiego",
  "Dolna",
  "Dolne Młyny",
  "Dom Pomocy Społecznej",
  "Domeyki",
  "Dragana - Kładka",
  "Dragana - Szkoła",
  "Droszyńskiego",
  "Drwęcka (n/ż)",
  "Drzewieckiego",
  "Dulkowa",
  "Dworkowa",
  "Dworzec Główny",
  "Dworzec PKS",
  "Dwór Ferberów",
  "Dywizjonu 303",
  "Dębinki",
  "Elfów",
  "Emaus",
  "Fabryczna",
  "Falista",
  "Falowa",
  "Firoga",
  "Focha",
  "Forsycji",
  "Galaktyczna",
  "Galeria Bałtycka",
  "Gdańska",
  "Geodetów",
  "Gospody",
  "Gostyńska Szpital",
  "Gościnna",
  "Grabowskiego",
  "Gronostajowa",
  "Grudziądzka",
  "Grzybowa",
  "Góralska",
  "Górecka",
  "Górki Wschodnie",
  "Górki Zachodnie",
  "Górskiego",
  "Gęsia",
  "Głucha",
  "Głęboka",
  'Hala "Olivia"',
  "Harfowa",
  "Helska",
  "Hevelianum",
  "Hokejowa",
  "Hucisko",
  "Hynka",
  "Ikara",
  "Inżynierska",
  "Iławska",
  "Jabłoniowa Osiedle",
  "Jagiellońska",
  "Jagiełły",
  "Jana Pawła II",
  "Jana z Kolna",
  "Jarowa",
  "Jasia i Małgosi",
  "Jasień Działki",
  "Jasień PKM",
  "Jasień Pólnicy",
  "Jasieńska",
  "Jaworowa",
  "Jaworzniaków",
  "Jaśkowa Dolina",
  "Jednorożca",
  "Jeleniogórska",
  "Jelitkowo Kapliczna",
  "Jeziorowa",
  "Jodowa",
  "Kaczeńce",
  "Kaczeńce - Sienna",
  "Kamienna Grobla",
  "Kampinoska",
  "Kanałowa",
  "Karczemki",
  "Karczemki Szkoła",
  "Karskiego",
  "Kartuska",
  "Karwieńska",
  "Kasztanowa",
  "Kempingowa",
  "Keplera",
  "Kielecka",
  "Kiełpinek",
  "Kiełpinek PKM",
  "Kiełpino - Szkoła",
  "Kiełpino Górne",
  "Kilińskiego",
  "Kliniczna",
  "Klonowa",
  "Klonowicza",
  "Knyszyńska",
  "Kokoszki - Poczta",
  "Kolonia Mysia",
  "Kolonia Uroda",
  "Kolorowa",
  "Kolumba",
  "Komary",
  "Konkordii",
  "Kontenerowa",
  "Kopalniana",
  "Kopeckiego",
  "Korczaka",
  "Kosmonautów",
  "Koziorożca",
  "Kołobrzeska",
  "Kościuszki",
  "Krasickiego",
  "Krynicka",
  "Krzemowa",
  "Królewskie Wzgórze",
  "Kręta",
  "Ku Ujściu",
  "Kujawska",
  "Kukawka",
  "Kurpińskiego",
  "Kwiatowa",
  "Kępna",
  "Kłosowa",
  "Latarnia Morska",
  "Lawendowe Wzgórze",
  "Lazurowa",
  "Legionów",
  "Lenartowicza",
  "Lessowa",
  "Leszczynowa",
  "Leszczyńskich",
  "Leśna Góra",
  "Leśna Góra - Przychodnia",
  "Leźnieńska",
  "Liliowa",
  "Lipowa",
  "Lipuska",
  "Lubowidzka",
  "Lwowska",
  "Maciejkowa",
  "Maki",
  "Marsa",
  "Marynarki Polskiej",
  "Marynarska",
  "Matarnia PKM",
  "Matemblewo",
  "Mazurska",
  "Maćkowy",
  "Małomiejska",
  "Meczet",
  "Meissnera",
  "Meteorytowa",
  "Miałki Szlak",
  "Michałki",
  "Mickiewicza",
  "Miedza",
  "Migowo",
  "Miszewskiego",
  "Mjr Hubala",
  "Modra I",
  "Modra II",
  "Modra III",
  "Modra IV",
  "Montażystów",
  "Mostek",
  "Mostostal",
  "Mostowa",
  "Muzeum II Wojny Światowej",
  "Muzeum Narodowe",
  "Myśliborska",
  "Myśliwska",
  "Na Wzgórzu",
  "Na Zaspę",
  "Nabrzeże Przemysłowe",
  "Nad Jarem",
  "Nad Stawem",
  "Nadwiślańska",
  "Nadwodna",
  "Naftowa",
  "Niedziałkowskiego",
  "Niedźwiednik",
  "Niegowska",
  "Niepołomicka",
  "Norblina",
  "Nowa",
  "Nowa Gdańska",
  "Nowatorów",
  "Nowiny",
  "Nowolipie",
  "Nowy Port Góreckiego",
  "Nowy Port Oliwska",
  "Nowy Port Szaniec Zachodni",
  "Nowy Port Zajezdnia",
  "Nowy Świat",
  "Obrońców Westerplatte",
  "Obrońców Wybrzeża",
  "Oczyszczalnia",
  "Odrzańska",
  "Ogrodowa",
  'Ogrody Działkowe "Rębiechowo" I',
  'Ogrody Działkowe "Rębiechowo" II',
  'Ogrody Działkowe "Rębiechowo" III',
  "Okopowa",
  "Olimpijska",
  "Oliwa",
  "Oliwa PKP",
  "Oliwa ZOO",
  "Olsztyńska",
  "Olszynka - Niwki",
  "Olszyńska",
  "Opacka",
  "Opera Bałtycka",
  "Opolska",
  "Oriona",
  "Orlinki",
  "Ornitologów",
  "Orunia Górna",
  "Osiedle Barniewice",
  "Osiedle Jary",
  "Osiedle Wejhera",
  "Osiedle Świętokrzyskie",
  "Osowa Obwodnica",
  "Osowa PKP",
  "Osowa Przesypownia",
  "Ostroroga",
  "Ostróżek",
  "Otomińska",
  "Otwarta",
  "Owczarnia",
  "PCK",
  "Pagórkowa",
  "Park Naukowo - Technologiczny",
  "Park Reagana",
  "Paska",
  "Pastelowa",
  "Piastowska",
  "Piecewska",
  "Piekarnicza",
  "Pilotów",
  "Piotrkowska",
  "Plac Komorowskiego",
  "Plac Solidarności",
  "Plac Wolności",
  "Platynowa",
  "Podkarpacka",
  "Pohulanka",
  "Pole Namiotowe",
  "Politechnika",
  "Politechnika SKM",
  "Pomorska",
  "Pomorska - Osiedle",
  "Pomorskie Szkoły Rzemiosł",
  "Port Lotniczy",
  "Porębskiego",
  "Potokowa",
  "Potokowa - Matemblewska",
  "Powstańców Warszawskich",
  "Poznańska",
  "Przebiśniegowa",
  "Przegalina",
  "Przegalińska",
  "Przegalińska - Schronisko",
  "Przejazd Kolejowy",
  "Przemian",
  "Przemyska",
  "Przeróbka",
  "Przetoczna",
  "Przychodnia",
  "Przymorze SKM",
  "Przymorze Wielkie",
  "Przyrodników",
  "Przystań",
  "Przystań Żeglugi",
  "Przytulna",
  "Przywidzka",
  "Ptasia",
  "Pólnicy",
  "Płocka",
  "Płowce",
  "Płońska",
  "Radarowa",
  "Radiowa",
  "Radunica",
  "Rafineria",
  "Rakietowa",
  "Reformacka",
  "Reja",
  "Rejenta",
  "Reymonta",
  "Rogalińska",
  "Rozłogi",
  "Rybacka",
  "Rybaki Górne",
  "Rynarzewo",
  "Rzeczypospolitej",
  "Rzeźnicka",
  "Równa",
  "Rębowo",
  'SDO "Złota Jesień"',
  "Sandomierska",
  "Sarnia",
  "Saturna",
  'Schronisko dla zwierząt "Promyk"',
  "Schuberta",
  "Schumana",
  "Siedlce",
  "Siedleckiego",
  "Siedlicka",
  "Siennicka",
  "Sierpowa",
  "Sikorskiego",
  "Skarżyńskiego",
  "Skrajna",
  "Smoluchowskiego",
  "Smęgorzyno",
  "Sobieszewko",
  "Sobieszewko Ośrodek",
  "Sobieszewo",
  "Sobieszewska",
  "Sobieszewska Pastwa 1",
  "Sobieszewska Pastwa 2",
  "Sobótki",
  "Soplicy",
  "Sopocka",
  "Sołdka",
  "Spadochroniarzy",
  "Srebrna",
  "Stadion Energa Gdańsk",
  "Stare Szkoty",
  "Starogardzka",
  "Startowa",
  "Staw Wróbla",
  "Steczka",
  "Sternicza",
  "Stocznia Północna",
  "Stocznia SKM",
  "Stogi Plaża",
  "Stokrotki",
  "Stolema",
  "Strzelnica",
  "Strzyża PKM",
  "Stężycka",
  "Subisława",
  "Suchanino",
  "Sucharskiego",
  "Sucharskiego - PKP",
  "Swojska",
  "Szadółki",
  "Szadółki Obwodnica",
  "Szczęśliwa",
  "Szkoła Podstawowa nr 6",
  "Szmaragdowa",
  "Szpital Marynarki Wojennej",
  "Szpital Zakaźny",
  "Sztutowska",
  "Szybowcowa",
  "Sówki",
  "Sąsiedzka",
  "Słowackiego Działki",
  "Tarcice",
  "Telewizyjna",
  "Terminal - Cargo",
  "Terminal DCT",
  "Tetmajera",
  "Topazowa",
  "Toruńska",
  "Transportowców",
  "Traugutta",
  "Trawki",
  "Trałowa - Szkoła",
  "Turystyczna",
  "Twarda",
  "Twierdza Wisłoujście",
  "Tysiąclecia",
  "Tęczowa",
  "Uczniowska",
  "Ujeścisko",
  "Ukośna",
  "Unimor",
  "Uniwersytet Gdański",
  "Uniwersytet Medyczny",
  "Uphagena",
  "Uranowa",
  "Urząd Dozoru Technicznego",
  "Urząd Miejski",
  "Uzdrowiskowa",
  "Wagnera",
  "Warneńska",
  "Wały Piastowskie ",
  "Wczasy",
  "Westerplatte",
  "Wieniecka",
  "Wieżycka",
  "Wilanowska",
  "Wileńska",
  "Wodnika",
  "Wojska Polskiego",
  "Worcella",
  "Wołkowyska",
  "Wronki",
  "Wrzeszcz PKP",
  "Wróbla",
  "Wyczółkowskiego",
  "Wyspiańskiego",
  "Wyzwolenia",
  "Węgorzowa",
  "Węzeł Elbląska",
  "Węzeł Groddecka",
  "Węzeł Harfa",
  "Węzeł Karczemki",
  "Węzeł Kliniczna",
  "Władysława IV",
  "Zabornia",
  "Zabytkowa",
  "Zacna",
  "Zagony",
  "Zagroble",
  "Zajezdnia",
  "Zakoniczyn",
  "Zakopiańska",
  "Zakład Utylizacyjny",
  "Zamenhofa",
  "Zaspa",
  "Zaspa - Szpital",
  "Zaspa SKM",
  "Zawodzie",
  "Zespół Szkół Morskich",
  "Zeusa",
  "Zielony Stok",
  "Zimna",
  "Zosi",
  "Zwierzyniecka",
  "Złota Karczma",
  "al. Płażyńskiego",
  "Łabędzia",
  "Łagiewniki",
  "Łanowa I",
  "Łanowa II",
  "Łanowa III",
  "Łanowa IV",
  "Łapińska",
  "Łostowice Świętokrzyska",
  "Łowicka",
  "Łódzka",
  "Łęczycka",
  "Śnieżna",
  "Śródmieście SKM",
  "Św. Brata Alberta",
  "Św. Wojciech",
  "Świbnieńska I",
  "Świbnieńska II",
  "Świbnieńska III",
  "Świętokrzyska",
  "Źródlana",
  "Żabi Kruk",
  "Żabianka SKM",
  "Żaglowa - AmberExpo",
  "Żwirki i Wigury",
  "Życzliwa",
];

autocomplete(stopInput, busStops);