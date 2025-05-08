import AWS from "aws-sdk";

const eventBridge = new AWS.EventBridge();

interface PublishEventParams {
  source: string;
  detailType: string;
  detail: Record<string, any>;
}

export const publishEvent = async ({
  source,
  detailType,
  detail,
}: PublishEventParams): Promise<void> => {
  const params: AWS.EventBridge.Types.PutEventsRequest = {
    Entries: [
      {
        EventBusName: process.env.EVENT_BUS_NAME,
        Source: source,
        DetailType: detailType,
        Detail: JSON.stringify(detail),
      },
    ],
  };

  try {
    const result = await eventBridge.putEvents(params).promise();
    console.log("Evento enviado a EventBridge:", result);
  } catch (error) {
    console.error("Error al enviar evento a EventBridge:", error);
    throw error;
  }
};
