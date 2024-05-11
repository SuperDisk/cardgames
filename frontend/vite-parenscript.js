import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';

export default function parenscriptPlugin() {
  return {
    name: 'parenscript', // required, will show up in warnings and errors
    load(id) {
      if (id.endsWith('.paren')) {
        const code = fs.readFileSync(id, 'utf8');

        if (process.env.NODE_ENV === 'production') {
          const compiled = execSync('sh parenize.sh', {
            input: code,
            encoding: 'utf8'  // Ensure the output is a string
          });
          return {
            code: compiled,
            map: null  // Assuming no source map is available
          };
        } else {
          return {
            code: "",
            map: null
          };
        }
      }

      return null;
    }
  };
}
