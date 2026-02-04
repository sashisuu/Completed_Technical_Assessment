import { parse } from 'csv-parse';
import Joi from 'joi';
import { insertComment } from '../db';
import { CommentRow } from '../types';

const schema = Joi.object({
  postId: Joi.number().required(),
  id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  body: Joi.string().required()
});

export async function parseCSV(stream: NodeJS.ReadableStream) {
  return new Promise<{ rows: CommentRow[]; errors: Array<{line:number, message:string}> }>((resolve, reject) => {
    const parser = parse({ columns: true, skip_empty_lines: true, relax_quotes: true, trim: true, bom: true });
    let line = 1;
    const rows: CommentRow[] = [];
    const errors: Array<{line:number, message:string}> = [];

    parser.on('readable', () => {
      let record;
      // eslint-disable-next-line no-cond-assign
      while (record = parser.read()) {
        line++;
        const row: any = {
          postId: Number(record.postId),
          id: Number(record.id),
          name: record.name,
          email: record.email,
          body: record.body
        };
        const { error } = schema.validate(row);
        if (error) {
          errors.push({ line, message: error.message });
          continue;
        }
        rows.push(row as CommentRow);
      }
    });

    parser.on('error', (err) => reject(err));
    parser.on('end', () => resolve({ rows, errors }));
    stream.pipe(parser);
  });
}

export async function parseAndStoreCSV(stream: NodeJS.ReadableStream) {
  const { rows, errors } = await parseCSV(stream);
  let inserted = 0;
  for (const row of rows) {
    try {
      const rc = await insertComment(row);
      // guard against rc being null/undefined before comparing
      if (rc != null && rc > 0) {
        inserted += rc;
      }
    } catch (e: any) {
      // make sure we capture a string message even if 'e' isn't an Error
      errors.push({ line: -1, message: (e instanceof Error ? e.message : String(e)) });
    }
  }
  return { inserted, errors };
}
