# Allokointi

Allokointi on prosessi, jossa opetukset jaetaan tiloihin määrättyjen kriteereiden mukaisesti, joka helpottaa käyttäjää suunnittelemaan tilankäyttöä ja käyttämään tiloja tehokkaammin.

Nykyisessä versiossa on kolme eri vaihetta:
1. Opetuksien priorisointi
- Opetuksien käsittely yksitellen, prioriteetin mukaisessa järjestyksessä:
    - 2.Opetukselle etsitään käyttöön sopivat tilat 
    - 3.Opetus sijoitetaan tiloihin.

---

## startAllocation proceduuri
Proceduuria kutsutaan kun halutaan aloittaa laskenta.
### Tarkastukset
- Proceduurissa on toimivuuden varmistukseksi useita tarkistuksia:
    - Allokointia ei voi käynnistää tai resetoida, jos laskenta on käynnissä samalla allocRound id:llä.
    - Allokointia ei voi käynnistää uudestaan, resetoimatta sitä ensin eli tyhjentämällä edeltävän allokoinnin tuloksia.

### Tärkeää tietää
- Kaikki allokoinnin vaiheet kutsutaan tässä proceduurissa.

---

## prioritizeSubjects
### Toiminnallisuus
Lisää allocSubject tauluun opetuksille priorisointinumerot. Allokoinnin seuraavissa vaiheissa käsitellään opetukset priorisointinumeron mukaisessa järjestyksessä.
- Proceduurissa on tällä hetkellä priorisoinnissa kolme eri vaihtoehtoa, jotka kutsutaan startAllocation proceduurin alussa.

### Tärkeää
- Priorisointiasetukset eivät ole valmiita ja ne kannattaa joko sopia tarkemmin asiakkaan kanssa tai katsoa alapuolella oleva kehitysehdotus, jolloin asiakas voi luoda ne itse.

### Priorisointiin sopivia sarakkeita
- Equipment.priority (ei suositeltava)
    - Varusteen prioteettinumeroa käytetään opetustilan varusteen vakioarvona, jonka takia SubjectEquipment.priority on suositeltu vaihtoehto.
- Subject.groupSize
    - Opetuksen opiskelijoiden määrä, voidaan käyttää kun halutaan allokoida isommat tai pienemmät ryhmät ensin.
    - Suositeltu vaihtoehto: pienemmät ensin, jotta resursseja ei mene hukkaan
- Subject.area
    - Opetuksen tarvittava tilankoko, voidaan käyttää kun halutaan allokoida isommat tai pienemmät tilat ensin.
    - Suositeltu vaihtoehto: pienemmät ensin, jotta resursseja ei mene hukkaan
- Subject.spaceType
    - Tarvittava tilatyyppi (esim. musiikkiluokka, luentoluokka)
    - Nykyisessä versiossa ei järjestyksellä ei ole väliä, mutta tulevassa versiossa ehkä opetuksen voi sijoittaa useampaan tilatyyppiin, jolloin suositeltu vaihtoehto on sijoittaa kaikki opetukset ensin, joiden ensisijainen vaihtoehto ei ole luentoluokka.
- Subject.program (ei suositeltu)
    - Opetuksien pääaine
    - Vaikea laittaa eriarvoiseen järjestykseen
- Subject.department (ei suositeltu)
    - Opetuksien aineryhmä
    - Vaikea laittaa eriarvoiseen järjestykseen
- departmentplanner (ei suositeltu)
    - Aineryhmän suunnittelija
    - Vaikea laittaa eriarvoiseen järjestykseen
- Equipment.isMovable
    - Onko opetuksessa varusteita, joita ei voi siirrellä.
- SubjectEquipment.priority (suositeltu)
    - Opetukseen lisättyjen varusteiden arvonumero
    - *Tärkein kriteeri allokoinissa*
    - allokointikriteerinä voi olla esim. että kaikki opetukset joissa on varusteita yli x-arvolla halutaan käsitellä ensin.
- SubjectEquipment.obligatory
    - Onko varuste opetukselle pakollinen
    - Ei nykyisessä versiossa käytössä, koska kaikki varusteet ovat opetukselle pakollisia.

### Kehitysehdotus
- Priorisoinnin voisi rakentaa uusiksi, niin että eri kriteerejä/priorisointi-asetuksia voisi rakentaa omaan tauluun, jolloin pääkäyttäjä voisi valita tai luoda frontin kautta haluamat priorisointijärjestykset ja kriteerit. Tarkemmin sanottuna frontissa olisi näkymä, jonka kautta voisi valita ylläolevista sarakkeista haluttavia ominaisuuksia ja lisätä niiden arvot.
    - Esimerkiksi voisi tehdä asetuksen: SubjectEquipment.priority > 500 AND Subject.spaceType = "musiikkiluokka".
    - Proceduurissa taas ajettaisiin kaikki allocRoundiin sisältyvät priorisointiasetukset loopilla läpi, pääkäyttäjän valitsemassa järjestyksessä.

---

## allocateSpace
Opetus sijoitetaan sopiviin tiloihin tai merkitään, ettei sitä voi allokoida.
- Jos opetukselle ei löydy sopivia tiloja, merkitään allocSubject-tauluun ettei sitä voi allokoida.
- Jos opetukselle on tiloja, pyritään sijoittamaan opetukset niin, että tila olisi mahdollisen lähellä opetuksen kriteerejä.

### Toiminnallisuus
- Opetus pyritään laittamaan ensin sellaisiin tiloihin, joissa on tarpeeksi vapaata tilaa kaikille opetuksen tunneille. Jos sellaista tilaa ei löydy, niin mahdollisen monta opetuksen tuntia pyritään laittamaan samaan tilaan.
- Opetus merkitään aina sellaiseen sopivaan tilaan, jossa on pienin maksimihenkilömäärä tilassa.
- Tilassa pitää olla opetukselle sopiva maksimi henkilömäärä, neliömetrit, tilatyyppi, varusteita ei saa puuttua ja tilan pitää olla käytössä.
- Jos sellaista tilaa ei löydy, jossa olisi vapaata aikaa, lisätään kaikki opetukset sellaiseen tilaan, jossa on vähiten tunteja varattuna.
- Jos vain osalle tunneista löytyy vapaata aikaa sopivista tiloista, lisätään loputkin samaan tilaan kuin muut.
- Jos opetukselle ei löydy sopivia tiloja, merkitään ettei sitä voi allokoida

---

## resetAllocation
### Toiminnallisuus
Proceduurissa resetoidaan allokointi eli poistetaan laskennan tulokset ja muutetaan tarvittavat arvot takaisin oletustilaan.

---

## setSuitableRooms
### Toiminnallisuus 
- Merkitsee allocSubjectSuitableSpace-tauluun kaikki tilat, joissa on opetukselle sopivat neliömetrit, henkilömäärät, tilantyyppi ja tilan pitää olla käytössä
- Tauluun merkitään montako varustetta tilasta puuttuu ja tila luokitellaan sopivaksi, vaikka nykyisessä versiossa opetuksia ei sijoiteta tiloihin, joista puuttuu varusteita. Tämän takia huoneen sopivuus tarkistetaan myös kun opetus sijoitetaan tilaan.

---

## abortAllocation
### Toiminnallisuus

Proceduuria käytetään kun halutaan pysäyttää allokointi ennen kuin se on valmis.

### Tärkeää
- Front endin puolelle pitää lisätä nappi, rest endpoint on jo luotuna ja löytyy osoitteesta /api/allocation/abort 

---