import { ContactRepository, Contact } from '../repositories';
import { query, execute } from '../../db/sqlite';

export class SQLiteContactRepository implements ContactRepository {

  async create(contact: Omit<Contact, 'id'>): Promise<number> {
    await execute(
      `
      INSERT INTO contact (
        name,
        category,
        phone,
        email,
        address,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        contact.name,
        contact.category,
        contact.phone ?? null,
        contact.email ?? null,
        contact.address ?? null,
        contact.notes ?? null
      ]
    );

    const rows = await query<{ id: number }>(
      `SELECT last_insert_rowid() AS id`
    );
    return rows[0].id;
  }

  async getById(id: number): Promise<Contact | null> {
    const rows = await query<Contact>(
      `
      SELECT
        id,
        name,
        category,
        phone,
        email,
        address,
        notes
      FROM contact
      WHERE id = ?
      `,
      [id]
    );
    return rows[0] ?? null;
  }

  async listAll(): Promise<Contact[]> {
    return query<Contact>(
      `
      SELECT
        id,
        name,
        category,
        phone,
        email,
        address,
        notes
      FROM contact
      ORDER BY name
      `
    );
  }

  async linkToItem(
    itemId: number,
    contactId: number,
    roleCode: string
  ): Promise<void> {
    await execute(
      `
      INSERT OR REPLACE INTO item_contact (
        item_id,
        contact_id,
        role_code
      )
      VALUES (?, ?, ?)
      `,
      [itemId, contactId, roleCode]
    );
  }
}
