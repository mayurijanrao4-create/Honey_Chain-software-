/**
 * Honey Chain - MySQL Relational Database Schema & DDL
 * Production-ready schema with Primary Keys, Foreign Keys, Indexes, Constraints, and Timestamps.
 */

export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    key?: 'PK' | 'FK' | 'UK';
    nullable: boolean;
    defaultValue?: string;
    description: string;
  }[];
  foreignKeys?: {
    column: string;
    referencesTable: string;
    referencesColumn: string;
    onDelete?: string;
  }[];
  indexes?: string[];
}

export const MYSQL_SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'users',
    description: 'System accounts with role-based access control (Admin, Beekeeper, Inspector, Processor, Distributor, Consumer)',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, description: 'Full name' },
      { name: 'email', type: 'VARCHAR(128)', key: 'UK', nullable: false, description: 'Unique user email' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Argon2 / BCrypt hashed credentials' },
      { name: 'role', type: 'ENUM("admin","beekeeper","processor","inspector","distributor","consumer")', nullable: false, description: 'User RBAC role' },
      { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Mobile phone number' },
      { name: 'address', type: 'TEXT', nullable: true, description: 'Physical address / headquarters' },
      { name: 'organization', type: 'VARCHAR(128)', nullable: true, description: 'Company / cooperative name' },
      { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Record creation timestamp' },
      { name: 'updated_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', description: 'Last update' },
    ],
    indexes: ['INDEX idx_users_role (role)', 'INDEX idx_users_email (email)'],
  },
  {
    name: 'apiaries',
    description: 'Bee yards/farms managed by beekeepers where colonies and hives are maintained',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'beekeeper_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Owner beekeeper user ID' },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, description: 'Apiary farm title' },
      { name: 'location', type: 'VARCHAR(255)', nullable: false, description: 'Village / town location' },
      { name: 'state', type: 'VARCHAR(64)', nullable: false, description: 'State / Province' },
      { name: 'district', type: 'VARCHAR(64)', nullable: false, description: 'District' },
      { name: 'latitude', type: 'DECIMAL(10, 7)', nullable: false, description: 'GPS Latitude' },
      { name: 'longitude', type: 'DECIMAL(10, 7)', nullable: false, description: 'GPS Longitude' },
      { name: 'bee_species', type: 'VARCHAR(128)', nullable: false, description: 'e.g. Apis cerana indica, Apis mellifera' },
      { name: 'floral_source', type: 'VARCHAR(255)', nullable: false, description: 'Surrounding flora (Acacia, Mustard, Wild Jamun)' },
      { name: 'organic_certified', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Certified organic flag' },
      { name: 'altitude_meters', type: 'INT', nullable: true, description: 'Elevation above sea level' },
      { name: 'established_date', type: 'DATE', nullable: false, description: 'Apiary founding date' },
      { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation time' },
    ],
    foreignKeys: [{ column: 'beekeeper_id', referencesTable: 'users', referencesColumn: 'id', onDelete: 'RESTRICT' }],
    indexes: ['INDEX idx_apiaries_beekeeper (beekeeper_id)', 'INDEX idx_apiaries_state_district (state, district)'],
  },
  {
    name: 'hives',
    description: 'Physical bee boxes equipped with IoT telemetry sensors',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'hive_code', type: 'VARCHAR(32)', key: 'UK', nullable: false, description: 'Physical ID tag (e.g. H-101)' },
      { name: 'apiary_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Parent Apiary ID' },
      { name: 'hive_type', type: 'ENUM("Langstroth","Top-Bar","Warre","Traditional")', nullable: false, description: 'Architecture type' },
      { name: 'bee_colony', type: 'VARCHAR(64)', nullable: false, description: 'Colony identifier' },
      { name: 'queen_status', type: 'VARCHAR(64)', nullable: false, description: 'Queen status (Healthy, Virgin, Supercedure)' },
      { name: 'queen_age_months', type: 'INT', nullable: false, defaultValue: '6', description: 'Queen age in months' },
      { name: 'installation_date', type: 'DATE', nullable: false, description: 'Installation date' },
      { name: 'status', type: 'ENUM("active","maintenance","swarmed","dormant")', nullable: false, defaultValue: '"active"', description: 'Colony status' },
      { name: 'last_inspection_date', type: 'DATE', nullable: true, description: 'Last manual hive inspection' },
      { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation time' },
    ],
    foreignKeys: [{ column: 'apiary_id', referencesTable: 'apiaries', referencesColumn: 'id', onDelete: 'CASCADE' }],
    indexes: ['INDEX idx_hives_apiary (apiary_id)', 'INDEX idx_hives_status (status)'],
  },
  {
    name: 'hive_sensor_data',
    description: 'Time-series telemetry from IoT smart scale, temperature, humidity and acoustic sensors',
    columns: [
      { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK', nullable: false, description: 'Sequential BigInt' },
      { name: 'hive_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Target hive' },
      { name: 'ambient_temp_c', type: 'DECIMAL(4,2)', nullable: false, description: 'External ambient temperature °C' },
      { name: 'internal_temp_c', type: 'DECIMAL(4,2)', nullable: false, description: 'Brood box internal core temperature °C' },
      { name: 'humidity_percent', type: 'DECIMAL(4,2)', nullable: false, description: 'Relative humidity %' },
      { name: 'weight_kg', type: 'DECIMAL(6,2)', nullable: false, description: 'Gross scale weight in kg' },
      { name: 'battery_level_percent', type: 'TINYINT', nullable: false, description: 'Sensor battery 0-100%' },
      { name: 'audio_frequency_hz', type: 'INT', nullable: true, description: 'Acoustic hum frequency in Hz' },
      { name: 'activity_level', type: 'ENUM("low","normal","high","swarming_risk")', nullable: false, description: 'Colony activity' },
      { name: 'recorded_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Timestamp of reading' },
    ],
    foreignKeys: [{ column: 'hive_id', referencesTable: 'hives', referencesColumn: 'id', onDelete: 'CASCADE' }],
    indexes: ['INDEX idx_sensor_hive_time (hive_id, recorded_at DESC)'],
  },
  {
    name: 'honey_batches',
    description: 'Core batch record tracked through all stages from harvest to consumer delivery',
    columns: [
      { name: 'id', type: 'VARCHAR(32)', key: 'PK', nullable: false, description: 'Unique Batch Code (e.g. HC-2026-00001)' },
      { name: 'hive_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Origin hive ID' },
      { name: 'apiary_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Origin apiary ID' },
      { name: 'beekeeper_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Harvesting beekeeper user' },
      { name: 'honey_type', type: 'VARCHAR(128)', nullable: false, description: 'Honey varietal' },
      { name: 'floral_source', type: 'VARCHAR(255)', nullable: false, description: 'Botanical nectar source' },
      { name: 'harvest_date', type: 'DATE', nullable: false, description: 'Date of honey extraction' },
      { name: 'quantity_kg', type: 'DECIMAL(8,2)', nullable: false, description: 'Total batch weight harvested in kg' },
      { name: 'harvest_notes', type: 'TEXT', nullable: true, description: 'Field observations & weather notes' },
      { name: 'status', type: 'ENUM("HARVESTED","QUALITY_CHECK","APPROVED","PROCESSING","PACKAGED","DISTRIBUTED","DELIVERED","REJECTED")', nullable: false, description: 'Lifecycle status' },
      { name: 'current_block_hash', type: 'VARCHAR(64)', nullable: true, description: 'Latest cryptographic block hash anchoring this batch' },
      { name: 'qr_code_url', type: 'VARCHAR(255)', nullable: true, description: 'Public consumer verification URL' },
      { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', description: 'Last state change' },
    ],
    foreignKeys: [
      { column: 'hive_id', referencesTable: 'hives', referencesColumn: 'id', onDelete: 'RESTRICT' },
      { column: 'apiary_id', referencesTable: 'apiaries', referencesColumn: 'id', onDelete: 'RESTRICT' },
      { column: 'beekeeper_id', referencesTable: 'users', referencesColumn: 'id', onDelete: 'RESTRICT' },
    ],
    indexes: ['INDEX idx_batch_status (status)', 'INDEX idx_batch_beekeeper (beekeeper_id)', 'INDEX idx_batch_harvest_date (harvest_date)'],
  },
  {
    name: 'quality_inspections',
    description: 'Laboratory physico-chemical and purity testing records (FSSAI/Codex Alimentarius standards)',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'batch_id', type: 'VARCHAR(32)', key: 'FK', nullable: false, description: 'Inspected Honey Batch ID' },
      { name: 'inspector_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Certified inspector user' },
      { name: 'inspection_date', type: 'DATETIME', nullable: false, description: 'Lab testing timestamp' },
      { name: 'moisture_content_percent', type: 'DECIMAL(4,2)', nullable: false, description: 'Moisture % (Standard < 20%)' },
      { name: 'ph_level', type: 'DECIMAL(3,2)', nullable: false, description: 'pH level (Standard 3.4 - 6.1)' },
      { name: 'color_pfund', type: 'VARCHAR(64)', nullable: false, description: 'Pfund optical color grade' },
      { name: 'aroma_profile', type: 'VARCHAR(128)', nullable: false, description: 'Organoleptic aroma description' },
      { name: 'purity_percentage', type: 'DECIMAL(5,2)', nullable: false, description: 'Pollen and natural purity score' },
      { name: 'hmf_value_mg_kg', type: 'DECIMAL(5,2)', nullable: false, description: 'HMF content mg/kg (Standard < 40)' },
      { name: 'adulteration_test', type: 'VARCHAR(64)', nullable: false, description: 'C3/C4 sugar isotope test result' },
      { name: 'microbial_test', type: 'VARCHAR(64)', nullable: false, description: 'Pathogen / spore absence status' },
      { name: 'overall_result', type: 'ENUM("Approved","Rejected","Pending")', nullable: false, description: 'Certification verdict' },
      { name: 'certificate_number', type: 'VARCHAR(64)', key: 'UK', nullable: false, description: 'Official Quality Lab Cert #' },
      { name: 'blockchain_tx_id', type: 'VARCHAR(64)', nullable: true, description: 'Anchored transaction hash' },
      { name: 'remarks', type: 'TEXT', nullable: true, description: 'Lab technician remarks' },
    ],
    foreignKeys: [
      { column: 'batch_id', referencesTable: 'honey_batches', referencesColumn: 'id', onDelete: 'RESTRICT' },
      { column: 'inspector_id', referencesTable: 'users', referencesColumn: 'id', onDelete: 'RESTRICT' },
    ],
    indexes: ['INDEX idx_quality_batch (batch_id)', 'INDEX idx_quality_cert (certificate_number)'],
  },
  {
    name: 'processing_records',
    description: 'Post-harvest processing events: coarse mechanical filtration, controlled warming & settling',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'batch_id', type: 'VARCHAR(32)', key: 'FK', nullable: false, description: 'Target honey batch' },
      { name: 'operator_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Facility operator user' },
      { name: 'processing_date', type: 'DATETIME', nullable: false, description: 'Processing start date' },
      { name: 'processing_unit', type: 'VARCHAR(128)', nullable: false, description: 'Facility / Vat ID' },
      { name: 'filtration_method', type: 'VARCHAR(128)', nullable: false, description: 'e.g. Micro-mesh mechanical filter (unpasteurized raw)' },
      { name: 'heating_temperature_c', type: 'DECIMAL(4,2)', nullable: false, description: 'Temperature in °C (Cold extracted < 40°C)' },
      { name: 'processing_duration_hours', type: 'DECIMAL(4,2)', nullable: false, description: 'Duration in hours' },
      { name: 'storage_condition', type: 'VARCHAR(255)', nullable: false, description: 'Holding vat environment specs' },
      { name: 'blockchain_tx_id', type: 'VARCHAR(64)', nullable: true, description: 'Anchored blockchain transaction' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Operator process observations' },
    ],
    foreignKeys: [
      { column: 'batch_id', referencesTable: 'honey_batches', referencesColumn: 'id', onDelete: 'RESTRICT' },
      { column: 'operator_id', referencesTable: 'users', referencesColumn: 'id', onDelete: 'RESTRICT' },
    ],
  },
  {
    name: 'packaging_records',
    description: 'Bottling, retail packaging, hermetic sealing and QR code labeling events',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'batch_id', type: 'VARCHAR(32)', key: 'FK', nullable: false, description: 'Target honey batch' },
      { name: 'operator_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Packaging line supervisor' },
      { name: 'packaging_date', type: 'DATETIME', nullable: false, description: 'Bottling date' },
      { name: 'facility_name', type: 'VARCHAR(128)', nullable: false, description: 'Certified Packaging Unit' },
      { name: 'package_size', type: 'VARCHAR(64)', nullable: false, description: 'Package size (e.g. 500g Hexagonal Jar)' },
      { name: 'unit_count', type: 'INT', nullable: false, description: 'Number of individual jars/bottles' },
      { name: 'expiry_date', type: 'DATE', nullable: false, description: 'Best before expiry date' },
      { name: 'product_label_id', type: 'VARCHAR(64)', nullable: false, description: 'Regulatory barcode / SKU' },
      { name: 'qr_verification_url', type: 'VARCHAR(255)', nullable: false, description: 'Embedded verification URL in QR' },
      { name: 'blockchain_tx_id', type: 'VARCHAR(64)', nullable: true, description: 'Anchored blockchain transaction' },
    ],
    foreignKeys: [
      { column: 'batch_id', referencesTable: 'honey_batches', referencesColumn: 'id', onDelete: 'RESTRICT' },
      { column: 'operator_id', referencesTable: 'users', referencesColumn: 'id', onDelete: 'RESTRICT' },
    ],
  },
  {
    name: 'shipments',
    description: 'Logistics, cold chain transport, and distribution tracking to retailers and hubs',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'batch_id', type: 'VARCHAR(32)', key: 'FK', nullable: false, description: 'Honey batch shipped' },
      { name: 'distributor_id', type: 'VARCHAR(36)', key: 'FK', nullable: false, description: 'Logistics partner user' },
      { name: 'shipment_id', type: 'VARCHAR(64)', key: 'UK', nullable: false, description: 'Consignment / Bill of Lading #' },
      { name: 'source_location', type: 'VARCHAR(128)', nullable: false, description: 'Dispatch warehouse' },
      { name: 'destination', type: 'VARCHAR(128)', nullable: false, description: 'Delivery fulfillment center / store' },
      { name: 'transport_method', type: 'VARCHAR(64)', nullable: false, description: 'e.g. Temperature Controlled Eco-Van' },
      { name: 'dispatch_date', type: 'DATETIME', nullable: false, description: 'Actual dispatch time' },
      { name: 'expected_delivery', type: 'DATETIME', nullable: false, description: 'ETA timestamp' },
      { name: 'actual_delivery', type: 'DATETIME', nullable: true, description: 'Final drop-off timestamp' },
      { name: 'status', type: 'ENUM("Prepared","In Transit","Delivered","Delayed")', nullable: false, description: 'Shipment progress' },
      { name: 'blockchain_tx_id', type: 'VARCHAR(64)', nullable: true, description: 'Anchored blockchain transaction' },
      { name: 'tracking_notes', type: 'TEXT', nullable: true, description: 'Waybill updates' },
    ],
    foreignKeys: [
      { column: 'batch_id', referencesTable: 'honey_batches', referencesColumn: 'id', onDelete: 'RESTRICT' },
      { column: 'distributor_id', referencesTable: 'users', referencesColumn: 'id', onDelete: 'RESTRICT' },
    ],
    indexes: ['INDEX idx_shipments_shipment_id (shipment_id)', 'INDEX idx_shipments_status (status)'],
  },
  {
    name: 'blockchain_blocks',
    description: 'Immutable ledger blocks storing verified batch transactions and cryptographic linkage',
    columns: [
      { name: 'block_index', type: 'BIGINT', key: 'PK', nullable: false, description: 'Sequential block height (0 = Genesis)' },
      { name: 'timestamp', type: 'DATETIME', nullable: false, description: 'Block creation timestamp' },
      { name: 'previous_hash', type: 'CHAR(64)', nullable: false, description: 'Cryptographic SHA-256 hash of previous block' },
      { name: 'current_hash', type: 'CHAR(64)', key: 'UK', nullable: false, description: 'Cryptographic SHA-256 hash of this block' },
      { name: 'merkle_root', type: 'CHAR(64)', nullable: false, description: 'Merkle root hash of enclosed transactions' },
      { name: 'nonce', type: 'BIGINT', nullable: false, description: 'Proof of work nonce' },
      { name: 'is_genesis', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Genesis block flag' },
    ],
    indexes: ['INDEX idx_block_hash (current_hash)', 'INDEX idx_prev_hash (previous_hash)'],
  },
  {
    name: 'blockchain_transactions',
    description: 'Individual atomic traceability actions anchored within a block',
    columns: [
      { name: 'tx_id', type: 'VARCHAR(64)', key: 'PK', nullable: false, description: 'Unique Transaction UUID / Hash' },
      { name: 'block_index', type: 'BIGINT', key: 'FK', nullable: false, description: 'Enclosing block number' },
      { name: 'batch_id', type: 'VARCHAR(32)', key: 'FK', nullable: false, description: 'Associated Honey Batch ID' },
      { name: 'action', type: 'VARCHAR(64)', nullable: false, description: 'Lifecycle action (HARVEST, QUALITY_PASS, etc.)' },
      { name: 'actor_role', type: 'VARCHAR(32)', nullable: false, description: 'Role of signer' },
      { name: 'actor_name', type: 'VARCHAR(128)', nullable: false, description: 'Signer identity' },
      { name: 'payload_summary', type: 'TEXT', nullable: false, description: 'Human readable event summary' },
      { name: 'tx_hash', type: 'CHAR(64)', key: 'UK', nullable: false, description: 'SHA-256 hash of transaction data' },
      { name: 'timestamp', type: 'DATETIME', nullable: false, description: 'Transaction execution timestamp' },
    ],
    foreignKeys: [
      { column: 'block_index', referencesTable: 'blockchain_blocks', referencesColumn: 'block_index', onDelete: 'RESTRICT' },
      { column: 'batch_id', referencesTable: 'honey_batches', referencesColumn: 'id', onDelete: 'RESTRICT' },
    ],
    indexes: ['INDEX idx_tx_batch (batch_id)', 'INDEX idx_tx_hash (tx_hash)'],
  },
  {
    name: 'alerts',
    description: 'Automated warnings triggered by IoT sensor thresholds and supply-chain exceptions',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: false, description: 'UUID Primary Key' },
      { name: 'type', type: 'ENUM("HIGH_TEMP","LOW_HUMIDITY","SUDDEN_WEIGHT_DROP","LOW_BATTERY","QUALITY_REJECTED","SWARMING_RISK","SHIPMENT_DELAY","UNAUTHORIZED_TAMPER")', nullable: false, description: 'Alert category' },
      { name: 'severity', type: 'ENUM("critical","warning","info")', nullable: false, description: 'Severity level' },
      { name: 'hive_id', type: 'VARCHAR(36)', nullable: true, description: 'Affected hive (if IoT triggered)' },
      { name: 'batch_id', type: 'VARCHAR(32)', nullable: true, description: 'Affected batch (if quality/chain triggered)' },
      { name: 'message', type: 'VARCHAR(255)', nullable: false, description: 'Alert description' },
      { name: 'status', type: 'ENUM("active","resolved")', nullable: false, defaultValue: '"active"', description: 'Resolution status' },
      { name: 'action_taken', type: 'TEXT', nullable: true, description: 'Beekeeper or admin corrective action' },
      { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Trigger timestamp' },
    ],
    indexes: ['INDEX idx_alerts_status (status)', 'INDEX idx_alerts_hive (hive_id)'],
  },
  {
    name: 'audit_logs',
    description: 'System-wide compliance audit trail tracking all user interactions and security events',
    columns: [
      { name: 'id', type: 'BIGINT AUTO_INCREMENT', key: 'PK', nullable: false, description: 'Audit sequence number' },
      { name: 'user_name', type: 'VARCHAR(128)', nullable: false, description: 'User who performed action' },
      { name: 'role', type: 'VARCHAR(32)', nullable: false, description: 'User role at time of action' },
      { name: 'action', type: 'VARCHAR(128)', nullable: false, description: 'Action performed' },
      { name: 'entity', type: 'VARCHAR(64)', nullable: false, description: 'Target entity type' },
      { name: 'entity_id', type: 'VARCHAR(64)', nullable: false, description: 'Target entity ID' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false, description: 'Client IP address' },
      { name: 'tx_hash', type: 'CHAR(64)', nullable: true, description: 'Blockchain transaction hash if state modified' },
      { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Execution timestamp' },
    ],
    indexes: ['INDEX idx_audit_entity (entity, entity_id)', 'INDEX idx_audit_user (user_name)'],
  },
];

/**
 * Generates ready-to-run MySQL DDL script
 */
export function generateMySQLDDL(): string {
  let ddl = `-- ========================================================\n`;
  ddl += `-- Honey Chain: Database Schema Definition (MySQL 8.0+)\n`;
  ddl += `-- Blockchain-Based Honey Traceability and Smart Beekeeping\n`;
  ddl += `-- Generated for Academic Viva & Engineering Project Demo\n`;
  ddl += `-- ========================================================\n\n`;
  ddl += `CREATE DATABASE IF NOT EXISTS honey_chain_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE honey_chain_db;\n\n`;

  for (const table of MYSQL_SCHEMA_TABLES) {
    ddl += `-- Table: ${table.name} (${table.description})\n`;
    ddl += `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
    const colDefs = table.columns.map((col) => {
      let def = `  \`${col.name}\` ${col.type}`;
      if (!col.nullable) def += ` NOT NULL`;
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
      if (col.key === 'PK') def += ` PRIMARY KEY`;
      return def;
    });

    if (table.indexes) {
      colDefs.push(...table.indexes.map((idx) => `  ${idx}`));
    }

    if (table.foreignKeys) {
      colDefs.push(
        ...table.foreignKeys.map(
          (fk) =>
            `  CONSTRAINT \`fk_${table.name}_${fk.column}\` FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.referencesTable}\` (\`${fk.referencesColumn}\`)${fk.onDelete ? ` ON DELETE ${fk.onDelete}` : ''}`
        )
      );
    }

    ddl += colDefs.join(',\n');
    ddl += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
  }

  return ddl;
}
