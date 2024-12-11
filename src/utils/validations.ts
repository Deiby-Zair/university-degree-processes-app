import { EditableField } from "./requiredFields";
import { getOwnersWallets, getProgramById } from "./contractInteract";

export const verifyData = async (dataToSend: Record<string, any>, fields: EditableField[]) => {
    const keysToVerifyDuplicates: string[] = [];
    const alerts: string[] = [];
    const invalidAddresses: string[] = []

    try {
        await Promise.all(
            fields.map(async (field) => {
                switch (field.key) {
                    case "codereg":
                        console.log("Verifying process code:", field.key, dataToSend[field.key]);
                        const programCodeRegistered = await getProgramById(dataToSend[field.key]);
                        if (programCodeRegistered) {
                            alerts.push(`El id ${dataToSend[field.key]} ya se encuentra registrado`);
                        }
                        break;

                    case "students":
                    case "director":
                    case "codirector":
                    case "owners":
                    case "user":

                        keysToVerifyDuplicates.push(field.key);

                        const valuesToSearch: string[] = [].concat(dataToSend[field.key]);
                        const [owners, invalidOwners] = await getOwnersWallets(valuesToSearch);
                        dataToSend[field.key + "Array"] = owners;
                        invalidAddresses.push(...invalidOwners);

                        break;
                    default:
                        break;
                }
            }));

    } catch (error) {

    }
    finally {
        if (keysToVerifyDuplicates.length) {
            console.log("Checking that there are no duplicates in:", keysToVerifyDuplicates);

            const duplicatedValues = validateDuplicateWitKeys(dataToSend, keysToVerifyDuplicates);
            if (duplicatedValues.length) {
                if (duplicatedValues.length > 1) {
                    alerts.push(`Los correos ${duplicatedValues} no deben usarse más de una vez`);
                }
                else {
                    alerts.push(`El correo ${duplicatedValues} no debe usarse más de una vez`);
                }
            } else if (invalidAddresses.length) {
                console.log("Invalid addresses:", invalidAddresses);

                if (invalidAddresses.length > 1) {
                    alerts.push(`Los correos ${invalidAddresses} no son válidos o no se encuentran registrados`);
                }
                else {
                    alerts.push(`El correo ${invalidAddresses} no es válido o no se encuentra registrado`);
                }
            }
        }
    }
    return alerts;
};

export const findRepeatedElements = (...arrays: any[][]): any[] => {

    const occurrenceMap = new Map<any, number>();
    const repeatedElements: any[] = [];

    for (const array of arrays) {
        for (const value of array) {
            if (value === "" || value === undefined) continue; // Ignora los strings vacíos
            const count = occurrenceMap.get(value) || 0;
            occurrenceMap.set(value, count + 1);

            if (count === 1) {
                repeatedElements.push(value);
            }
        }
    }
    console.log("Repeated elements:", repeatedElements);
    return repeatedElements;
};

export const validateDuplicateWitKeys = (myObject: Record<string, any>, keysToEvaluate: string[]) => {

    const allValues: string[] = [];

    // Recorrer solo las claves especificadas
    for (const key of keysToEvaluate) {
        const value = myObject[key];
        if (Array.isArray(value)) {
            allValues.push(...value); // Aplanar y añadir los valores del array
        } else {
            allValues.push(value); // Añadir el valor directamente
        }
    }

    return findRepeatedElements(allValues);
};