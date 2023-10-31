import { DefaultNamingStrategy, Table } from "typeorm";

export class TypeormNamingStrategy extends DefaultNamingStrategy {
  public override primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return `pkey_${this.getTable(tableOrName)}_${this.getColumns(columnNames)}`;
  }

  public override foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    return `fk_${this.getTable(tableOrName)}_${this.getColumns(columnNames)}_to_${referencedTablePath}_${this.getColumns(
      referencedColumnNames || [],
    )}`;
  }

  public override indexName(tableOrName: Table | string, columns: string[]): string {
    return `idx_${this.getTable(tableOrName)}_${this.getColumns(columns)}`;
  }

  public override uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return `uq_${this.getTable(tableOrName)}_${this.getColumns(columnNames)}`;
  }

  // eslint-disable-next-line class-methods-use-this
  private getTable(tableOrName: Table | string): string {
    const tableName = typeof tableOrName === "string" ? tableOrName : tableOrName.name;

    return tableName;
  }

  // eslint-disable-next-line class-methods-use-this
  private getColumns(columns: string[]): string {
    const columnsName = columns.join("_and_");

    return columnsName;
  }
  checkConstraintName(tableOrName: Table | string, expression: string): string {
    return `${this.getTable(tableOrName)}_${expression.split(" ")[0]}_check`;
  }
}
