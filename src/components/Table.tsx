import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { FaFilePdf } from "react-icons/fa6";

import { JsonForm } from './JsonForm';
import { EventsHistory } from './EventsHistory';
import { resolveAddress } from './Ipfs';
import { TableProps } from '@/utils/types';
import { assignmentFields, initialAssignment } from '@/utils/requiredFields';

const Table = <T,>({ title, columns, data, buttons, addButton }: TableProps<T>) => {

    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [isToAssign, setIsToAssign] = useState<boolean>(false);
    const [assignButton, setAssignButton] = useState<number | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleExpandClick = (rowIndex: number, isAssignment?: true, buttonIndex?: number) => {
        setIsToAssign(isAssignment as boolean);
        setExpandedRow((expandedRow === rowIndex && isAssignment == isToAssign) ? null : rowIndex);
        setAssignButton(buttonIndex);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter((row) =>
        columns.some((column) =>
            String(row[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="overflow-x-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold">{title}</h2>
                    {addButton &&
                        <button
                            onClick={() => addButton.onClick()}
                            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                            title={addButton.hoverText}
                        >
                            {addButton.icon}
                        </button>
                    }
                </div>

                <input
                    type="text"
                    name='searchBar'
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="py-1 px-2 border border-gray-300 rounded"
                />
            </div>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr className="rounded-t-lg">
                        <th className="py-2 bg-gray-100 border-b border-gray-200 text-left" />
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="py-2 px-4 bg-gray-100 border-b border-gray-200 text-left"
                            >
                                {column.size === "reduced-link" ? "Link del documento" : column.name}
                            </th>
                        ))}
                        {buttons?.length && (
                            <th className="py-2 px-4 bg-gray-100 border-b border-gray-200 text-left">
                                Opciones
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            <tr className={`border-b border-gray-200
                                ${rowIndex === filteredData.length - 1 ? 'rounded-b-lg' : ''}`}>
                                <td>
                                    <button
                                        title='Ver detalles'
                                        onClick={() => handleExpandClick(rowIndex)}
                                    >
                                        <ChevronRight />
                                    </button>
                                </td>
                                {columns.map((column, colIndex) => (
                                    <React.Fragment key={String(column.key)}>
                                        {column.size == "reduced-link" ? (
                                            <td>
                                                <a target="_blank"
                                                    href={resolveAddress(row[column.key])}>
                                                    <FaFilePdf size={24} />
                                                </a>
                                            </td>
                                        ) : (
                                            <td className={`py-2 px-4 
                                                ${(colIndex === 0) && 'cursor-pointer'}`}
                                                onClick={(colIndex === 0) ? () => {
                                                    handleExpandClick(rowIndex);
                                                } : undefined
                                                }
                                                title={(colIndex === 0) ? "Ver detalles" : ""}>
                                                {String(row[column.key])}
                                            </td>
                                        )}
                                    </React.Fragment>
                                ))}

                                {buttons?.length && (
                                    <td className="py-2 px-4 flex-row space-x-2">
                                        {buttons.map((button, buttonIndex) => (
                                            <button
                                                key={buttonIndex}
                                                className="hover:text-blue-500"
                                                title={button.hoverText}
                                                onClick={() => {
                                                    if (button.hoverText === 'Assign') {
                                                        handleExpandClick(rowIndex, true, buttonIndex);
                                                    } else {
                                                        button.onClick(row.address);
                                                    }
                                                }}
                                            >
                                                {button.icon}
                                            </button>
                                        ))}
                                    </td>
                                )}
                            </tr>

                            {expandedRow === rowIndex && buttons &&
                                <tr className="border-b border-gray-200">
                                    <td colSpan={columns.length + 1} className="py-2 px-4 bg-gray-50">
                                        {!isToAssign ? (
                                            <EventsHistory contractTo={row.address} />
                                        ) : ((assignButton !== undefined) &&
                                            <div className="p-4 bg-gray-100 rounded-lg mb-4">
                                                <JsonForm
                                                    title="Asignar proceso de Grado"
                                                    json={{
                                                        ...initialAssignment,
                                                        contractTo: row.address,
                                                        state: row.state,
                                                        processName: row.processName,
                                                        program: row.program
                                                    }}
                                                    formFields={assignmentFields}
                                                    onSaveChanges={
                                                        buttons[assignButton].onClick as
                                                        (updatedJson: Record<string, any>) => void
                                                    }
                                                    onExit={handleExpandClick} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            }
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;