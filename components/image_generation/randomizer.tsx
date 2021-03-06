import crypto from "crypto";

class RND {
  private seed: number;

  constructor(seed: number) {
    this.seed = this.scramble(seed);
  }

  scramble(n) {
    let seedStr = crypto
      .createHash("sha256")
      .update(n.toString())
      .digest("hex");
    let truncateStr = seedStr.substr(seedStr.length - 10);
    return Number(`0x${truncateStr}`);
  }

  rd() {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
  }

  rb(a, b) {
    return a + (b - a) * this.rd();
  }

  shuffle(array) {
    var currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(this.rb(0, 1) * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }

    return array;
  }
}

export default RND;
