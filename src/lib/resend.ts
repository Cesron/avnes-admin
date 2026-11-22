function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const appUrl = URL.parse(process.env.BETTER_AUTH_URL?.trim() ?? "");

  if (
    !apiKey ||
    !from ||
    !appUrl ||
    !["http:", "https:"].includes(appUrl.protocol)
  ) {
    return null;
  }

  return { apiKey, from, origin: appUrl.origin };
}

export function isPasswordResetEmailConfigured() {
  return getResendConfig() !== null;
}

export async function sendPasswordResetEmail(email: string, url: string) {
  const config = getResendConfig();

  if (!config || config.origin !== new URL(url).origin) {
    console.error(
      "Revisa BETTER_AUTH_URL, RESEND_API_KEY y RESEND_FROM_EMAIL para enviar correos de recuperación.",
    );
    return;
  }

  const link = url.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const instructions =
    "Usa este enlace para elegir una nueva contraseña. El enlace vence en 30 minutos y solo se puede usar una vez.";
  const footer = "Si no solicitaste el cambio, puedes ignorar este correo.";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [email],
        subject: "Restablece tu contraseña de AVNES",
        html: `<p>${instructions}</p><p><a href="${link}">Restablecer contraseña</a></p><p>${footer}</p>`,
        text: `${instructions}\n\n${url}\n\n${footer}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(
        `Resend rechazó el correo de recuperación (HTTP ${response.status}).`,
      );
    }
  } catch {
    console.error(
      "No se pudo conectar con Resend para enviar el correo de recuperación.",
    );
  }
}
