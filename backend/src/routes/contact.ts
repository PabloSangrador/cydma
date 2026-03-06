import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Resend } from "resend";
import { ContactFormSchema } from "../types";
import { env } from "../env";

const contactRouter = new Hono();

const ASUNTO_LABELS: Record<string, string> = {
  presupuesto: "Solicitud de presupuesto",
  catalogo: "Información del catálogo",
  contract: "Proyecto Contract",
  export: "Exportación internacional",
  otro: "Otro",
};

contactRouter.post(
  "/",
  zValidator("json", ContactFormSchema),
  async (c) => {
    const data = c.req.valid("json");

    if (!env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return c.json(
        { error: { message: "Servicio de email no configurado", code: "EMAIL_NOT_CONFIGURED" } },
        500
      );
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const asuntoLabel = ASUNTO_LABELS[data.asunto] ?? data.asunto;
    const subject = `[Web CYDMA] ${asuntoLabel} – ${data.nombre} ${data.apellidos}`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#3d1f0a;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#c8924a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Nuevo mensaje desde la web</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:400;font-family:Georgia,serif;">${asuntoLabel}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <!-- Contact info grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:10px;color:#999;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">Nombre</p>
                    <p style="margin:0;font-size:15px;color:#1a1008;font-weight:500;">${data.nombre} ${data.apellidos}</p>
                  </td>
                  <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:10px;color:#999;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">Email</p>
                    <p style="margin:0;font-size:15px;color:#1a1008;">
                      <a href="mailto:${data.email}" style="color:#c8924a;text-decoration:none;">${data.email}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:10px;color:#999;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">Teléfono</p>
                    <p style="margin:0;font-size:15px;color:#1a1008;">${data.telefono ? `<a href="tel:${data.telefono}" style="color:#c8924a;text-decoration:none;">${data.telefono}</a>` : "—"}</p>
                  </td>
                  <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:10px;color:#999;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">Empresa</p>
                    <p style="margin:0;font-size:15px;color:#1a1008;">${data.empresa || "—"}</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:linear-gradient(to right,transparent,#e8ddd0,transparent);margin-bottom:28px;"></div>

              <!-- Mensaje -->
              <p style="margin:0 0 8px;font-size:10px;color:#999;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">Mensaje</p>
              <div style="background:#faf7f4;border-left:3px solid #c8924a;border-radius:0 8px 8px 0;padding:20px 24px;">
                <p style="margin:0;font-size:15px;color:#2d1a08;line-height:1.7;white-space:pre-wrap;">${data.mensaje}</p>
              </div>

              <!-- CTA -->
              <div style="margin-top:32px;text-align:center;">
                <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(asuntoLabel)}" style="display:inline-block;background:#c8924a;color:#ffffff;font-size:14px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
                  Responder a ${data.nombre}
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf7f4;padding:20px 40px;border-top:1px solid #ede6df;text-align:center;">
              <p style="margin:0;font-size:11px;color:#bbb;">Este mensaje fue enviado desde el formulario de contacto de <strong style="color:#999;">cydma.es</strong></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: "CYDMA Web <noreply@cydma.es>",
      to: ["info@cydma.es"],
      replyTo: data.email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return c.json(
        { error: { message: "Error al enviar el email. Inténtelo de nuevo.", code: "EMAIL_SEND_ERROR" } },
        500
      );
    }

    return c.json({ data: { success: true } });
  }
);

export { contactRouter };
