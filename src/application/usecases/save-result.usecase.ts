import { IResultRepository } from "../../domain/repositories/i-result-repository";
import { AppointmentResult } from "../../domain/models/appointment-result";

export class SaveResultUseCase {
  constructor(private readonly repository: IResultRepository) {}

  async execute(result: AppointmentResult): Promise<void> {
    await this.repository.save(result);
  }
}
