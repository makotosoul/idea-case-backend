# Services
- Kommunikoi tietokannan kanssa
- Palauttaa promisen eli pyynnön sisällön tai virheviestin, jos kutsu epäonnistuu

<details>
<summary>Allocation (laskenta / allocRound)</summary>

| Hae kaikki laskennat |   |
|---|---|
Metodi      | getAll
Parametrit  | -
Palauttaa   | Kaikki laskennat
Sisältö     | id, name, isSeasonAlloc, description, lastModified

| Hae Yksittäinen laskenta |   |
|---|---|
Metodi      | getById
Parametrit  | allocRound.id
Palauttaa   | Yksittäisen laskennan
Sisältö     | id, name, isSeason, description, lastModified, isAllocated, processOn, Subjects, allocated, unAllocated

| Hae kaikki opetukset |   |
|---|---|
Metodi      | getAllSubjectsById
Parametrit  | allocRound.id
Palauttaa   | Kaikki laskennan sisältämät opinnot
Sisältö     | subject.id, subject.name, allocSubject.isAllocated, allocSubject.cantAllocate, allocSubject.priority, allocatedHours, requiredHours
huom!       | Ei käytössä missään vielä.

| Hae kaikki opetuksia sisältävät tilat |   |
|---|---|
Metodi      | getRoomsByAllocId
Parametrit  | allocRound.id
Palauttaa   | Kaikki huoneet laskennassa
Sisältö     | id, name, allocatedHours, requiredHours

| Hae kaikki huoneet pääaineen mukaan |   |
|---|---|
Metodi      | getAllocatedRoomsByProgram
Parametrit  | program.id, allocRound.id
Palauttaa   | Kaikki huoneet laskennassa, pääaineen mukaan
Sisältö     | space.id, space.name, allocatedHours

| Hae kaikki opetukset pääaineen mukaan |   |
|---|---|
Metodi      | getSubjectsByProgram
Parametrit  | allocRound.id, program.id
Palauttaa   | Kaikki opetukset laskennassa, pääaineen mukaan
Sisältö     | subject.id, subject.name, allocatedHours, requiredHours

| Aloita allokointi |  |
|---|---|
Metodi      | startAllocation
Parametrit  | allocRound (id)
Palauttaa   | - 
Sisältö     | KESKEN!


| Resetoi allokointi |  |
|---|---|
Metodi      | resetAllocation
Parametrit  | allocRound (id)
Palauttaa   | - 
Sisältö     | Resetoi allocSubject, AllocSpace ja AllocSubjectSuitableSpace taulut

</details>

<details>
<summary>Program (pääaine)</summary>


| Hae kaikki pääaineet |   |
|---|---|
Metodi      | getAll
Parametrit  | -
Palauttaa   | Kaikki Pääaineet
Sisältö     | id, name

| Hae yksittäinen pääaine |   |
|---|---|
Metodi      | getById
Parametrit  | -
Palauttaa   | Yksittäisen pääaineen
Sisältö     | id, name

</details>