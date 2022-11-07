# Services
- Kommunikoi tietokannan kanssa
- Palauttaa promisen eli pyynnön sisällön tai virheviestin, jos kutsu epäonnistuu

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
Sisältö     | id, name

| Hae kaikki opetukset |   |
|---|---|
Metodi      | getAllSubjectsById
Parametrit  | allocRound.id
Palauttaa   | Kaikki laskennan sisältämät opinnot
Sisältö     | subject.id, subject.name, allocSubject.isAllocated, allocSubject.cantAllocate, allocSubject.priority, allocatedHours, requiredHours

| Hae opinnot tilan mukaan |   |
|---|---|
Metodi      | getSubjectsByAllocRoundAndSpaceId
Parametrit  | allocRound.id, space.id
Palauttaa   | Kaikki laskennassa tilaan sijoitetut opetukset
Sisältö     | subject.id, subject.name, allocatedHours, requiredHours

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

| Hae prioriteettiarvot opetuksille | *KESKEN - KÄYTETÄÄN LASKENNASSA*  |
|---|---|
Metodi      | getPriorityOrder
Parametrit  | allocRound.id
Palauttaa   | Opetukset haetaan prioriteettimääritelmien mukaisessa järjestyksessä
Sisältö     | *KESKEN*

| Merkitse prioriteettinumero opetukselle | *KESKEN - KÄYTETÄÄN LASKENNASSA*  |
|---|---|
Metodi      | updateAllocSubjectPriority
Parametrit  | subject.id, allocRound.id, priorityNumber
Palauttaa   | Merkitsee prioriteettiarvon opetukselle. Opetukset tullaan sijoittamaan tiloihin prioriteettinumeron mukaisessa järjestyksessä.
Sisältö     | *KESKEN*

| Merkitse prioriteettinumero opetukselle | *KESKEN - KÄYTETÄÄN LASKENNASSA*  |
|---|---|
Metodi      | findRoomsForSubject
Parametrit  | subjetId
Palauttaa   | *KESKEN*
Sisältö     | *KESKEN*

</details>