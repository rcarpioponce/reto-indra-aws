import { processEvent } from '../process-event';
import { AppointmentResult } from '../../../domain/models/appointment-result';

describe('processEvent', () => {
  const baseResult: AppointmentResult = {
    id: 'uuid-123',
    insuredId: '12345',
    scheduleId: 456,
    countryISO: 'PE',
    status: 'SUCCESS',
  };

  it('convierte un resultado SUCCESS en una cita con status "completed"', () => {
    const appointment = processEvent(baseResult);

    expect(appointment).toMatchObject({
      id: 'uuid-123',
      insuredId: '12345',
      scheduleId: 456,
      countryISO: 'PE',
      status: 'completed',
    });

    expect(typeof appointment.createdAt).toBe('string');
  });

  it('convierte un resultado FAILURE en una cita con status "pending"', () => {
    const failedResult: AppointmentResult = {
      ...baseResult,
      status: 'FAILURE',
    };

    const appointment = processEvent(failedResult);

    expect(appointment.status).toBe('pending');
  });
});
