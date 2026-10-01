import React, { useState } from 'react';
import {
  Database,
  Copy,
  Download,
  Check,
  Table,
  Key,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { generateMySQLDDL, MYSQL_SCHEMA_TABLES, SchemaTable } from '../services/mysqlSchema';

export const DatabaseSchemaView: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<SchemaTable>(MYSQL_SCHEMA_TABLES[0]);
  const [copied, setCopied] = useState(false);
  const ddlScript = generateMySQLDDL();

  const handleCopyDDL = () => {
    navigator.clipboard.writeText(ddlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([ddlScript], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'honey_chain_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Relational MySQL 8.0+ Schema & DDL Specification</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Relational Database Design
          </h1>
          <p className="text-stone-400 text-sm max-w-xl">
            Fully normalized 3NF relational schema consisting of 16 structured tables with primary keys,
            foreign key constraints, composite indexes, and timestamp triggers.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyDDL}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'DDL Copied!' : 'Copy SQL Script'}</span>
          </button>
          <button
            onClick={handleDownloadSQL}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-md shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download .sql File</span>
          </button>
        </div>
      </div>

      {/* College Project / Zero-Config Demo Mode Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold">
            💡
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              College Project &amp; Demo Mode: Zero Database Setup Required
            </h4>
            <p className="text-stone-600 text-xs mt-0.5">
              The application runs fully in browser mode with automatic localStorage persistence.
              No MySQL server, background daemons, or database connection strings are required to run <code className="font-mono bg-amber-100/70 px-1.5 py-0.5 rounded text-amber-900">npm run dev</code>.
              The 16 relational tables and downloadable DDL below represent the production database architecture for project viva and thesis submission.
            </p>
          </div>
        </div>
      </div>

      {/* Main Schema Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 16 Tables Navigation List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-display text-base font-bold text-stone-900">
              Tables in Database ({MYSQL_SCHEMA_TABLES.length})
            </h2>
            <span className="text-[10px] text-stone-500 font-mono">Engine: InnoDB</span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {MYSQL_SCHEMA_TABLES.map((t) => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                  selectedTable.name === t.name
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Table className="w-3.5 h-3.5 opacity-70" />
                  <span className="font-mono">{t.name}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">
                  {t.columns.length} cols
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Table Column Inspector */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="border-b border-stone-100 pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold text-amber-700">
                  table `{selectedTable.name}`
                </span>
              </div>
              <span className="text-xs font-mono text-stone-500">
                {selectedTable.columns.length} Fields Defined
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedTable.description}
            </p>
          </div>

          {/* Table Columns Detail */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Column Name</th>
                  <th className="px-4 py-2.5 font-semibold">Data Type</th>
                  <th className="px-4 py-2.5 font-semibold">Key</th>
                  <th className="px-4 py-2.5 font-semibold">Nullable</th>
                  <th className="px-4 py-2.5 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {selectedTable.columns.map((c) => (
                  <tr key={c.name} className="hover:bg-amber-50/20">
                    <td className="px-4 py-3 font-mono font-bold text-stone-900">{c.name}</td>
                    <td className="px-4 py-3 font-mono text-amber-800">{c.type}</td>
                    <td className="px-4 py-3">
                      {c.key === 'PK' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-900">
                          PK
                        </span>
                      )}
                      {c.key === 'FK' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                          FK
                        </span>
                      )}
                      {c.key === 'UK' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">
                          UK
                        </span>
                      )}
                      {!c.key && <span className="text-stone-300">-</span>}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {c.nullable ? 'YES' : 'NO'}
                    </td>
                    <td className="px-4 py-3 text-stone-500">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Foreign Key Constraints (if any) */}
          {selectedTable.foreignKeys && selectedTable.foreignKeys.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="font-bold text-xs text-stone-900">Foreign Key Constraints:</span>
              <div className="space-y-1 text-xs font-mono text-stone-600">
                {selectedTable.foreignKeys.map((fk, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-800">{fk.column}</span> → references{' '}
                    <span className="text-blue-700 font-bold">{fk.referencesTable}</span>({fk.referencesColumn})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indexes */}
          {selectedTable.indexes && selectedTable.indexes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="font-bold text-xs text-stone-900">Database Indexes:</span>
              <div className="space-y-1 text-xs font-mono text-stone-600">
                {selectedTable.indexes.map((idx, i) => (
                  <div key={i} className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-500">
                    {idx}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
