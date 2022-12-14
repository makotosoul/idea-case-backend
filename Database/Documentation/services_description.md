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
Sisältö     | id, name, allocatedHours, requiredHours, spaceTypeId

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
Sisältö     | Käynnistää laskennan


| Resetoi allokointi |  |
|---|---|
Metodi      | resetAllocation
Parametrit  | allocRound (id)
Palauttaa   | - 
Sisältö     | Resetoi allocSubject, AllocSpace ja AllocSubjectSuitableSpace taulut

| Keskeytä allokointi | |
|--- | ---|
Metodi      | abortAllocation
Parametrit  | AllocRound.id
Palauttaa   | -
Sisältö     | Käskee tietokantaa lopettamaan käynnissä olevan allokoinnin

| Hae opetukset, joita ei pysty allokoimaan | |
|--- | ---|
Metodi      | getUnAllocableSubjects
Parametrit  | AllocRound.id
Palauttaa   | subjects
Sisältö     | Palauttaa allokoimattomat opetukset

| Hae tilat opetuksen mukaan | |
|--- | ---|
Metodi      | getSpacesForSubject
Parametrit  | Subject.id
Palauttaa   | Tilat
Sisältö     | Space.id, Space.name, Space.area, missingItems, areaOk, 
Space.personLimit, personLimitOk, Space.inUse, Space.spaceType, spaceTypeOk

| Hae tilasta puuttuvat tavarat opetuksen mukaan | |
|--- | ---|
Metodi      | getMissingEquipmentForRoom
Parametrit  | subject.id, space.id
Palauttaa   | Puuttuvat tavarat tilasta opetuksen mukaan 
Sisältö     | Equipment.id, Equipment.name, SpaceEquipment.name



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