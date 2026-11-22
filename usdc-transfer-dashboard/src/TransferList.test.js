import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TransferList, { GET_TRANSFERS } from './TransferList';

const mocks = [
  {
    request: { query: GET_TRANSFERS },
    result: {
      data: {
        transfers: [
          {
            __typename: 'Transfer',
            from: '0x1111111111111111111111111111111111111111',
            to: '0x2222222222222222222222222222222222222222',
            value: '1234500000000000000000', // 1,234.5 tokens with 18 decimals
            blockTimestamp: '1731168000',
          },
        ],
      },
    },
  },
];

test('lists a transfer with its amount in tokens', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <TransferList />
    </MockedProvider>
  );

  expect(await screen.findByText(/1,234\.5 USDC/)).toBeInTheDocument();
});
