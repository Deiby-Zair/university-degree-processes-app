import { EditableField } from "./requiredFields";

export const parseJsonString = (jsonString: string) => {
    try {
        if (jsonString) {
            if (jsonString.length > 0) {
                const parsedData = JSON.parse(jsonString);
                return parsedData;
            } else return {}
        } else return {}
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return {};
    }
};

export const generateEmptyJSON = ({ fields }: { fields: EditableField[]; }): any => {
    const result: any = {};

    fields.forEach(field => {
        if (field.size === "multiple") {
            if (field.nestedFields && field.nestedFields.length > 0) {
                // Si tiene nestedFields, crear un array con un objeto vacío basado en los nestedFields
                result[field.key] = [generateEmptyJSON({ fields: field.nestedFields })];
            } else {
                // Si no tiene nestedFields, crear un array vacío
                result[field.key] = [];
            }
        } else if (field.nestedFields && field.nestedFields.length > 0) {
            // Si es un campo anidado pero no es "multiple", se crea un objeto anidado
            result[field.key] = generateEmptyJSON({ fields: field.nestedFields });
        } else {
            // En otros casos, simplemente se asigna un valor vacío (string vacío como ejemplo)
            result[field.key] = "";
        }
    });

    return result;
}

export const setNestedValue = (
    json: Record<string, any>,
    keys: (string | number)[],
    value: any
): any => {
    const modifiedData = structuredClone(json);
    keys.reduce((acc, key, index) => {
        // Si estamos en la última clave, asignamos el nuevo valor
        if (index === keys.length - 1) {
            acc[key] = value;
            console.log("aqui se evalua la ultima  clave con data:", acc, "KEY:", key,
                "y valor actual:", acc[key]);
        } else {
            // Si el valor actual no existe, creamos un objeto o un array según corresponda
            if (acc[key] === undefined) {
                acc[key] = typeof keys[index + 1] === 'number' ? [] : {};
            }
            console.log("aqui se evalua un no ultimo ultimo con", acc, "KEY:", key,
                "y valor actual:", acc[key]);
            return acc[key]; // Avanzamos al siguiente nivel
        }
        return acc;
    }, modifiedData);

    return modifiedData;
}

export function getNestedValue(json: Record<string, any>, keys: (string | number)[] | undefined): any {
    return keys ? keys.reduce((acc, key) => {
        if (acc && typeof acc === 'object') {
            return acc[key]; // Avanzamos al siguiente nivel
        }
        return undefined; // Si no existe, devolvemos undefined
    }, structuredClone(json)) :
        undefined;
}