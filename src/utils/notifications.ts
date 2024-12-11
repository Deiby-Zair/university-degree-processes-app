import { EmailTemplateProps } from "@/components/EmailTemplate";

interface NotificationProps extends EmailTemplateProps {
    email: string,
}

export const handleSendEmail = async () => {

    const email = "mailm@mail.edu.co"; // Correo hardcodeado
    const name = "Usuario"; // Nombre hardcodeado

    const res = await fetch("/api/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }), // Enviamos el correo y nombre hardcodeado
    });

    const data = await res.json();
    console.log(data);
};

export const sendNotificationToUser = async (
    {
        notificationOption,
        email,
        firstName,
        documentTitle,
        uploadDate,
        uploadedBy,
        documentType,
        documentLink,
    }: NotificationProps) => {
    const res = await fetch("/api/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            notificationOption,
            email,
            firstName,
            uploadDate,
            documentLink,
            documentTitle,
            documentType,
            uploadedBy
        }),
    });

    const data = await res.json();
    console.log(data)
}