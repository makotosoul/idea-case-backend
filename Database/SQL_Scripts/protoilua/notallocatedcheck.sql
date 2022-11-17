--subjekti jota ei voitu allokoida, katsoo huonekohtaisesti miksi sitä ei voitu allokoida
--ei tilaa vaadittavalle neliömääräälle space - subject
--ei tilaa vaadittavalle henkilömäärälle space - subject
--ei ole tilaa, jossa on varusteet spaceequipment - subjectequipment
--BLOCKER: equipmentin pitää aiheuttaa cantAllocate allokaatiossa

--kyllä/ei-tilataulukko että kävikö vai ei jokaiselle ominaisuudelle
SELECT sp.id, sp.name, sp.area, sp.personLimit, if(sp.area >= (SELECT area FROM Subject WHERE id = :subId), "Y", "N") as areaOk, if(sp.personLimit >= (SELECT groupSize FROM Subject WHERE id = :subId), "Y", "N") as personLimitOk, sp.inUse FROM `Space` sp;


--JOIN SpaceEquipment spaeq ON sub.id = spaeq.subjectId JOIN Equipment eq ON spaeq.equipmentId = eq.id WHERE 
