export const parseSnsMessage = (sns: { Message: string }): any => {
  try {
    return JSON.parse(sns.Message);
  } catch (error) {
    console.error('Error parsing SNS message', error);
    return null;
  }
};
