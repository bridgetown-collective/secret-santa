const crypto = require("crypto");

function generateProvenanceHash(elements: string[]): void {

  // string to be hashed
  const elStrings =  elements.join('');

  let str = crypto
    .createHash('sha256')
    .update(elStrings)
    .digest('hex');

  console.log(str);
  return str;
}

generateProvenanceHash(['lol', 'wat']);
export {};
