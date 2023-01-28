# Rest-api endpoints

<details><summary>Allocation (allokointi)</summary>
Tarvitaan eri laskentaversioiden käyttöä varten.

| Kaikki allokoinnit  |   |
|---|---|
Endpoint    | /api/allocation/
Method      | GET
Parameters  | -
Returns     | Kaikki allocRound taulun laskennat.
Contents    | id, name, isAllocSeason, description, lastModified
Used in     | -

| Yksittäinen allokointi  |   |
|---|---|
Endpoint    | /api/allocation/:id
Method      | GET
Parameters  | allocRound.id
Returns     | Yksittäisen allocRound taulun laskennan.
Contents    | id, name, isAllocSeason, description, lastModified, isAllocated, processOn, Subjects, allocated, unAllocated
Used in     | -

|Huoneet Allokoinnin id:n mukaan |   |
|---|---|
Endpoint    | /api/allocation/:id/rooms
Method      | GET
Parameters  | allocRound.id
Returns     | Yksittäisen allocRoundin sisältämät huoneet
Contents    | space.id, space.name, allocatedHours, requiredHours, spaceTypeId
Used in     | Results view

|Allokoinnin sisältö pääaineittain |   |
|---|---|
Endpoint    | /api/allocation/:id/program/
Method      | GET
Parameters  | allocRound.id
Returns     | Kaikki pääaineet ja niiden sisällöt
Contents    | program.id, program.name, rooms(id, name, allocatedHours), subjects(id, name, allocatedHours, requiredHours)
Used in     | Results view


| Laskennan aloitus |  |
|---|---|
Endpoint    | /api/allocation/start
Method      | POST
Parameters  | AllocRound.id
Returns     | -
Contents    | -
Used in     | Results view

| Laskennan resetointi |   |
|---|---|
Endpoint    | /api/allocation/reset
Method      | POST
Parameters  | AllocRound.id
Returns     | Poistaa kaikki allocRoundin kurssit AllocSpace taulusta ja nollaa isAllocated, priority ja cantAllocate:n, allocSubject taulussa.
Contents    | -
Used in     | Results view

| Laskennan keskeytys | |
| --- | ---|
Endpoint    | /api/allocation/abort
Method      | POST
Parameters  | AllocRound.id
Returns     | -
Contents    | -
Used in     | -

| Allokoimattomat opetukset | |
| --- | ---|
Endpoint    | /api/allocation/:id/subject/unallocated
Method      | GET
Parameters  | AllocRound.id
Returns     | Kaikki allokointiin sisältyvät opetukset, joita ei voinut sijoittaa tiloihin
Contents    | subjectId, subject.name, subject.groupSize, subject.area, subject.spaceType
Used in     | AllocationSubjectFailureView

| Tilojen sopivuus opetukselle | |
| --- | ---|
Endpoint    | /api/allocation/subject/:subjectId/rooms
Method      | GET
Parameters  | subject.id
Returns     | Palauttaa opetukselle kaikkien tilojen sopivuuden
Contents    | space.id, space.name, space.area, missingItems, areaOk, space.personLimit, personLimitOk, space.inUse, space.spaceType, spaceTypeOk 
Used in     | AllocationSubjectFailureView

| Puuttuvat varusteet tilassa | |
| --- | ---|
Endpoint    | /api/allocation/missing-eqpt/subject/:subid/room/:roomid
Method      | GET
Parameters  | subject.id, space.id
Returns     | Huoneesta puuttuvat varusteet opetukselle
Contents    | equipment.id, equipment.name
Used in     | AllocationFailureView



</details>


<details><summary>Program (pääaineet)</summary>

|Pääaineiden nimet |   |
|---|---|
Endpoint    | /api/program/getNames
Method      | GET
Parameters  | -
Returns     | Kaikki pääaineet
Contents    | program.id, program.name

</details>

<details><summary>SpaceType (tilatyypit)</summary>

| Kaikki tilatyypit |   |
|---|---|
Endpoint    | /api/spaceType/getNames
Method      | GET
Parameters  | -
Returns     | Kaikki tilatyypit
Contents    | id, name

</details>

<details><summary>Subject (Opinnot)</summary>

| Kaikki opinnot |   |
|---|---|
Endpoint    | /api/subject/getAll
Method      | GET
Parameters  | -
Returns     | Kaikki opinnot
Contents    | id, name, groupSize, groupCount, sessionLength, sessionCount, area, program.id, program.name, spaceTypeId, spaceTypeName

| Opetuksen lisäys |   |
|---|---|
Endpoint    | /api/subject/post
Method      | POST
Parameters  | name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId
Returns     | Lisää uuden opinnon
Contents    | -

| Opetuksen poisto |   |
|---|---|
Endpoint    | /api/subject/delete/:id
Method      | DELETE
Parameters  | subject.id
Returns     | Poistaa opinnon
Contents    | -

| Opetuksen muokkaus |   |
|---|---|
Endpoint    | /api/subject/update
Method      | PUT
Parameters  | id, name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId
Returns     | Päivittää opinnon
Contents    | -
</details>
