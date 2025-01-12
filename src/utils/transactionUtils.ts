import { Cell, GameState } from '../types';

interface TurnTransaction {
  turn: number;
  phase: GameState['phase'];
  grid: Cell[][];
  timestamp: number;
  previousHash: string;
}

export function createTurnTransaction(
  gameState: GameState,
  grid: Cell[][],
  previousHash: string = ''
): string {
  const transaction: TurnTransaction = {
    turn: gameState.turn,
    phase: gameState.phase,
    grid,
    timestamp: Date.now(),
    previousHash
  };

  // Convert transaction to string and encrypt
  const transactionString = JSON.stringify(transaction);
  return encryptTransaction(transactionString);
}

export function verifyAndDecryptTransaction(
  encryptedTransaction: string,
  expectedPreviousHash: string
): TurnTransaction | null {
  try {
    // Decrypt the transaction
    const decryptedString = decryptTransaction(encryptedTransaction);
    const transaction: TurnTransaction = JSON.parse(decryptedString);

    // Verify the chain by checking previous hash
    if (transaction.previousHash !== expectedPreviousHash) {
      console.error('Transaction chain broken - invalid previous hash');
      return null;
    }

    return transaction;
  } catch (error) {
    console.error('Failed to decrypt or verify transaction:', error);
    return null;
  }
}

// Simple encryption using Base64 (for demo purposes)
// In production, use a proper encryption library like crypto-js
function encryptTransaction(data: string): string {
  return btoa(data);
}

function decryptTransaction(encrypted: string): string {
  return atob(encrypted);
}

// Generate hash for transaction verification
export function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}