const META_API_VERSION = "v20.0";

const sendWhatsappMessage = async ({ to, message, templateParams = [] }) => {
  const apiKey = process.env.WHATSAPP_TOKEN || process.env.META_API_KEY;
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "otp_verification";
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "fr";

  if (!apiKey) {
    return { sent: false, reason: "missing_whatsapp_token" };
  }

  if (!phoneNumberId) {
    return { sent: false, reason: "missing_whatsapp_phone_number_id" };
  }

  if (!to) {
    return { sent: false, reason: "missing_data" };
  }

  const hasTemplateParams =
    Array.isArray(templateParams) && templateParams.length > 0;

  const payload = hasTemplateParams
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components: [
            {
              type: "body",
              parameters: templateParams.map((value) => ({
                type: "text",
                text: String(value),
              })),
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message || "" },
      };

  const response = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const rawError = await response.text();
    throw new Error(`WhatsApp API error (${response.status}): ${rawError}`);
  }

  return { sent: true };
};

module.exports = sendWhatsappMessage;
