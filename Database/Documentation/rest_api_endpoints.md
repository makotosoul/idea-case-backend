# Rest-api endpoints

<details><summary>Allocation (allokointi)</summary>
Tarvitaan eri laskentaversioiden käyttöä varten.

| Kaikki allokoinnit  |   |
|---|---|
Endpoint    | /api/allocation/
Metodi      | GET
Parametrit  | -
Palauttaa   | Kaikki allocRound taulun laskennat.
Sisältö     | id, name, isAllocSeason, description, lastModified
Käytössä    | -

| Yksittäinen allokointi  |   |
|---|---|
Endpoint    | /api/allocation/:id
Metodi      | GET
Parametrit  | allocRound.id
Palauttaa   | Yksittäisen allocRound taulun laskennan.
Sisältö     | id, name, isAllocSeason, description, lastModified, isAllocated, processOn, Subjects, allocated, unAllocated
Käytössä    | -

|Huoneet Allokoinnin id:n mukaan |   |
|---|---|
Endpoint    | /api/allocation/:id/rooms
Metodi      | GET
Parametrit  | allocRound.id
Palauttaa   | Yksittäisen allocRoundin sisältämät huoneet
Sisältö     | space.id, space.name, allocatedHours, requiredHours, spaceTypeId
Käytössä    | tulosnäkymä

|Allokoinnin sisältö pääaineittain |   |
|---|---|
Endpoint    | /api/allocation/:id/program/
Metodi      | GET
Parametrit  | allocRound.id
Palauttaa   | Kaikki pääaineet ja niiden sisällöt
Sisältö     | program.id, program.name, rooms(id, name, allocatedHours), subjects(id, name, allocatedHours, requiredHours)
Käytössä    | Tulosnäkymä



| Laskennan aloitus | * VIELÄ KESKEN!*  |
|---|---|
Endpoint    | /api/allocation/start
Metodi      | POST
Parametrit  | AllocRound.id
Palauttaa   | -
Sisältö     | -

| Laskennan resetointi |   |
|---|---|
Endpoint    | /api/allocation/reset
Metodi      | POST
Parametrit  | AllocRound.id
Palauttaa   | Poistaa kaikki allocRoundin kurssit AllocSpace taulusta ja nollaa isAllocated, priority ja cantAllocate:n, allocSubject taulussa.
Sisältö     | -

</details>

<details><summary>Program (pääaineet)</summary>

|Pääaineiden nimet |   |
|---|---|
Endpoint    | /api/program/getNames
Metodi      | GET
Parametrit  | -
Palauttaa   | Kaikki pääaineet
Sisältö     | program.id, program.name

</details>

<details><summary>SpaceType (tilatyypit)</summary>

| Kaikki tilatyypit |   |
|---|---|
Endpoint    | /api/spaceType/getNames
Metodi      | GET
Parametrit  | -
Palauttaa   | Kaikki tilatyypit
Sisältö     | id, name

</details>

<details><summary>Subject (Opinnot)</summary>

| Kaikki opinnot |   |
|---|---|
Endpoint    | /api/subject/getAll
Metodi      | GET
Parametrit  | -
Palauttaa   | Kaikki opinnot
Sisältö     | id, name, groupSize, groupCount, sessionLength, sessionCount, area, program.id, program.name, spaceTypeId, spaceTypeName

| Opetuksen lisäys |   |
|---|---|
Endpoint    | /api/subject/post
Metodi      | POST
Parametrit  | name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId
Palauttaa   | Lisää uuden opinnon
Sisältö     | -

| Opetuksen poisto |   |
|---|---|
Endpoint    | /api/subject/delete/:id
Metodi      | DELETE
Parametrit  | subject.id
Palauttaa   | Poistaa opinnon
Sisältö     | -

| Opetuksen muokkaus |   |
|---|---|
Endpoint    | /api/subject/update
Metodi      | PUT
Parametrit  | id, name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId
Palauttaa   | Päivittää opinnon
Sisältö     | -
</details>
