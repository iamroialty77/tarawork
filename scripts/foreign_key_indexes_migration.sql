-- Supabase Performance Advisor: add covering indexes for foreign keys.
-- Existing indexes whose leading columns already cover a foreign key are skipped.
-- Safe to run repeatedly.

do $migration$
declare
  fk record;
  index_name text;
begin
  for fk in
    select
      ns.nspname as schema_name,
      tbl.relname as table_name,
      con.conname as constraint_name,
      string_agg(quote_ident(att.attname), ', ' order by keys.ordinality) as indexed_columns
    from pg_constraint con
    join pg_class tbl on tbl.oid = con.conrelid
    join pg_namespace ns on ns.oid = tbl.relnamespace
    cross join lateral unnest(con.conkey) with ordinality as keys(attnum, ordinality)
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = keys.attnum
    where con.contype = 'f'
      and ns.nspname = 'public'
      and not exists (
        select 1
        from pg_index idx
        where idx.indrelid = con.conrelid
          and idx.indisvalid
          and idx.indisready
          and (idx.indkey::smallint[])[0:cardinality(con.conkey) - 1] = con.conkey
      )
    group by ns.nspname, tbl.relname, con.conname
    order by ns.nspname, tbl.relname, con.conname
  loop
    index_name := left(fk.constraint_name || '_idx', 63);
    execute format(
      'create index if not exists %I on %I.%I (%s)',
      index_name,
      fk.schema_name,
      fk.table_name,
      fk.indexed_columns
    );
  end loop;
end
$migration$;
