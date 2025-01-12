# City Builder Multiplayer Implementation Guide

## Overview
This guide explains how to implement secure multiplayer functionality in the City Builder game using encrypted transactions and WebSocket communication.

## Transaction System

### Turn Transaction Structure
```typescript
interface TurnTransaction {
  turn: number;        // Current turn number
  phase: GamePhase;    // Current game phase
  grid: Cell[][];      // Complete grid state
  timestamp: number;   // Transaction creation time
  previousHash: string; // Hash of previous transaction
}
```

### Security Features
1. **Transaction Chain**
   - Each transaction links to the previous one via hash
   - Ensures game state integrity
   - Prevents replay attacks
   - Detects tampering

2. **Encryption**
   - All transactions are encrypted before transmission
   - Prevents man-in-the-middle attacks
   - Ensures data privacy

## Implementation Steps

### 1. WebSocket Setup
```typescript
// websocketUtils.ts
export class GameWebSocket {
  private ws: WebSocket;
  private gameId: string;
  private playerId: string;

  constructor(gameId: string, playerId: string) {
    this.ws = new WebSocket(`wss://your-server.com/game/${gameId}`);
    this.gameId = gameId;
    this.playerId = playerId;
    this.setupListeners();
  }

  private setupListeners() {
    this.ws.onmessage = (event) => {
      const transaction = verifyAndDecryptTransaction(
        event.data,
        this.lastTransactionHash
      );
      if (transaction) {
        this.handleTransaction(transaction);
      }
    };
  }

  sendTransaction(transaction: string) {
    this.ws.send(JSON.stringify({
      type: 'TURN_TRANSACTION',
      gameId: this.gameId,
      playerId: this.playerId,
      data: transaction
    }));
  }
}
```

### 2. Game State Synchronization
```typescript
// gameSync.ts
export class GameSync {
  private transactions: string[] = [];
  private ws: GameWebSocket;

  async syncState(currentState: GameState, grid: Cell[][]) {
    const transaction = createTurnTransaction(
      currentState,
      grid,
      this.getLastTransactionHash()
    );
    
    this.transactions.push(transaction);
    await this.ws.sendTransaction(transaction);
  }

  private getLastTransactionHash(): string {
    return this.transactions[this.transactions.length - 1] || '';
  }
}
```

### 3. Security Implementation

#### Production-Grade Encryption
```typescript
// securityUtils.ts
import { AES, enc } from 'crypto-js';

export function encryptTransaction(data: string, key: string): string {
  return AES.encrypt(data, key).toString();
}

export function decryptTransaction(encrypted: string, key: string): string {
  const bytes = AES.decrypt(encrypted, key);
  return bytes.toString(enc.Utf8);
}
```

#### Secure Key Exchange
```typescript
// keyExchange.ts
export async function establishSecureConnection(
  gameId: string,
  playerId: string
): Promise<string> {
  // Implement Diffie-Hellman key exchange
  const keyPair = await generateKeyPair();
  const publicKey = await exportPublicKey(keyPair.publicKey);
  
  // Exchange public keys via WebSocket
  return deriveSharedSecret(keyPair.privateKey, otherPublicKey);
}
```

## Usage Example

```typescript
// gameController.ts
export class GameController {
  private gameSync: GameSync;
  private gameState: GameState;
  private grid: Cell[][];

  async handleTurnEnd() {
    // Create and send transaction
    await this.gameSync.syncState(this.gameState, this.grid);
    
    // Wait for other player's move
    this.setWaitingState(true);
  }

  private handleIncomingTransaction(transaction: TurnTransaction) {
    if (this.verifyTransaction(transaction)) {
      this.updateGameState(transaction);
      this.setWaitingState(false);
    }
  }
}
```

## Error Handling

### Network Issues
```typescript
export class ConnectionManager {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async handleDisconnect() {
    while (this.reconnectAttempts < this.maxReconnectAttempts) {
      try {
        await this.reconnect();
        return true;
      } catch (error) {
        this.reconnectAttempts++;
        await new Promise(resolve => 
          setTimeout(resolve, this.getBackoffTime())
        );
      }
    }
    return false;
  }
}
```

### Transaction Verification Failures
```typescript
export function handleTransactionError(
  transaction: TurnTransaction,
  expectedHash: string
): void {
  // Log error details
  console.error('Transaction verification failed', {
    turn: transaction.turn,
    expectedHash,
    actualHash: generateHash(transaction)
  });

  // Request state resync
  requestStateResync(transaction.turn - 1);
}
```

## Best Practices

1. **State Management**
   - Keep transaction history for verification
   - Implement state rollback capability
   - Regular state validation checks

2. **Network Optimization**
   - Compress transaction data
   - Implement rate limiting
   - Handle reconnection gracefully

3. **Security**
   - Use proper encryption in production
   - Implement server-side validation
   - Regular security audits

4. **Testing**
   - Test network latency scenarios
   - Verify transaction chain integrity
   - Test reconnection handling

## Deployment Considerations

1. **Server Requirements**
   - WebSocket support
   - Sufficient bandwidth
   - Low latency

2. **Scaling**
   - Multiple game room support
   - Load balancing
   - State persistence

3. **Monitoring**
   - Transaction success rate
   - Network performance
   - Error tracking