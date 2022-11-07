# Rest-api endpoints

# <details><summary>Allokointi</summary>

| Kaikki allokoinnit  |   |
|---|---|
Endpoint    | /api/allocation/
Metodi      | GET
Parametrit  | -
Palauttaa   | Kaikki allocRound taulun laskennat.
Sisältö     | id, name, isAllocSeason, description, lastModified

| Yksittäinen allokointi  |   |
|---|---|
Endpoint    | /api/allocation/:id
Metodi      | GET
Parametrit  | allocRound.id
Palauttaa   | Yksittäisen allocRound taulun laskennan.
Sisältö     | id, name, isAllocSeason, description, lastModified, subjects(+rooms), rooms(+subjects)

|Huoneet ID mukaan |   |
|---|---|
Endpoint    | /api/allocation/:id/rooms
Metodi      | GET
Parametrit  | allocRound.id
Palauttaa   | Yksittäisen allocRoundin sisältämät huoneet
Sisältö     | space.id, space.name, allocatedHours, requiredHours

|Pääaineet allokoinnissa |   |
|---|---|
Endpoint    | /api/allocation/:id/program/
Metodi      | GET
Parametrit  | allocRound.id
Palauttaa   | Kaikki pääaineet ja niiden sisällöt
Sisältö     | program.id, program.name, rooms, subjects   

|Pääaine allokoinnissa |   |
|---|---|
Endpoint    | /api/allocation/:id/program/:programId
Metodi      | GET
Parametrit  | AllocRound.id, Program.id
Palauttaa   | Yksittäinen pääaine ja sen sisältö
Sisältö     | program.id, program.name, rooms, subjects

| Laskennan aloitus | * VIELÄ KESKEN!*  |
|---|---|
Endpoint    | /api/allocation/start
Metodi      | POST
Parametrit  | AllocRound.id
Palauttaa   | -
Sisältö     | -

</details>



