# Tietokantataulujen kuvaukset

<details><summary>AllocCurrentRoundUser</summary>

***Ei ainakaan vielä käytössä**

|Sarake			|	Tyyppi		|	Avaimet 	|	Kuvaus					
|:-----			| :------- 		| 	------- 	|	------ 					
|<u>allocId</u>	| INTEGER		| PK 			| 			
|<u>UserId</u>	| INTEGER		| PK, FK   		| Viittaus User taulun Id	

</details>

<details><summary>AllocRound</summary>
<small> (Laskenta tietylle kaudelle. Esimerkiksi kesä 2022 kurssit) </small>

Sarake			|	Tyyppi		|	Avaimet		|	Kuvaus
:-----			|	:---		|	-------		|	------
 <u>id</u>		| INTEGER		| PK			| Yksilöivä pääavain
 date			| TIMESTAMP 	|				| Laskennan luontiaika
 name			| VARCHAR(255)	|				| Laskennan nimi. eg. "Syksyn 2022 virallinen"			
 isSeasonAlloc	| BOOLEAN 		|				| Onko kausi aktiviinen
 userId			| INTEGER		| FK(User.id)	| Laskennan luoja/ylläpitäjä
 description 	| VARCHAR(16000)|				| Mahdollinen kuvaus laskentaa varten
 lastModified 	| TIMESTAMP 	|				| Viimeinen muokkaus laskennassa, automaattisesti luotu aika

</details>

<details><summary>AllocSpace</summary>
<small> (Tilanvaraukset laskennassa) </small>

 Sarake			|	Tyyppi		|	Avaimet			            	|	Kuvaus
 :-----			|	:----		|	------			            	|	------
 allocSubjectId | INTEGER		| PK, FK(allocSubject.subjectId)	| Opetus
 allocRound     | INTEGER		| PK, FK(allocSubject.allocRound)	| Laskenta esim. Syksy 2022
 spaceId 		| INTEGER		| PK, FK(space.id)	            	| Varattu tila
 sessionAmount	| INTEGER		| 					            	| Tilassa tapahtuvien opetuskertojen määrä
 totalTime		| TIME			|					            	| Opetusta varten varattu aika tilassa

</details>

<details><summary>AllocSubject</summary>
<small> (Opetukset laskentaa varten) </small>

Sarake			    |	Tyyppi		|	Avaimet		    |	Kuvaus
:-----			    |	:----		|	------		    |	------
<u>subjectId</u>    | INTEGER		|PK,FK(subject.id)  | Laskentaan lisätty opetus
<u>allocRound</u>   | INTEGER		|PK,FK(allocRound)  | Laskentatoteutus esim. Kevät 2022
isAllocated 	    | BOOLEAN		|				    | Onko kurssitoteutus jo lisätty laskentaan/allocSpace tauluun (0/1)
cantAllocate 	    | BOOLEAN		|				    | Merkitään True(1) kun kurssille ei löydy sopivia tiloja
priority		    | INTEGER		|				    | Opetuksien prioriteetti (arvoasteikko) - Missä järjestyksessä opetukset lisätään allocSpace-tauluun
allocatedDate 	    | DATE			|				    | Päivämäärä, jolloin opetus on lisätty laskentaan

</details>

<details><summary>Building</summary>
<small> (Rakennus) </small>

Sarake			|	Tyyppi		|	Avaimet		|	Kuvaus
:-----			|	:----		|	------		|	------
<u>id</u>		| INTEGER		| PK			| 
name			| VARCHAR(255)	|				| Rakennuksen nimi / Tunnus (Esim. N-Talo)
description		| VARCHAR(16000)|				| Rakennuksen vapaaehtoinen kuvaus
campusId		| INTEGER		| FK(Campus.id)	| Viittaus Campus-tauluun **Ehkä poistetaan**

</details>

<details><summary>Campus</summary>
<small> (Kampus) </small>

Sarake			|	Tyyppi		|	Avaimet		|	Kuvaus
:-----			|	:----		|	------		|	------
<u>id</u>		| INTEGER		| PK			|
name			| VARCHAR(255)	|				| Kampuksen nimi (Esim. Sibelius Akatemia)
description		| VARCHAR(16000)|				| Vapaaehtoinen kuvaus

</details>

<details><summary>Department</summary>
Rakennus

Sarake			|	Tyyppi		|	Avaimet		|	Kuvaus
:-----			|	:----		|	------		|	------
<u>id</u>		| INTEGER		| PK			|
name			| VARCHAR(255)	|				| Aineryhmän nimi (esim. Jazz)
description		| VARCHAR(16000)|				| Aineryhmän kuvaus

</details>

<details><summary>DepartmentPlanner</summary>
<small> (aineryhmän suunnittelija) </small>

Sarake				|	Tyyppi		|	Avaimet				|	Kuvaus
:-----				|	:----		|	------				|	------
<u>departmentId</u> | INTEGER		| PK, FK(deparment.id)	| Suunnittelijalla oikeudet aineryhmän opetusten lisäykselle ja muokkaukselle.
<u>userId</u>		| INTEGER		| PK, FK(user.id)		| Suunnittelijan käyttäjätunnus

</details>

<details><summary>Equipment</summary>
<small> (Varustelista, josta lisätään yksittäisiä varusteita/soittimia tiloihin ja opetuksiin) </small>

Sarake			|	Tyyppi		|	Avaimet		|	Kuvaus
:-----			|	:----		|	------		|	------
<u>id</u>		| INTEGER		| PK			|
name			| VARCHAR(255)	| 				| Soittimen/varusteen nimi
isMovable		| BOOLEAN		| 				| Onko varuste siirreltävissä. Esim. Urut ei tod.näk ole
Priority		| INTEGER		|				| IN PROGRESS
description		| VARCHAR(16000)|

</details>

<details><summary>GlobalSettings</summary>
<small> (Yleiset asetukset järjestelmässä. Ehkä lisätään AllocSettings-taulu laskentaa varten erikseen) </small>

Sarake			|	Tyyppi		|	Avaimet		|	Kuvaus
:-----			|	:----		|	------		|	------
<u>id</u>		| INTEGER		| PK			|
name			| VARCHAR(255)	| 				| Asetukselle nimi
description		| VARCHAR(16000)|				| Kuvaus asetusta varten
numberValue		| INTEGER		| 				| Asetukseen kokonaisluku arvona
textValue		| VARCHAR(255)	|				| Asetukseen kiinteä tekstiarvo

</details>

<details><summary>Program</summary>
<small> (Pääaine) </small>

Sarake			|	Tyyppi		|	Avaimet			|	Kuvaus
:-----			|	:----		|	------			|	------
<u>id</u>		| INTEGER		| PK				|
name			| VARCHAR(255)	|					| Pääaineen nimi
departmentId	| INTEGER		| FK(department.id)	| Mihin aineryhmään pääaine sisältyy

</details>

<details><summary>Space</summary>
<small> (Tila - huone, studio, luokka jne.) </small>

Sarake			|	Tyyppi		|	Avaimet			|	Kuvaus
:-----			|	:----		|	------			|	------
<u>id</u>		| INTEGER		|PK					|
name			| VARCHAR(255)	|					| Nimi (Esim. R-5322 Musiikkiluokka)
area			| DECIMAL(5,1)	|					| Tilan tilavuus (neliömetreissä/m²)
info			| VARCHAR(16000)|					| Tilan lisätietoja / Kuvaus
people_capasity	| INTEGER		|					| Tilan maksimi henkilömäärä
buildingId		| INTEGER		|FK(building.id)	| Missä rakennuksessa tila sijaitsee
availableFrom	| TIME			|					| Aika, mistä lähtien tila on käytettävissä
availableTo		| TIME			|					| Aika, mihin asti tila on käytettävissä
classesFrom		| TIME			|					| Aika, mistä lähtien tila on käytettävissä opetusta varten
classesTo		| TIME			|					| Aika, mihin asti tila on käytettävissä opetusta varten
inUse			| BOOLEAN		|					| Onko tila käytettävissä vai pois käytöstä
spaceTypeId		| INTEGER		|FK(spaceType.id)	| Minkälainen opetustila kyseessä (Esim. Luentotila, soittotila, studio, jne.)

</details>

<details><summary>SpaceEquipment</summary>
<small> (Tilan varustus (soittimet, laitteistot yms.) </small>

Sarake				|	Tyyppi		|	Avaimet				|	Kuvaus
:-----				|	:----		|	------				|	------
<u>spaceId</u>		| INTEGER		|PK, FK(space.id)		| Tila
<u>equipmentId</u>	| INTEGER		|PK, FK(equipment.id)	| Varauste/Soitin

</details>

<details><summary>SpaceType</summary>
<small> (Tilatyyppi - Esim. luentotila, soittotila, studio jne.)

Sarake			|	Tyyppi		|	Avaimet		|	Kuvaus
:-----			|	:----		|	------		|	------
<u>id</u>		| INTEGER		| PK			| 
name			| VARCHAR(255)	|				| Nimi (Esim. Studio)
description		| VARCHAR(16000)|				| Vapaaehtoinen kuvaus

</details>

<details><summary>Subject</summary>
<small> (Opetus) </small>

Sarake			|	Tyyppi		|	Avaimet			|	Kuvaus
:-----			|	:----		|	------			|	------
<u>id</u>		| INTEGER		| PK				|
name			| VARCHAR(255)	|					| Opetuksen nimi (esim. Huilunsoitto, Taso A)
groupSize		| INTEGER		|					| Ryhmän koko, yksittäiselle opetukselle
groupCount		| INTEGER		|					| Montako ryhmää. Esim. 2x groupSize
sessionLength	| TIME			|					| Opetuksen yksittäisen opetuksen pituus
sessionCount	| INTEGER		|					| Montako opetusta per viikko
area			| DECIMAL(5,1)	|					| Opetukseen tarvittava tilan tilavuus (m²)
programId		| INTEGER		|FK(program.id)		| Mihin pääaineeseen opetus kuuluu
spaceTypeId		| INTEGER		|FK(spaceType.id)	| Minkälaisen tilan opetus tarvitsee (soitto/luento)

</details>

<details><summary>SubjectEquipment</summary>
<small> (Opetukseen tarvittavat soittimet / varusteet) </small>

Sarake				|	Tyyppi		|	Avaimet				|	Kuvaus
:-----				|	:----		|	------				|	------
<u>subjectId</u>	| INTEGER		| PK, FK(subject.id)	| Opetus
<u>equipmentId</u>	| INTEGER		| PK, FK(equipment.id)	| Varuste / Soitin
priority			| INTEGER		|						| Varusteen tärkeys (korkeampi numero on suurempi tarve)
obligatory			| BOOLEAN		|						| Onko varuste pakollinen kurssin kannalta (nostaa prioriteettia) ***Ei ainakaan vielä käytössä**

</details>

<details><summary>SubjectProgram</summary>
(mihin pääaineisin opetus kuuluu) **Ei tule käyttöön**

Sarake				| Tyyppi		| Avaimet			| Kuvaus
:-----				| :----			| ------			| ------
<u>subjectId</u>	| INTEGER		|PK,FK(subject.id)	| Opetus
<u>programId</u>	| INTEGER		|PK, FK(program.id)	| Pääaine

</details>

<details><summary>User</summary>

Sarake			| Tyyppi		| Avaimet		| Kuvaus
:-----			| :----			| ------		| ------
<u>id</u>		| INTEGER		| PK			|
email			| VARCHAR(255)	|				| Käyttäjän sähköpostiosoite
isAdmin			| BOOLEAN		|				| Onko käyttäjällä pääkäyttäjän oikeuksia

</details
