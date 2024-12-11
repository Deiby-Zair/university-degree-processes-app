import { EditableField } from "@/utils/requiredFields"
import { resolveAddress } from "./Ipfs";
import { getNestedValue } from "@/utils/json";
import { CircleCheckBig, CircleX } from "lucide-react";

interface Props {
    json: Record<string, any>;
    editableFields: EditableField[];
}

export const DataCard: React.FC<Props> = ({ json, editableFields }) => {
    console.log("JSON RECEIVED:", json);

    const getFieldBySize = (field: EditableField, parentKey: (string | number)[]) => {
        switch (field.size) {
            case 'single':
            case 'select':
            case 'text-area':
                return (
                    <label className="mb-2 text-sm">
                        <span className="text-blue-800 font-bold mr-2">
                            {field.name}:
                        </span>
                        <span className="text-gray-900">
                            {getNestedValue(json, parentKey)?.toString()}
                        </span>
                    </label>
                );

            case 'reduced-link':
                return (
                    <a className="block text-[13px] text-blue-800 font-bold"
                        href={resolveAddress(getNestedValue(json, parentKey))}
                        target="_blank">{field.name}
                    </a>
                );

            case 'binary':
                return (

                    <label className="mb-2 text-sm inline-flex whitespace-nowrap">
                        <span className="text-blue-800 font-bold mr-2">
                            {field.name}:
                        </span>
                        <span className="text-gray-900">
                            {getNestedValue(json, parentKey)
                                ? <CircleCheckBig className="text-green-700" />
                                : <CircleX className="text-red-700" />
                            }
                        </span>
                    </label>


                );

            default:
                console.log("Incorrect field.size", field.size);
                return <></>;
        }
    }

    const getMultipleField = (field: EditableField, parentKey: (string | number)[]) => {
        return <div className={`grid ${field.nestedFields && "xl:grid-cols-2 xl:gap-2"}`}>
            {Array.isArray(getNestedValue(json, parentKey))
                && (getNestedValue(json, parentKey) as any[]).map((multi_field, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                        <label
                            className="flex items-center justify-center
                    text-gray-700 font-medium w-full"
                        >
                            {field.nestedFields
                                ? (
                                    renderNestedFields(
                                        field.nestedFields,
                                        (parentKey ? [...parentKey, idx] : [idx])
                                    )
                                ) : (
                                    <label key={idx} className="block text-[13px] ">
                                        <span className="font-medium mr-2 text-gray-700">
                                            {field.subname} {idx + 1}:
                                        </span>
                                        <span className="text-gray-900">{multi_field}</span>
                                    </label>
                                )
                            }
                        </label>
                    </div>
                ))}
        </div>
    };

    const renderField = (field: EditableField, parentKey: (string | number)[]) => {
        return (
            <>
                {(field.size != "multiple") ? (
                    <label className="block text-gray-700 font-medium">
                        {field.nestedFields
                            ? (
                                <>
                                    <label className="block text-blue-800 font-bold text-sm">
                                        {field.name}:
                                    </label>
                                    {renderNestedFields(field.nestedFields, parentKey)}
                                </>
                            ) : (
                                getFieldBySize(field, parentKey)
                            )}
                    </label>
                ) : (
                    <div className="mt-2 space-y-2">
                        <label className="block text-blue-800 font-bold text-sm">
                            {field.name}:
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
        <div className="bg-white pt-2 p-6 rounded-b-lg shadow-md">
            {editableFields.map((field, index) => (
                <div key={index} className="flex flex-col space-y-2" >
                    {renderField(field, [field.key])}
                </div>
            ))}
        </div >
    );
};