import random
import string
letters = string.ascii_lowercase
amount = 150
areaRange = [5, 40]
personRange = [2, 20]
buildingIds = [401, 403]
spaceTypes = [5002, 5004]

try:
    file = open("insert_space.sql", "w")
    file.write("INSERT IGNORE INTO `Space` (`name`, `area`, `personLimit`, `buildingId`, `availableFrom`, `availableTo`, `classesFrom`, `classesTo`, `spaceTypeId`) VALUES \n")

    for i in range(0, amount):
        name = '"' + ''.join(random.choice(letters) for i in range(15)) + '"'

        file.write(f"({name}, {random.randint(areaRange[0], areaRange[1])}, {random.randint(personRange[0], personRange[1])}, {random.randint(buildingIds[0], buildingIds[1])}, 080000, 210000, 080000, 210000, {random.choice(spaceTypes)})")
        if i != amount -1:
            file.write(", \n")
    file.close()
except:
    print("ERROR")


