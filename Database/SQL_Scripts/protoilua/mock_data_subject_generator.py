"""
1. Copy file to your folder
2. Choose amount of subjects in amount variable 
3. Run file
4. Use insert_subject.sql file in database
5. Use insert_allocsub.sql file in database
6. DONE!
"""

import random
import string
letters = string.ascii_lowercase
minutes = [15, 30, 45]
spaceTypes = [5002, 5004]
amount = 1510
allocRound = 10003

try:
    subj=open('insert_subject.sql','w')
    subj.write("INSERT IGNORE INTO Subject(name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId) VALUES \n")

    allocSub = open('insert_allocsub.sql', 'w')
    allocSub.write("INSERT IGNORE INTO AllocSubject(subjectId, allocRound) VALUES \n")

    for i in range (0, amount):
        name = '"' + ''.join(random.choice(letters) for i in range(15)) + '"'

        subj.write(f"({name}, {random.randint(1,15)}, {random.randint(1,3)}, 0{random.randint(1,2)}{random.choice(minutes)}00, {random.randint(1,3)}, {random.randint(5, 30)}, {random.randint(3001, 3030)}, {random.choice(spaceTypes)})")
        allocSub.write(f"((SELECT id from Subject WHERE name={name}), {allocRound})")

        if i != amount -1:
            subj.write(', \n')
            allocSub.write(', \n')

    subj.close()
    allocSub.close()
except:
    print("ERROR!")