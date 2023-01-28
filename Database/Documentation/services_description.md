# Services
- They communicate with the database
- Return either JSON data or error message, if the call fails.
- Asynchronous, use Promises inside.

<details>
<summary>Allocation (calculation / allocRound)</summary>

| Fetch all calculations |   |
|---|---|
Method      | getAll
Parameters  | -
Returns     | All calculations
Contents    | id, name, isSeasonAlloc, description, lastModified

| Fetch Yksittäinen laskenta |   |
|---|---|
Method      | getById
Parameters  | allocRound.id
Returns     | Individual calculation/allocation round
Contents    | id, name, isSeason, description, lastModified, isAllocated, processOn, Subjects, allocated, unAllocated

| Fetch all subjects |   |
|---|---|
Method      | getAllSubjectsById
Parameters  | allocRound.id
Returns     | All calculation/allocation round sisältämät opinnot
Contents    | subject.id, subject.name, allocSubject.isAllocated, allocSubject.cantAllocate, allocSubject.priority, allocatedHours, requiredHours
huom!       | Ei käytössä missään vielä.

| Fetch all opetuksia sisältävät tilat |   |
|---|---|
Method      | getRoomsByAllocId
Parameters  | allocRound.id
Returns     | All huoneet laskennassa
Contents    | id, name, allocatedHours, requiredHours, spaceTypeId

| Fetch all huoneet pääaineen mukaan |   |
|---|---|
Method      | getAllocatedRoomsByProgram
Parameters  | program.id, allocRound.id
Returns     | All huoneet laskennassa, pääaineen mukaan
Contents    | space.id, space.name, allocatedHours

| Fetch all subjects pääaineen mukaan |   |
|---|---|
Method      | getSubjectsByProgram
Parameters  | allocRound.id, program.id
Returns     | All subjects laskennassa, pääaineen mukaan
Contents    | subject.id, subject.name, allocatedHours, requiredHours

| Aloita allokointi |  |
|---|---|
Method      | startAllocation
Parameters  | allocRound (id)
Returns     | - 
Contents    | Starts calculation/allocation round


| Resetoi allokointi |  |
|---|---|
Method      | resetAllocation
Parameters  | allocRound (id)
Returns     | - 
Contents    | Resetoi allocSubject, AllocSpace ja AllocSubjectSuitableSpace taulut

| Keskeytä allokointi | |
|--- | ---|
Method      | abortAllocation
Parameters  | AllocRound.id
Returns     | -
Contents    | Käskee tietokantaa lopettamaan käynnissä olevan allokoinnin

| Fetch subjects, joita ei pysty allokoimaan | |
|--- | ---|
Method      | getUnAllocableSubjects
Parameters  | AllocRound.id
Returns     | subjects
Contents    | Returns   allokoimattomat subjects

| Fetch tilat opetuksen mukaan | |
|--- | ---|
Method      | getSpacesForSubject
Parameters  | Subject.id
Returns     | Tilat
Contents    | Space.id, Space.name, Space.area, missingItems, areaOk, 
Space.personLimit, personLimitOk, Space.inUse, Space.spaceType, spaceTypeOk

| Fetch tilasta puuttuvat tavarat opetuksen mukaan | |
|--- | ---|
Method      | getMissingEquipmentForRoom
Parameters  | subject.id, space.id
Returns     | Puuttuvat tavarat tilasta opetuksen mukaan 
Contents    | Equipment.id, Equipment.name, SpaceEquipment.name



</details>

<details>
<summary>Program (=Teaching)</summary>


| Fetch all Programs |   |
|---|---|
Method      | getAll
Parameters  | -
Returns     | All Programs
Contents    | id, name

| Fetch indivual/certain Program |   |
|---|---|
Method      | getById
Parameters  | id
Returns     | Individual Program
Contents    | id, name

</details>