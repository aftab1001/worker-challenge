import axios from 'axios';
import { ApiClient } from '../../../src/lib/http/ApiClient';

jest.mock('axios');

describe('ApiClient', () => {
  it('should collect data successfully', async () => {
    const mockData = 'value=1\nvalue=2\nvalue=3';
    (axios.get as jest.Mocked<any>).mockResolvedValue({ data: mockData });

    const apiClient = new ApiClient();
    const result = await apiClient.collectData(1);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle error when collecting data', async () => {
    const mockError = 'error collecting data';
    (axios.get as jest.Mocked<any>).mockRejectedValue(mockError);

    const apiClient = new ApiClient();
    const result = await apiClient.collectData(1);
    expect(result).toEqual([]);
  });
});
