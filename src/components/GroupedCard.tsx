import { FaFilePdf } from "react-icons/fa";
import { resolveAddress } from "./Ipfs";
import SegmentedBar from "./SegmentedBar";
import { SquareArrowDownLeft, SquareArrowUpRight } from "lucide-react";

interface GroupedCardProps {
    groups: string[];
    json: Record<string, any>[];
    PhasesNumberConfirmations?: Record<string, any>[];
    indicator: string;
    groupsNames: string[]
}

const statesToColors: Record<string, any> = {
    "Subido": "bg-green-500",
    "Aprobado": "bg-green-500",
    "Correcciones": "bg-orange-500",
    "Rechazado": "bg-red-500"
}

const textStatesToColors: Record<string, string> = {
    "Subido": "text-blue-500",
    "Aprobado": "text-green-500",
    "Correcciones": "text-orange-500",
    "Rechazado": "text-red-500"
};

export const GroupedCard: React.FC<GroupedCardProps> = ({
    groups, json, indicator, groupsNames, PhasesNumberConfirmations }) => {

    const getNumConfirmations = (element: string) => {
        const matchingPhase = PhasesNumberConfirmations?.find(field => field.phase === element);
        return matchingPhase ? matchingPhase?.numConfirmations + 1 : 1;
    };

    const getColors = (element: any) => {
        const colors = [];
        const colorsElement: Record<string, any> = {};

        if (json.filter(field => (field[indicator] === element && field.state == "Subido")).length) {
            colors.push("bg-green-500");
        }

        json.filter(field => (field[indicator] === element && field.state != "Subido")).map(item => {
            colorsElement[item.signer] = statesToColors[item.state] || "bg-gray-500";
        });

        colors.push(...Object.values(colorsElement));
        return colors;
    };

    const getAdjustedColors = (element: any) => {
        const numConfirmations = getNumConfirmations(element);
        const colors = getColors(element);
        if (colors.length === 0) return colors;
        // Ajustar la longitud del vector de colores
        if (colors.length < numConfirmations) {
            const fillColor = "bg-gray-500"; // Rellenar con un color predeterminado
            return [...colors, ...Array(numConfirmations - colors.length).fill(fillColor)];
        } else if (colors.length > numConfirmations) {
            // Truncar el vector de colores
            return colors.slice(0, numConfirmations);
        } else {
            return colors;
        }
    };

    return (
        <>
            {(indicator === "phase") && groups.map((element, index) => (
                <div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow-lg border-gray-400 border-2
                    my-4 divide-y-2 divide-gray-400"
                >
                    <div className="flex gap-4 w-full items-center mb-2">
                        <h1 className="text-base font-bold whitespace-nowrap">{groupsNames[index]}</h1>
                        <SegmentedBar
                            segments={getNumConfirmations(element)}
                            colors={getAdjustedColors(element)}
                        />
                    </div>
                    <div className="divide-y pt-2">
                        {json.filter(field => (field[indicator] === element)).map((event, idx) => {
                            const textColorClass = textStatesToColors[event.state] || "text-gray-500";
                            return (
                                <p
                                    key={idx}
                                    className={`${textColorClass} ${event.self ? '' : 'text-right'}
                                    max-w-1/2 text-sm pt-1`}>
                                    <a

                                        target="_blank"
                                        href={resolveAddress(event.associatedLink)}
                                        className={`inline-flex items-center space-x-2
                                            ${event.self ? '' : 'justify-end'}`}
                                    >
                                        {event.self
                                            ? <SquareArrowUpRight />
                                            : <SquareArrowDownLeft />
                                        }
                                        <FaFilePdf size={24} />
                                        <span className="whitespace-nowrap">
                                            {event.self
                                                ? `Subido el ${event.date}`
                                                : `Recibido el ${event.date} con la calificación de
                                        ${event.state}`
                                            }
                                        </span>
                                        {event.comments.length > 0 && (
                                            <span className="whitespace-nowrap">{
                                                event.self
                                                    ? `con los comentarios ${event.comments}`
                                                    : `y los comentarios ${event.comments}`
                                            }</span>
                                        )}
                                    </a>
                                </p>
                            )
                        })}
                    </div>
                </div>
            ))}

            {indicator === "role" &&
                <div className="bg-white rounded-lg shadow-lg border-gray-400 border-2 my-4 p-4">
                    <h2 className="text-base font-bold text-center mb-2">Participantes</h2>
                    {groups.map((participantRole, index) => (
                        <div key={index} className="text-sm">
                            <h1 className="font-bold">{groupsNames[index]}:</h1>
                            <ul className="list-disc pl-5">
                                {json
                                    .filter(participant => participant.role === participantRole)
                                    .map((participant, idx) => (
                                        <li key={idx} className="text-green-600 max-w-1/2 my-1">
                                            {participant.name} ({participant.email})
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))}
                </div>
            }
        </>
    );
}