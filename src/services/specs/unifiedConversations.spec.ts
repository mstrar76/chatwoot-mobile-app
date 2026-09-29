import axios from 'axios';
import { fetchUnifiedConversations } from '../unifiedConversations';
import { defaultFilterState } from '@/store/conversation/conversationFilterSlice';
import type { StoredSession } from '@/store/sessions/sessionsSlice';

jest.mock('axios');
const mockedGet = axios.get as jest.Mock;

const session = (host: string, accounts: { id: number; name: string }[]): StoredSession =>
  ({
    id: `${host}#1`,
    baseUrl: host,
    installationUrl: `https://${host}/`,
    webSocketUrl: `wss://${host}/cable`,
    headers: { 'access-token': `tok-${host}`, uid: 'u', client: 'c' },
    user: { id: 1, accounts },
  }) as unknown as StoredSession;

const listResponse = (items: { id: number; last_activity_at: number }[]) => ({
  data: { data: { meta: {}, payload: items } },
});

describe('fetchUnifiedConversations', () => {
  beforeEach(() => mockedGet.mockReset());

  it('merges every account of every installation, newest first, with its own credentials', async () => {
    mockedGet.mockImplementation((url: string) => {
      if (url === 'https://a.example.com/api/v1/accounts/1/conversations') {
        return Promise.resolve(listResponse([{ id: 10, last_activity_at: 100 }]));
      }
      if (url === 'https://b.example.com/api/v1/accounts/7/conversations') {
        return Promise.resolve(listResponse([{ id: 20, last_activity_at: 300 }]));
      }
      return Promise.reject(new Error('unexpected ' + url));
    });

    const result = await fetchUnifiedConversations(
      [
        session('a.example.com', [{ id: 1, name: 'iTelas' }]),
        session('b.example.com', [{ id: 7, name: 'IonCert' }]),
      ],
      defaultFilterState,
    );

    expect(result.conversations.map(c => [c.accountName, c.conversation.id])).toEqual([
      ['IonCert', 20],
      ['iTelas', 10],
    ]);
    expect(mockedGet.mock.calls[1][1].headers['access-token']).toBe('tok-b.example.com');
    expect(result.failedAccounts).toEqual([]);
  });

  it('reports accounts that fail without dropping the others', async () => {
    mockedGet
      .mockResolvedValueOnce(listResponse([{ id: 10, last_activity_at: 100 }]))
      .mockRejectedValueOnce(new Error('offline'));

    const result = await fetchUnifiedConversations(
      [
        session('a.example.com', [
          { id: 1, name: 'iTelas' },
          { id: 2, name: 'AqueceBem' },
        ]),
      ],
      defaultFilterState,
    );

    expect(result.conversations).toHaveLength(1);
    expect(result.failedAccounts).toEqual(['AqueceBem']);
  });
});
