export declare const run_query: (query: string, values: any) => Promise<{
    rows: object[];
}>;
export declare const run_insert: (sql: string, values: any) => Promise<{
    insertId: any;
    affectedRows: any;
}>;
export declare const run_update: (sql: string, values: any) => Promise<{
    affectedRows: any;
}>;
export declare const run_delete: (sql: string, values: any) => Promise<{
    affectedRows: any;
}>;
//# sourceMappingURL=database.d.ts.map