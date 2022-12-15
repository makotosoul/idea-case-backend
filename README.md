<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<h1 align="center">SIBA22S</h1>

<h3 align="center">
    Projekti luotu Softalaprojekti kurssilla <br />
<br />
</div>

## Tekijät

  <p>SIBA22S</p>
<!-- ABOUT THE PROJECT -->

## Projektista

Projekti on Haaga-Helian ja Sibelius akatemian yhteistyön pohjalta toteutettava sovellus, jonka tarkoituksena on mahdollistaa Sibelius akatemian opetustilojen ja varusteiden käytön laskenta, sekä optimointi eri opetuksille.

<p align="right">(<a href="#top">back to top</a>)</p>

### Teknologiat ja muut hyödylliset resurssit

- [Node](https://nodejs.org/en/)
- [Winston Logger](https://www.npmjs.com/package//winston)
- [Express-validator](https://www.npmjs.com/package/express-validator)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://www.npmjs.com/package/express)
- [Body-parser](https://www.npmjs.com/package/body-parser)
- [Cors](https://www.npmjs.com/package/cors)
- [Mysql](https://www.mysql.com/)
- [Nodemon](https://www.npmjs.com/package/nodemon)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Aloitus

Backend puolen asennusohjeet

### Asennus

1. Kloonaa repo
   ```sh
   git clone https://github.com/haagahelia/Siba_be.git
   ```
2. Asenna tarvittavat paketit

   ```sh
   npm install
   ```

3. Env. tiedoston lisäys. Lisää .env tiedosto repon juurihakemistoon

   ```
   BE_API_URL_PREFIX=/api
   BE_SERVER_PORT=3001
   DB_DRIVER_MODULE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=<<DB Käyttäjänimi>>
   DB_PASSWORD=<<DB salasana>>
   DB_DATABASE=casedb
   DB_DEBUG=true
   DB_MULTIPLE_STATEMENTS=true
   DB_CONNECTION_POOL_MIN=1
   DB_CONNECTION_POOL_MAX=7
   ```

4. Sovelluksen käynnistys

   ```sh
   nodemon
   ```

   HUOM! Jos ei käynnisty asenna:

   ```sh
   npm install -g nodemon
   ```

5. Huom! Seuraa [Frontend repon](https://github.com/haagahelia/siba-fe) asennusohjetta myös

<p align="right">(<a href="#top">back to top</a>)</p>
