import { NextResponse } from "next/server";
import { EmailTemplate } from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const {
      notificationOption,
      email,
      firstName,
      uploadDate,
      documentLink,
      documentTitle,
      documentType,
      uploadedBy
    } = await req.json();

    const data = await resend.emails.send({
      from: "SG - Docs <onboarding@gdocumentalunicauca.com>",
      to: [email], // Aquí va el correo que se recibe como parámetro
      subject: "Notificación G. Documental",
      react: EmailTemplate({
        notificationOption,
        firstName,
        documentTitle,
        documentLink,
        uploadDate,
        documentType,
        uploadedBy
      }), // Aquí va el nombre recibido como parámetro
      text: "",
    });

    console.log(data);

    return NextResponse.json({ message: 'Email sent' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error });
  }
}