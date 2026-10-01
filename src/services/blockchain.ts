import { BlockchainBlock, BlockchainTransaction } from '../types';

/**
 * Computes a standard cryptographic SHA-256 hash string for arbitrary text.
 * Uses browser Web Crypto API with high performance fallback.
 */
export async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  // Pure JavaScript SHA-256 implementation fallback
  return jsSha256(message);
}

// Synchronous SHA-256 helper for instantaneous calculations
export function syncSha256(message: string): string {
  return jsSha256(message);
}

function jsSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0;
  let j = 0;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let compositeClearHex = '';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    const c = ascii.charCodeAt(i);
    compositeClearHex += (c < 16 ? '0' : '') + c.toString(16);
  }

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);
    for (i = 0; i < 64; i++) {
      if (i >= 16) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1 + ch + k[i] + w[i]) | 0;
      const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0 + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Calculates Merkle Root for an array of transaction hashes
 */
export function calculateMerkleRoot(transactions: BlockchainTransaction[]): string {
  if (transactions.length === 0) {
    return '0000000000000000000000000000000000000000000000000000000000000000';
  }
  let hashes = transactions.map((t) => t.txHash);
  while (hashes.length > 1) {
    if (hashes.length % 2 !== 0) {
      hashes.push(hashes[hashes.length - 1]);
    }
    const newHashes: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      newHashes.push(syncSha256(hashes[i] + hashes[i + 1]));
    }
    hashes = newHashes;
  }
  return hashes[0];
}

/**
 * Calculates Block Hash based on index, previousHash, timestamp, merkleRoot, and nonce
 */
export function calculateBlockHash(
  blockIndex: number,
  previousHash: string,
  timestamp: string,
  merkleRoot: string,
  nonce: number
): string {
  const content = `${blockIndex}-${previousHash}-${timestamp}-${merkleRoot}-${nonce}`;
  return syncSha256(content);
}

/**
 * Mines a block with lightweight proof of work (difficulty: prefix "00")
 */
export function mineBlock(
  blockIndex: number,
  previousHash: string,
  transactions: BlockchainTransaction[],
  difficultyPrefix = '00'
): BlockchainBlock {
  const timestamp = new Date().toISOString();
  const merkleRoot = calculateMerkleRoot(transactions);
  let nonce = 0;
  let hash = '';

  // Proof of work search
  while (true) {
    hash = calculateBlockHash(blockIndex, previousHash, timestamp, merkleRoot, nonce);
    if (hash.startsWith(difficultyPrefix)) {
      break;
    }
    nonce++;
    if (nonce > 50000) {
      // Safety guard for instant client response
      break;
    }
  }

  return {
    blockIndex,
    timestamp,
    transactions,
    previousHash,
    currentHash: hash,
    nonce,
    merkleRoot,
    isGenesis: blockIndex === 0,
  };
}

export interface VerificationResult {
  isValid: boolean;
  totalBlocks: number;
  totalTransactions: number;
  failedBlockIndex?: number;
  failureReason?: string;
  verifiedAt: string;
}

/**
 * Verifies the integrity of the entire blockchain
 */
export function verifyBlockchainIntegrity(chain: BlockchainBlock[]): VerificationResult {
  const now = new Date().toISOString();
  if (!chain || chain.length === 0) {
    return {
      isValid: false,
      totalBlocks: 0,
      totalTransactions: 0,
      failureReason: 'Blockchain is empty.',
      verifiedAt: now,
    };
  }

  let totalTx = 0;

  for (let i = 0; i < chain.length; i++) {
    const current = chain[i];
    totalTx += current.transactions.length;

    // 1. Check Genesis Block
    if (i === 0) {
      if (current.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          isValid: false,
          totalBlocks: chain.length,
          totalTransactions: totalTx,
          failedBlockIndex: 0,
          failureReason: 'Genesis block previous hash is invalid (must be 64 zeros).',
          verifiedAt: now,
        };
      }
    } else {
      // 2. Check previous hash pointer
      const previous = chain[i - 1];
      if (current.previousHash !== previous.currentHash) {
        return {
          isValid: false,
          totalBlocks: chain.length,
          totalTransactions: totalTx,
          failedBlockIndex: current.blockIndex,
          failureReason: `Broken Hash Link: Block #${current.blockIndex} previousHash (${current.previousHash.slice(0, 10)}...) does not match Block #${previous.blockIndex} currentHash (${previous.currentHash.slice(0, 10)}...).`,
          verifiedAt: now,
        };
      }
    }

    // 3. Recalculate and verify Merkle root
    const recalculatedMerkle = calculateMerkleRoot(current.transactions);
    if (recalculatedMerkle !== current.merkleRoot) {
      return {
        isValid: false,
        totalBlocks: chain.length,
        totalTransactions: totalTx,
        failedBlockIndex: current.blockIndex,
        failureReason: `Merkle Root Mismatch: Transactions in Block #${current.blockIndex} have been altered or tampered with.`,
        verifiedAt: now,
      };
    }

    // 4. Recalculate block hash
    const expectedHash = calculateBlockHash(
      current.blockIndex,
      current.previousHash,
      current.timestamp,
      current.merkleRoot,
      current.nonce
    );

    if (expectedHash !== current.currentHash) {
      return {
        isValid: false,
        totalBlocks: chain.length,
        totalTransactions: totalTx,
        failedBlockIndex: current.blockIndex,
        failureReason: `Cryptographic Hash Failure: Recalculated hash (${expectedHash.slice(0, 12)}...) differs from recorded block hash (${current.currentHash.slice(0, 12)}...).`,
        verifiedAt: now,
      };
    }
  }

  return {
    isValid: true,
    totalBlocks: chain.length,
    totalTransactions: totalTx,
    verifiedAt: now,
  };
}
