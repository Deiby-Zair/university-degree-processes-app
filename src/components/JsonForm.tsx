import React, { useEffect, useState } from 'react';

import Popup from './Popup';
import { Ipfs } from './Ipfs';

import { FormProps } from '@/utils/types';
import { verifyData } from '@/utils/validations';
import { EditableField } from '@/utils/requiredFields';
import { generateEmptyJSON, getNestedValue, setNestedValue } from '@/utils/json';

export const JsonForm: React.FC<FormProps> = ({ json, formFields, onSaveChanges, onExit, title }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [trySubmit, setTrySubmit] = useState<boolean>(false);
    const [invalidData, setInvalidData] = useState<boolean>(false);
    const [editableData, setEditableData] = useState<Record<string, any>>(json);

    useEffect(() => { setEditableData(json); }, [json]);

    const handleInputChange = (keys: (string | number)[], value: string | boolean): void => {
        try {
            const datatoModify = setNestedValue(editableData, keys, value);
            setEditableData(datatoModify);
        } catch (error) {
            console.error(`Error seting the field in keys: ${keys}`, error);
        }
    };

    const handleFieldSizeChange = (
        parentKeys: (string | number)[],
        index: number,
        action: 'add' | 'remove',
        nestedFields?: EditableField[]
    ) => {
        const valuesNested = getNestedValue(editableData, parentKeys);

        if (Array.isArray(valuesNested)) {
            if (action === 'add') {
                const newField = nestedFields ? generateEmptyJSON({ fields: nestedFields }) : '';
                valuesNested.splice(index + 1, 0, newField); // Add new field empty or nested base
            } else if (action === 'remove') {
                valuesNested.splice(index, 1); // Remove the field at the index
            }
        }
        setEditableData(setNestedValue(editableData, parentKeys, valuesNested));
    };

    const handleConfirm = () => {
        setIsPopupOpen(false); // Close the popup after confirming

        switch (popupMessage) {
            case "¿Desea guardar los cambios?":
                onSaveChanges(editableData);
                break;
            case "¿Desea descartar los cambios?":
                onExit();
                break;
            case "Información inválida":
                break;
            default:
                console.log("invalid Popup");
        }
    };

    const handleCancel = () => {
        setIsPopupOpen(false); // Close the popup after canceling
    };

    const handleExit = (): void => {
        setPopupMessage("¿Desea descartar los cambios?");
        setIsPopupOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const popUpInvalidInput = await verifyData(editableData, formFields);

        if (popUpInvalidInput.length) {
            setInvalidData(true);
            setPopupMessage(popUpInvalidInput.join(", "));
        } else {
            setInvalidData(false);
            setPopupMessage("¿Desea guardar los cambios?");
        }
        setIsPopupOpen(true);
    };

    //____________________JSX Component Rendering____________________________________________

    const getFieldBySize = (field: EditableField, parentKey: (string | number)[]) => {
        switch (field.size) {
            case 'single':
                return (
                    <>
                        <input
                            type={field.type}
                            name={field.key}
                            required={field.required}
                            placeholder={field.placeholder}
                            readOnly={field.readonly}
                            value={getNestedValue(editableData, parentKey)}
                            onChange={(e) => handleInputChange(parentKey, e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2
                            peer invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                        />
                        <span
                            className="mt-1 mr-2 hidden text-sm text-red-500 
                            peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
                        >
                            {field.errorMessage}
                        </span>
                    </>
                );

            case 'select':
                return (
                    <>
                        {field.readonly ? (
                            <input
                                type={field.type}
                                name={field.key}
                                required={field.required}
                                placeholder={field.placeholder}
                                readOnly={field.readonly}
                                value={getNestedValue(editableData, parentKey)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2
 peer invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                            />
                        ) : (
                            <>
                                <select
                                    name={field.key}
                                    required={field.required}
                                    value={getNestedValue(editableData, parentKey) || ''}
                                    onChange={(e) => handleInputChange(parentKey, e.target.value)}
                                    className={`
                                block w-full p-2 mt-1
                                border border-gray-300 rounded-md peer ${trySubmit &&
                                        'invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500'}`
                                    }
                                >
                                    <option value="">Selecciona una opción</option>

                                    {field.options && field.options.map((selectOption, index) => (
                                        <option key={index} value={selectOption}>
                                            {field.showOptions && `${selectOption}`}
                                            {field.optionsLabels && `
                                                ${field.showOptions ? ` - ` : ""}
                                                ${field.optionsLabels[index]}
                                                `}
                                        </option>
                                    ))}
                                </select>

                                <span
                                    className={`
                                mt-1 mr-2 text-sm hidden text-red-500 ${trySubmit &&
                                        'peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'}
                            `}
                                >
                                    {field.errorMessage}
                                </span>
                            </>
                        )}
                    </>
                );

            case 'text-area':
                return (
                    <textarea
                        name={field.key}
                        rows={5} cols={50}
                        readOnly={field.readonly}
                        value={getNestedValue(editableData, parentKey)}
                        onChange={(e) => handleInputChange(parentKey, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                );

            case 'reduced-link':
                return (
                    <>
                        <p className='mt-2 text-blue-800'>{field.suppportingText}</p>
                        <Ipfs
                            field={field}
                            data={editableData}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            sendLinkToData={handleInputChange}
                        />
                    </>
                );

            case 'binary':
                return (
                    <>
                        <span className="ml-2 relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={getNestedValue(editableData, parentKey)}
                                onChange={(e) => handleInputChange(parentKey, e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </span>
                        <span
                            className="mt-1 mr-2 hidden text-sm text-red-500 
                                peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
                        >
                            {field.errorMessage}
                        </span>
                    </>
                );



            default:
                console.log("Incorrect field.size", field.size);
                return <></>;
        }
    }

    const getMultipleField = (field: EditableField, parentKey: (string | number)[]) => {
        return <>
            {(getNestedValue(editableData, parentKey) as any[])?.length &&
                (getNestedValue(editableData, parentKey) as any[]).map((multi_field, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                        <label
                            className="flex items-center justify-center
                        text-gray-700 font-medium w-full"
                        >
                            <span className='whitespace-nowrap'>{`${field.subname} ${idx + 1}:`}</span>
                            {field.required &&
                                <span className='text-red-500 pl-2 pr-4 inline whitespace-nowrap'>
                                    *
                                </span>
                            }
                            {field.nestedFields
                                ? (
                                    renderNestedFields(
                                        field.nestedFields,
                                        (parentKey ? [...parentKey, idx] : [idx])
                                    )
                                ) : (
                                    <input
                                        type={field.type}
                                        value={multi_field}
                                        required={field.required}
                                        name={`${field.key}${idx}`}
                                        placeholder={field.placeholder}
                                        onChange={(e) => {
                                            handleInputChange([...parentKey, idx], e.target.value)
                                        }}
                                        className="block w-full p-2 mt-1 mr-4
                                    border border-gray-300 rounded-md peer
                                    invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                                    />
                                )
                            }

                            <span
                                className="mt-1 mr-2 hidden text-sm text-red-500 
                            peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
                            >
                                {field.errorMessage}
                            </span>

                            {(getNestedValue(editableData, parentKey) as any[]).length > 1 &&
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleFieldSizeChange(
                                            parentKey,
                                            idx,
                                            "remove",
                                            field.nestedFields)
                                    }}
                                    title={`Eliminar ${field.subname}`}
                                    className="bg-red-500 text-white px-3 py-1
                                            rounded mx-1 hover:bg-red-600"
                                >
                                    -
                                </button>
                            }
                            <button
                                type="button"
                                onClick={() => {
                                    handleFieldSizeChange(parentKey, idx, "add", field.nestedFields)
                                }}
                                title={`Agregar ${field.subname}`}
                                className="bg-blue-500 text-white px-3 py-1 
                                    rounded hover:bg-blue-600"
                            >
                                +
                            </button>
                        </label>
                    </div>
                ))}
        </>
    };

    const renderField = (field: EditableField, parentKey: (string | number)[]) => {
        return (
            <>
                {(field.size != "multiple") ? (
                    <label className={`${field.size === "binary" ? "flex" : "block"}
                     text-gray-700 font-medium items-center`}>
                        {field.name}
                        {field.required && <span className='text-red-500 pl-2'>*</span>}
                        {field.nestedFields
                            ? (
                                renderNestedFields(field.nestedFields, parentKey)
                            ) : (
                                getFieldBySize(field, parentKey)
                            )}
                    </label>
                ) : (
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-medium text-base">
                            {field.name}
                        </label>
                        {getMultipleField(field, parentKey)}
                    </div>
                )}
            </>
        )
    };

    const renderNestedFields = (nestedFields: EditableField[], parentKey: (string | number)[]) => {
        return (
            <div className="border w-full p-4 mx-2 mb-4 rounded">
                {nestedFields.map((field) => (
                    <div key={field.key} className="mb-2">
                        {renderField(field, (parentKey ? [...parentKey, field.key] : [field.key]))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {isPopupOpen &&
                <div className="fixed flex justify-center items-center h-screen">
                    <Popup
                        isOpen={isPopupOpen}
                        message={popupMessage}
                        onConfirm={handleConfirm}
                        onCancel={invalidData ? undefined : handleCancel}
                    />
                </div>
            }

            {title && <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>}

            <div className="bg-white p-6 rounded-b-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formFields.map((field, index) => (
                        <div key={index} className="flex flex-col space-y-2" >
                            {renderField(field, [field.key])}
                        </div>
                    ))}

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            onBlur={() => setTrySubmit(true)}
                            className={`text-white py-2 px-4  mr-4 rounded 
                                    ${isLoading
                                    ? 'bg-green-300 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >
                            Guardar Cambios
                        </button>

                        <button
                            type='button'
                            onClick={handleExit}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </form >
            </div >
        </>
    );
};