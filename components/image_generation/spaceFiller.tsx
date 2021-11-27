import RND from "./randomizer";

const canvasWidth = 478;
const canvasHeight = 478;

const c = 1.1;
const initialArea = 47000;

export function shuffle(rnd, array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(rnd.rb(0, 1) * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const fn_g = function (i) {
  if (i == 0) return 1;
  return Math.pow(i, -1 * c);
};
const isDisjoint = function (p1, p2, r1, r2) {
  let dx, dy, dr;
  dx = p1.x - p2.x;
  dy = p1.y - p2.y;
  dr = Math.sqrt(dx * dx + dy * dy);
  return dr > r1 + r2;
};

const isDisjointWithAll = function (objects, object) {
  const disjoints = objects.map((o) => {
    return isDisjoint(o, object, o.radius, object.radius);
  });

  // Expect all objects to be disjoint
  return disjoints.length == 0 || disjoints.every((x) => x);
};

const FaceLeftX = (seed, width) => {
  console.log("seed", seed, "width", width);
  console.log(seed * (canvasWidth - width));
  return seed * (canvasWidth - width);
};
const FaceTopY = (seed, height) => {
  console.log("seed", seed, "height", height);
  console.log(seed * (canvasHeight - height));
  return seed * (canvasHeight - height);
};

const generateShapes = function (seed, n, initialShapes) {
  //console.log('*********NewCall of generateShapes********')
  //console.log('seed', seed)
  const rnd = new RND(parseInt((1258 * seed).toString()));
  const objects = initialShapes || [];
  let initialAreaToUse = initialArea;
  //console.log('initialAreaToUse',initialAreaToUse)

  for (let i = objects.length; i < n; i++) {
    // console.log('fn_g', fn_g(i+1))
    let newObjArea = initialAreaToUse * fn_g(i - 1);
    // console.log('newObjArea', newObjArea)
    let radiusEst = Math.sqrt(newObjArea / Math.PI);
    // console.log('radiusEst', radiusEst)
    radiusEst = rnd.rb(radiusEst, 1.2 * radiusEst);
    // console.log('radiusEst', radiusEst)

    let c = 0;
    while (true) {
      const newObject = {
        x: rnd.rb(radiusEst, canvasWidth - radiusEst),
        y: rnd.rb(radiusEst, canvasHeight - radiusEst),
        rotation: Math.floor(rnd.rb(0, 4)) * 90,
        radius: radiusEst,
      };
      if (isDisjointWithAll(objects, newObject)) {
        objects.push(newObject);
        break;
      }
      c += 1;
      radiusEst -= 0.5;
      if (c > 500) {
        console.log("had to break");
        break;
      }
    }
  }

  // console.log(objects)
  // console.log('*********End of NewCall of generateShapes********')
  return objects;
};

export default generateShapes;
