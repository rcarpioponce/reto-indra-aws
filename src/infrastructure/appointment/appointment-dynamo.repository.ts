import AWS from "aws-sdk";
import { IAppointmentRepository } from "../../domain/repositories/i-appointment-repository";
import { Appointment } from "../../domain/models/appointment";

export class AppointmentDynamoRepository implements IAppointmentRepository {
  private readonly client: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.client = new AWS.DynamoDB.DocumentClient();
    this.tableName = process.env.DYNAMODB_TABLE!;
  }

  async save(appointment: Appointment): Promise<void> {
    await this.client
      .put({
        TableName: this.tableName,
        Item: appointment,
      })
      .promise();
  }

  async updateStatus(appointment: Appointment): Promise<void> {
    // Check all fields exist before updating
    if (!appointment.id) {
      throw new Error("Appointment ID is required for update");
    }

    try {
      // Using only the id as the key for now, but adding logging to debug
      console.log(`Updating appointment with id: ${appointment.id}`);
      console.log(`Full appointment data:`, JSON.stringify(appointment));
      
      await this.client
        .update({
          TableName: this.tableName,
          Key: {
            id: appointment.id,
          },
          UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": appointment.status,
            ":updatedAt": new Date().toISOString(),
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const result = await this.client
      .query({
        TableName: this.tableName,
        IndexName: "insuredId-index",
        KeyConditionExpression: "insuredId = :insuredId",
        ExpressionAttributeValues: {
          ":insuredId": insuredId,
        },
      })
      .promise();
  
    return (result.Items ?? []) as Appointment[];
  }  
  
}
