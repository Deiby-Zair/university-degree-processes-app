export const documentStates: string[] = [
    "Subido",
    "Aprobado",
    "Correcciones",
    "Rechazado",
];

export interface EditableField {
    name: string;
    subname: string;
    size: "single" | "multiple" | "reduced-link" | "text-area" | "select" | "binary";
    type: "text" | "number" | "email" | "url" | "checkbox";
    key: string;
    required: boolean;
    placeholder: string;
    errorMessage: string;
    options?: string[];
    showOptions?: boolean;
    optionsLabels?: string[];
    nestedFields?: EditableField[];
    readonly?: boolean;
    suppportingText?: string
};

////////////////////USERS//////////////////

export const initialAccount = {
    name: "",
    role: "",
    email: ""  //Selected out of the form
};

export const accountFields: EditableField[] = [
    {
        name: "Nombre",
        subname: "",
        size: "single",
        type: "text",
        key: "name",
        required: false,
        placeholder: "Nombre completo",
        errorMessage: "Escribe tu nombre",
    },
    {
        name: "Cargo en la Universidad",
        subname: "",
        size: "select",
        type: "text",
        key: "role",
        required: true,
        placeholder: "Docente o Estudiante",
        errorMessage: "Selecciona una opción",
        options: ["student", "teacher", "directive"],
        showOptions: false,
        optionsLabels: ["Estudiante", "Docente", "Directivo"],
    }
];

export const initialWalletRole = {
    user: "",
    role: ""
};

export const walletRoleFields: EditableField[] = [
    {
        name: "Email de Usuario",
        subname: "",
        size: "single",
        type: "text",
        key: "user",
        required: true,
        placeholder: "correo@unicauca.edu.co",
        errorMessage: "Introduce un correo electrónico.",
    },
    {
        name: "Cargo en la Universidad",
        subname: "",
        size: "select",
        type: "text",
        key: "role",
        required: true,
        placeholder: "Docente o Estudiante",
        errorMessage: "Selecciona una opción",
        options: ["student", "teacher", "directive", "admin"],
        showOptions: false,
        optionsLabels: ["Estudiante", "Docente", "Directivo", "Administrador"],
    }
];

export const initialFullUser = {
    walletAddress: "",
    email: "",
    name: "",
    role: ""
};

export const fullUserFields: EditableField[] = [
    {
        name: "Dirección Wallet",
        subname: "",
        size: "single",
        type: "text",
        key: "walletAddress",
        required: true,
        placeholder: "Dirección de wallet",
        errorMessage: "Escribe tu wallet",
    },
    {
        name: "Correo electrónico",
        subname: "",
        size: "single",
        type: "email",
        key: "email",
        required: true,
        placeholder: "correo@unicauca.edu.co",
        errorMessage: "Correo no válido",
    },
    {
        name: "Nombre completo",
        subname: "",
        size: "single",
        type: "text",
        key: "name",
        required: true,
        placeholder: "",
        errorMessage: "Introduce un nombre",
    },
    {
        name: "Cargo en la Universidad",
        subname: "",
        size: "select",
        type: "text",
        key: "role",
        required: true,
        placeholder: "Docente o Estudiante",
        errorMessage: "Selecciona una opción",
        options: ["student", "teacher", "directive", "admin"],
        showOptions: false,
        optionsLabels: ["Estudiante", "Docente", "Directivo", "Administrador"],
    }
];

//////////////////TRANSACCIONES//////////////////
export const initialapprobalTx = {
    phase: "",
    state: "",
    associatedLink: "",
    comments: ""
};

export const approbalTxFields: EditableField[] = [
    {
        name: "Fase",
        subname: "",
        size: "select",
        type: "text",
        key: "phase",
        required: true,
        placeholder: "",
        errorMessage: "Seleccione la fase del proceso a la que pertenece su documento",
        options: [],
        showOptions: true,
        readonly: true
    },
    {
        name: "Estado",
        subname: "",
        size: "select",
        type: "text",
        key: "state",
        required: true,
        placeholder: "estado del documento",
        errorMessage: "Selecciona una opción válida",
        options: documentStates.slice(1),
        showOptions: true
    },
    {
        name: "Documento asociado",
        subname: "",
        size: "reduced-link",
        type: "url",
        key: "associatedLink",
        required: true,
        placeholder: "link",
        errorMessage: "Selecciona un archivo"
    },
    {
        name: "Comentarios",
        subname: "",
        size: "text-area",
        type: "text",
        key: "comments",
        required: false,
        placeholder: "",
        errorMessage: "Error en los comentarios"
    },
];

////////////////PROCESSES AND PROGRAMS//////////////////

//Reutilizables Fields

const modalityField: EditableField = {
    name: "Modalidad",
    subname: "",
    size: "select",
    type: "text",
    key: "modality",
    required: false,
    placeholder: "",
    errorMessage: "Introduce una facultad válida",
    options: [//Incluir solo las posibles
        "Trabajo de Investigación",
        "Práctica Profesional",
        "Estudios de Profundización",
        "Exámenes preparatorios",
        "Actividad Proyectual",
        //   "Concierto de Grado"
    ],
    showOptions: true
};

export const initialProgram = {
    code: "INV1006",
    name: "Grado en Ingeniería Electrónica y Telecomunicaciones",
    modality: "Trabajo de Investigación",
    faculty: "Ingeniería Electrónica y Telecomunicaciones",
    mails: [
        {
            role: "Coordinador de programa",
            email: "mail@mail.edu.co"
        },
        {
            role: "Jefe de Departamento",
            email: "mail@mail.edu.co"
        },
        {
            role: "Consejo de Facultad",
            email: "mail@mail.edu.co"
        },
    ],
    phases: [
        {
            phasename: "Propuesta",
            format:
            {
                initial: ["Formato TI-A"],
                response: ["Formato TI-A Aprobado"]
            },
            initializer: "owner",
            responder: "Coordinador de programa",
            requireDocumentResponse: true,
            requireAsignation: false
        },
        {
            phasename: "Anteproyecto",
            format:
            {
                initial: ["Anteproyecto desarrollado"],
                evaluation: ["Formato TI-B"]
            },
            initializer: "owner",
            responder: "Jefe de Departamento",
            requireDocumentResponse: false,
            requireAsignation: true
        },
        {
            phasename: "Aprobación Anteproyecto",
            format:
            {
                initial: ["Formato TI-C"]
            },
            initializer: "Jefe de Departamento",
            responder: "Consejo de Facultad",
            requireDocumentResponse: true,
            requireAsignation: false
        },
        {
            phasename: "Trabajo de Grado",
            format:
            {
                initial: ["Monografia", "Anexos", "Paz y Salvos", "Formato TI-E"],
                response: ["Formato TI-F"],
                evaluation: ["Formato TI-G", "Formato TI-H"]
            },
            initializer: "owner",
            responder: "Consejo de Facultad",
            requireDocumentResponse: true,
            requireAsignation: true
        },// FINALIZA AQUI, EL ESTUDIANTE SUSTENTA Y LUEGO LE APRUEBAN
    ],
};

const mailsFields: EditableField[] = [
    {
        name: "Cargo del participante",
        subname: "",
        size: "single",
        type: "text",
        key: "role",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un cargo válido"
    },
    {
        name: "email del participante",
        subname: "",
        size: "single",
        type: "email",
        key: "email",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un email válido"
    },
];

const formatFields: EditableField[] = [
    {
        name: "Formatos de incio",
        subname: "Formato",
        size: "multiple",
        type: "text",
        key: "initial",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un nombre válido"
    },
    {
        name: "Formatos de respuesta",
        subname: "Formato",
        size: "multiple",
        type: "text",
        key: "response",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un nombre válido"
    },
    {
        name: "Formatos de Evaluación",
        subname: "Formato",
        size: "multiple",
        type: "text",
        key: "evaluation",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un nombre válido"
    },
];

const programPhasesFields: EditableField[] = [
    {
        name: "Nombre de la Fase",
        subname: "",
        size: "single",
        type: "text",
        key: "phasename",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un nombre válido"
    },
    {
        name: "Formatos asociados",
        subname: "Formato",
        size: "single",
        type: "text",
        key: "format",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un nombre válido",
        nestedFields: formatFields
    },
    {
        name: "Quien inicia",
        subname: "",
        size: "single",
        type: "text",
        key: "initializer",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un owner válido"
    },
    {
        name: "Quien recibe",
        subname: "",
        size: "single",
        type: "text",
        key: "responder",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un owner válido"
    },
    {
        name: "Requiere que se responda con doc",
        subname: "",
        size: "binary",
        type: "checkbox",
        key: "requireDocumentResponse",
        required: false,
        placeholder: "",
        errorMessage: "Selecciona false/true"
    },
    {
        name: "Requiere asignar evaluadores de fase",
        subname: "",
        size: "binary",
        type: "checkbox",
        key: "requireAsignation",
        required: false,
        placeholder: "",
        errorMessage: "Selecciona false/true"
    },
];

export const programFields: EditableField[] = [
    {
        name: "Codigo",
        subname: "",
        size: "single",
        type: "text",
        key: "code",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un código válido"
    },
    {
        name: "Nombre",
        subname: "",
        size: "single",
        type: "text",
        key: "name",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un nombre válido"
    },
    modalityField,
    {
        name: "Facultad",
        subname: "",
        size: "single",
        type: "text",
        key: "faculty",
        required: false,
        placeholder: "",
        errorMessage: "Introduce una facultad válida"
    },
    {
        name: "Correos asociados",
        subname: "Directivo",
        size: "multiple",
        type: "text",
        key: "mails",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un directivo válido",
        nestedFields: mailsFields
    },
    {
        name: "Fases",
        subname: "Fase",
        size: "multiple",
        type: "text",
        key: "phases",
        required: false,
        placeholder: "",
        errorMessage: "Introduce fases válidas",
        nestedFields: programPhasesFields
    },
];

export const initialAssignment = {
    owners: [""],
    contractTo: "",
    state: ""
};

export const assignmentFields: EditableField[] = [
    {
        name: "Evaluadores",
        subname: "email Evaluador",
        size: "multiple",
        type: "email",
        key: "owners",
        required: true,
        placeholder: "evaluador@unicauca.edu.co",
        errorMessage: "Introduce un correo válido"
    },
];

export const initialProcessIdentification = {
    processName: "",
    program: "",
    modality: ""
};

export const processIdentificationFields: EditableField[] = [
    {
        name: "Nombre del trabajo",
        subname: "",
        size: "single",
        type: "text",
        key: "processName",
        required: true,
        placeholder: "",
        errorMessage: "Introduce un nombre válido"
    },
    {
        name: "Programa",
        subname: "",
        size: "select",
        type: "text",
        key: "program",
        required: true,
        placeholder: "Selecciona una opción",
        errorMessage: "Selecciona una opción",
        options: [],
        optionsLabels: [],
        showOptions: true
    },
    modalityField
];

export const initialParticipants = {
    students: [""],
    director: "",
    codirector: ""
};

export const participantsFields: EditableField[] = [
    {
        name: "Estudiantes",
        subname: "email Estudiante",
        size: "multiple",
        type: "email",
        key: "students",
        required: true,
        placeholder: "estudiante@unicauca.edu.co",
        errorMessage: "Introduce un correo válido"
    },
    {
        name: "email Director",
        subname: "",
        size: "single",
        type: "email",
        key: "director",
        required: true,
        placeholder: "director@unicauca.edu.co",
        errorMessage: "Introduce un correo válido"
    },
    {
        name: "email Codirector",
        subname: "",
        size: "single",
        type: "email",
        key: "codirector",
        required: false,
        placeholder: "codirector@unicauca.edu.co",
        errorMessage: "Introduce un correo válido"
    },
];

export const initialNewProcess = { ...initialProcessIdentification, ...initialParticipants };

export const newProcessFields = processIdentificationFields.concat(participantsFields);

export const initialMyProcess = {
    address: "",
    process: "",
    state: ""
};

export const myProcessesFields: EditableField[] = processIdentificationFields.concat([
    {
        name: "Fase actual",
        subname: "",
        size: "select",
        type: "text",
        key: "state",
        required: false,
        placeholder: "",
        errorMessage: "Introduce un válido",
        options: documentStates,
        showOptions: true
    },
]);