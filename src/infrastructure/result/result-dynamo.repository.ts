import AWS from "aws-sdk";
import { IResultRepository } from "../../domain/repositories/i-result-repository";
import { AppointmentResult } from "../../domain/models/appointment-result";

export class ResultDynamoRepository implements IResultRepository {
  private readonly client: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.client = new AWS.DynamoDB.DocumentClient();
    this.tableName = process.env.DYNAMODB_TABLE!;
  }

  async save(result: AppointmentResult): Promise<void> {
    await this.client
      .put({
        TableName: this.tableName,
        Item: result,
      })
      .promise();
  }
}
