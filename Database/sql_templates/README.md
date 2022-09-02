# Mariadb:n asennus
Asensin mariadb:n  paikalliseen virtuaalikoneeseen, jossa on käyttöjärjestelmänä Debian 11.4. Asennus onnistui komennolla 
```bash
sudo apt-get install mariadb-server
```
- Server version:		10.5.15-MariaDB-0+deb11u1 Debian 11

Asennuksen jälkeen mariadb piti vielä käynnistää
```bash
sudo systemctl start mariadb.service
```
## Tuotantoasennuksessa huomioitava
Tuotantoon menevässä palvelimessa pitäisi myös ajaa komento, joka suorittaa turvallisuus scriptan, joka poistaa etämahdollisuuden rootilta ja tekee muita muutoksia.

```bash
sudo mysql_secure_installation
```

Itse en ajanut komentoa, koska virtuaalikone on vain omaan testailuun.

## Käyttö
Mariadb:n tulkin saa käyttöön terminaalissa komennolla

```bash
sudo mariadb
```

Käynnistyksen jälkeen tein vielä uuden tietokannan komennolla:
```bash
CREATE DATABASE siba;
USE siba;
```


## PhpMyAdmin
Tietokannan graafista hallintaa varten asensin phpmyadminin, joka vaatii myös apachen ja php:n, joten asensin ne ensin.
```bash
sudo apt-get install apache2 php php-mysql -y
```
Lopuksi asensin vielä phpmyadminin
```bash
sudo apt-get install phpmyadmin
```
- Kannattaa laittaa salasana ellei halua vaihtaa turvallisuus asetuksia
- Asennuksessa pitää valita palvelimeksi apache2 (HUOM! väri ei merkitse, että se on valittu vaan palvelin pitää valita välilyönnillä, jolloin laatikkoon ilmestyy *-merkki)
- Annoin asennuksen tehdä automaattiset asetukset

Lopuksi vaihdoin mariadb:n root käyttäjän salasanan, koska phpmyadmin ei hyväksy oletuksena tyhjää salasanaa (Tuotantopalvelimessa kannattaa tehdä kokonaan uusi käyttäjä)

Eli mariadb:n tulkissa komento:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'salasana';
```

Jonka jälkeen phpmyadmin pitäisi toimivan ja löytyy virtuaalikoneella osoitteesta http://localhost/phpmyadmin, palomuuri blokkaa kaiken ulkoisen liikenteen (jos asennettu) eli siihen ei pääse käsiksi muuten kuin suoraan virtuaalikoneella. Käyttäjänimi root ja salasana edellisessä komennossa valittu
