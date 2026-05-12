/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Create "orders" collection
 *
 * Stores every paid order for reporting, delivery tracking, and
 * customer management. Created by Stripe webhook on payment,
 * updated when report is delivered.
 */

migrate((db) => {
  const collection = new Collection({
    id: 'pbc_310816761',
    created: '2026-05-12 00:00:00.000Z',
    updated: '2026-05-12 00:00:00.000Z',
    name: 'orders',
    type: 'base',
    system: false,
    schema: [
      // ── Stripe Identifiers ───────────────────────────
      {
        id: 'field_stripe_session',
        name: 'stripe_session_id',
        type: 'text',
        system: false,
        required: true,
        unique: true,
        options: {
          min: 1,
          max: 255,
          pattern: '',
        },
      },
      {
        id: 'field_stripe_customer',
        name: 'stripe_customer_id',
        type: 'text',
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 255,
          pattern: '',
        },
      },

      // ── Customer Info ────────────────────────────────
      {
        id: 'field_email',
        name: 'email',
        type: 'email',
        system: false,
        required: true,
        unique: false,
        options: {
          exceptDomains: [],
          onlyDomains: [],
        },
      },

      // ── Order Details ────────────────────────────────
      {
        id: 'field_tier',
        name: 'tier',
        type: 'text',
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 50,
          pattern: '',
        },
      },
      {
        id: 'field_amount',
        name: 'amount',
        type: 'number',
        system: false,
        required: true,
        unique: false,
        options: {
          min: 0,
          max: null,
        },
      },
      {
        id: 'field_currency',
        name: 'currency',
        type: 'text',
        system: false,
        required: false,
        unique: false,
        options: {
          min: 1,
          max: 10,
          pattern: '',
        },
      },
      {
        id: 'field_status',
        name: 'status',
        type: 'text',
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 50,
          pattern: '',
        },
      },

      // ── FSI Data (for report regeneration) ───────────
      {
        id: 'field_fsi_score',
        name: 'fsi_score',
        type: 'number',
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 100,
        },
      },
      {
        id: 'field_survival_band',
        name: 'survival_band',
        type: 'text',
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 50,
          pattern: '',
        },
      },

      // ── Report Artifacts ─────────────────────────────
      {
        id: 'field_pdf_url',
        name: 'pdf_url',
        type: 'url',
        system: false,
        required: false,
        unique: false,
        options: {
          exceptDomains: [],
          onlyDomains: [],
        },
      },
      {
        id: 'field_narrative_json',
        name: 'narrative_json',
        type: 'json',
        system: false,
        required: false,
        unique: false,
        options: {
          maxSize: 50000,
        },
      },
      {
        id: 'field_form_data',
        name: 'form_data',
        type: 'json',
        system: false,
        required: false,
        unique: false,
        options: {
          maxSize: 20000,
        },
      },

      // ── Delivery Tracking ────────────────────────────
      {
        id: 'field_delivered_at',
        name: 'delivered_at',
        type: 'date',
        system: false,
        required: false,
        unique: false,
        options: {
          min: '',
          max: '',
        },
      },
    ],
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  // ROLLBACK: remove the orders collection
  const collection = findCollectionByNameOrId(db, 'orders');
  return Dao(db).deleteCollection(collection);
});
