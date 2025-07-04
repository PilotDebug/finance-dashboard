const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/routes/defi.ts',
  'src/routes/portfolio.ts',
  'src/routes/stocks.ts',
  'src/utils/cache.ts',
  'src/utils/response.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix unused parameters by adding underscore prefix
    content = content.replace(/async \(request: FastifyRequest, reply: FastifyReply\) => {/g, 
                             'async (_request: FastifyRequest, reply: FastifyReply) => {');
    content = content.replace(/const \{ portfolioId \} = request\.params;/g, 
                             'const { portfolioId: _portfolioId } = request.params;');
    content = content.replace(/const \{ symbol, quantity, price, date \} = request\.body;/g, 
                             'const { symbol, quantity, price, date: _date } = request.body;');
    content = content.replace(/const \{ userId \} = request\.params;/g, 
                             'const { userId: _userId } = request.params;');
    content = content.replace(/import \{ CacheEntry \} from '\.\.\/types';/g, 
                             "// import { CacheEntry } from '../types';");
    content = content.replace(/static validationError\(reply: FastifyReply, details: any\): FastifyReply {/g, 
                             'static validationError(reply: FastifyReply, _details: any): FastifyReply {');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
});

console.log('TypeScript errors fixed!'); 