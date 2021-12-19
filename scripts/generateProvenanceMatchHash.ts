const crypto = require("crypto");

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function genHash(s: any) {
  return crypto.createHash("sha256").update(s.toString()).digest("hex");
}

function generateProvenanceMatchHash() {
  let x = between(10000000000000, 99999999999999);
  return {
    seed: x,
    hash: genHash(x)
  };
}

export default generateProvenanceMatchHash;
