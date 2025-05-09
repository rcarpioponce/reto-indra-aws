import { MySQLAppointmentRepository } from '../mysql-appointment.repository';
import { Appointment } from '../../../domain/entities/appointment';
import * as connectionModule from '../mysql-connection';

describe('MySQLAppointmentRepository', () => {
  let mockExecute: jest.Mock;
  let mockEnd: jest.Mock;
  let repo: MySQLAppointmentRepository;

  beforeEach(() => {
    mockExecute = jest.fn().mockResolvedValue(undefined);
    mockEnd = jest.fn().mockResolvedValue(undefined);

    jest.spyOn(connectionModule, 'getMySQLConnection').mockResolvedValue({
      execute: mockExecute,
      end: mockEnd,
    } as any);
  });

  it('debe guardar la cita correctamente en MySQL', async () => {
    const appointment: Appointment = {
      id: 'uuid-123',
      insuredId: '12345',
      scheduleId: 456,
    };

    repo = new MySQLAppointmentRepository('PE');
    await repo.save(appointment);

    expect(connectionModule.getMySQLConnection).toHaveBeenCalledWith('PE');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO appointments'),
      ['uuid-123', '12345', 456]
    );
    expect(mockEnd).toHaveBeenCalled();
  });
});
