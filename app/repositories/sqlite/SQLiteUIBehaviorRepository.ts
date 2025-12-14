import {
  UIBehaviorRepository,
  UIBehavior
} from '../repositories';
import { query } from '../../db/sqlite';

export class SQLiteUIBehaviorRepository
  implements UIBehaviorRepository {

  async getByCategory(
    categoryId: number
  ): Promise<UIBehavior | null> {
    const rows = await query<UIBehavior>(
      `
      SELECT
        category_id AS categoryId,
        show_map_picker AS showMapPicker,
        show_sms_balance AS showSmsBalance,
        show_import AS showImport
      FROM ui_behavior
      WHERE category_id = ?
      `,
      [categoryId]
    );
    return rows[0] ?? null;
  }

  async listAll(): Promise<UIBehavior[]> {
    return query<UIBehavior>(
      `
      SELECT
        category_id AS categoryId,
        show_map_picker AS showMapPicker,
        show_sms_balance AS showSmsBalance,
        show_import AS showImport
      FROM ui_behavior
      `
    );
  }
}
