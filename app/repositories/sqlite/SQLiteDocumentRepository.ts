import { DocumentRepository, Document } from '../repositories';
import { query, execute } from '../../db/sqlite';

export class SQLiteDocumentRepository implements DocumentRepository {

  async add(
    doc: Omit<Document, 'id' | 'uploadedAt'>
  ): Promise<number> {
    await execute(
      `
      INSERT INTO document (
        item_id,
        doc_type_code,
        file_path
      )
      VALUES (?, ?, ?)
      `,
      [
        doc.itemId,
        doc.docTypeCode,
        doc.filePath
      ]
    );

    const rows = await query<{ id: number }>(
      `SELECT last_insert_rowid() AS id`
    );
    return rows[0].id;
  }

  async listByItem(itemId: number): Promise<Document[]> {
    return query<Document>(
      `
      SELECT
        id,
        item_id AS itemId,
        doc_type_code AS docTypeCode,
        file_path AS filePath,
        uploaded_at AS uploadedAt
      FROM document
      WHERE item_id = ?
      ORDER BY uploaded_at DESC
      `,
      [itemId]
    );
  }

  async delete(documentId: number): Promise<void> {
    await execute(
      `DELETE FROM document WHERE id = ?`,
      [documentId]
    );
  }
}
