import React, { useState } from 'react';
import {
  Boxes,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowRight,
  Hash,
  Clock,
  Key,
  Database,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { verifyBlockchainIntegrity, VerificationResult } from '../services/blockchain';
import { BlockchainBlock } from '../types';

interface BlockchainExplorerProps {
  onSelectBatch?: (batchId: string) => void;
}

export const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({ onSelectBatch }) => {
  const [chain, setChain] = useState<BlockchainBlock[]>(honeyChainStore.getBlockchain());
  const [isTampered, setIsTampered] = useState<boolean>(honeyChainStore.getIsTamperedForDemo());
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    return honeyChainStore.subscribe(() => {
      setChain([...honeyChainStore.getBlockchain()]);
      setIsTampered(honeyChainStore.getIsTamperedForDemo());
    });
  }, []);

  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyBlockchainIntegrity(chain);
      setVerificationResult(res);
      setIsVerifying(false);
    }, 400);
  };

  const handleTamperDemo = () => {
    if (chain.length > 2) {
      honeyChainStore.tamperBlockForDemo(2);
      // Auto re-run verification to show the failure
      setTimeout(() => {
        const updated = honeyChainStore.getBlockchain();
        setVerificationResult(verifyBlockchainIntegrity(updated));
        setSelectedBlockIndex(2);
      }, 100);
    }
  };

  const handleRestoreLedger = () => {
    honeyChainStore.restoreBlockchainFromTamper();
    setTimeout(() => {
      const updated = honeyChainStore.getBlockchain();
      setVerificationResult(verifyBlockchainIntegrity(updated));
    }, 100);
  };

  const filteredBlocks = chain.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.blockIndex.toString().includes(term) ||
      b.currentHash.toLowerCase().includes(term) ||
      b.previousHash.toLowerCase().includes(term) ||
      b.transactions.some(
        (tx) =>
          tx.batchId.toLowerCase().includes(term) ||
          tx.actorName.toLowerCase().includes(term) ||
          tx.payloadSummary.toLowerCase().includes(term)
      )
    );
  });

  const activeBlock = chain[selectedBlockIndex] || chain[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Boxes className="w-3.5 h-3.5" />
            <span>Distributed Ledger Protocol (Academic Consensus Simulation)</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Honey Chain Blockchain Explorer
          </h1>
          <p className="text-stone-400 text-sm">
            Inspect immutable cryptographic blocks anchoring every honey batch from harvesting to consumer delivery.
            Every block verifies parent hash pointers, Merkle tree roots, and proof-of-work nonces.
          </p>
        </div>

        {/* Verification and Demonstration Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={handleVerifyLedger}
            disabled={isVerifying}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Recalculating Hashes...' : 'Verify Blockchain Integrity'}</span>
          </button>

          {!isTampered ? (
            <button
              onClick={handleTamperDemo}
              className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-rose-950/40 text-rose-300 border border-rose-900/60 hover:border-rose-500 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
              title="Demonstrates how cryptographic verification detects unauthorized alteration for college viva"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Simulate Attacker Tampering</span>
            </button>
          ) : (
            <button
              onClick={handleRestoreLedger}
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restore Legitimate Ledger</span>
            </button>
          )}
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div
          className={`rounded-2xl p-5 border text-xs sm:text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            verificationResult.isValid
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-base">
                {verificationResult.isValid
                  ? '✓ Blockchain Integrity Verified'
                  : '✗ Blockchain Integrity Failed (Tamper Detected)'}
              </div>
              <p className="text-xs mt-0.5">
                {verificationResult.isValid
                  ? `All ${verificationResult.totalBlocks} blocks, previous hashes, Merkle roots, and ${verificationResult.totalTransactions} transactions are mathematically valid.`
                  : verificationResult.failureReason}
              </p>
            </div>
          </div>
          <div className="text-right text-xs opacity-75 font-mono shrink-0">
            Verified at {new Date(verificationResult.verifiedAt).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Blockchain Node Horizontal Graph Visualization */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-stone-900">
              Visual Cryptographic Chain Architecture
            </h2>
            <p className="text-xs text-stone-500">
              Click any block to inspect its transaction Merkle tree, nonce, and hash linkage.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">Height: {chain.length} Blocks</span>
        </div>

        {/* Scrollable Blocks Chain */}
        <div className="overflow-x-auto pb-4 pt-1">
          <div className="flex items-center gap-3 min-w-max">
            {chain.map((blk, idx) => {
              const isSelected = selectedBlockIndex === blk.blockIndex;
              const isFailedBlock =
                verificationResult &&
                !verificationResult.isValid &&
                verificationResult.failedBlockIndex === blk.blockIndex;

              return (
                <React.Fragment key={blk.blockIndex}>
                  <button
                    onClick={() => setSelectedBlockIndex(blk.blockIndex)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer w-56 flex flex-col justify-between ${
                      isFailedBlock
                        ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-400'
                        : isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-400'
                        : 'bg-white border-stone-200 hover:border-amber-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-extrabold text-xs text-stone-900">
                          {blk.isGenesis ? 'Genesis Block #0' : `Block #${blk.blockIndex}`}
                        </span>
                        {isFailedBlock ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Tampered
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Valid
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-stone-500 truncate mb-1">
                        Hash: {blk.currentHash.slice(0, 14)}...
                      </div>
                      <div className="text-[11px] font-mono text-stone-400 truncate mb-2">
                        Prev: {blk.previousHash.slice(0, 14)}...
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                      <span>{blk.transactions.length} Tx</span>
                      <span className="font-mono text-stone-400">Nonce: {blk.nonce}</span>
                    </div>
                  </button>

                  {idx < chain.length - 1 && (
                    <div className="flex items-center text-amber-500 shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Block Detailed Inspector */}
      {activeBlock && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-stone-900">
                  Block Inspector #{activeBlock.blockIndex}
                </span>
                {activeBlock.isGenesis && (
                  <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    Protocol Genesis
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-mono">
                Mined: {new Date(activeBlock.timestamp).toUTCString()} · Merkle Root Verified
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-500">
                Proof-of-Work Nonce:{' '}
                <strong className="text-stone-900 font-mono">{activeBlock.nonce}</strong>
              </span>
            </div>
          </div>

          {/* Cryptographic Hashes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-500 font-sans font-semibold">
                <Hash className="w-3.5 h-3.5 text-amber-600" />
                <span>Current Block SHA-256 Hash</span>
              </div>
              <div className="text-stone-900 break-all select-all font-bold">
                {activeBlock.currentHash}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-500 font-sans font-semibold">
                <Hash className="w-3.5 h-3.5 text-stone-400" />
                <span>Previous Block SHA-256 Hash (Chain Pointer)</span>
              </div>
              <div className="text-stone-900 break-all select-all">
                {activeBlock.previousHash}
              </div>
            </div>
          </div>

          {/* Merkle Root */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-stone-500 font-sans font-semibold">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Transaction Merkle Tree Root</span>
            </div>
            <div className="text-stone-900 break-all select-all">
              {activeBlock.merkleRoot}
            </div>
          </div>

          {/* Transactions Enclosed in this Block */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-stone-900 text-sm">
              Enclosed Transactions ({activeBlock.transactions.length})
            </h3>

            <div className="space-y-3">
              {activeBlock.transactions.map((tx) => (
                <div
                  key={tx.txId}
                  className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 transition-colors space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 font-mono">{tx.txId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {tx.action}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-stone-500">
                      <span>Actor: <strong>{tx.actorName}</strong> ({tx.actorRole})</span>
                      <span>·</span>
                      <span className="font-mono">{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-stone-700 leading-relaxed font-sans">{tx.payloadSummary}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-stone-500 font-mono">
                    <div className="flex items-center gap-2">
                      <span>Tx Hash:</span>
                      <span className="text-stone-800 select-all">{tx.txHash.slice(0, 24)}...</span>
                    </div>

                    {tx.batchId && tx.batchId !== 'SYSTEM-GENESIS' && onSelectBatch && (
                      <button
                        onClick={() => onSelectBatch(tx.batchId)}
                        className="text-amber-700 hover:text-amber-800 font-sans font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Trace Batch {tx.batchId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
