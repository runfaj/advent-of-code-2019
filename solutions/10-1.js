//should be 1,2 with 35
var input =
  `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`;

//should be 5,8 with 33
input =
  `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;


/*
input =
  `..............#.#...............#....#....
#.##.......#....#.#..##........#...#......
..#.....#....#..#.#....#.....#.#.##..#..#.
...........##...#...##....#.#.#....#.##..#
....##....#...........#..#....#......#.###
.#...#......#.#.#.#...#....#.##.##......##
#.##....#.....#.....#...####........###...
.####....#.......#...##..#..#......#...#..
...............#...........#..#.#.#.......
........#.........##...#..........#..##...
...#..................#....#....##..#.....
.............#..#.#.........#........#.##.
...#.#....................##..##..........
.....#.#...##..............#...........#..
......#..###.#........#.....#.##.#......#.
#......#.#.....#...........##.#.....#..#.#
.#.............#..#.....##.....###..#..#..
.#...#.....#.....##.#......##....##....#..
.........#.#..##............#..#...#......
..#..##...#.#..#....#..#.#.......#.##.....
#.......#.#....#.#..##.#...#.......#..###.
.#..........#...##.#....#...#.#.........#.
..#.#.......##..#.##..#.......#.###.......
...#....###...#......#..#.....####........
.............#.#..........#....#......#...
#................#..................#.###.
..###.........##...##..##.................
.#.........#.#####..#...##....#...##......
........#.#...#......#.................##.
.##.....#..##.##.#....#....#......#.#....#
.....#...........#.............#.....#....
........#.##.#...#.###.###....#.#......#..
..#...#.......###..#...#.##.....###.....#.
....#.....#..#.....#...#......###...###...
#..##.###...##.....#.....#....#...###..#..
........######.#...............#...#.#...#
...#.....####.##.....##...##..............
###..#......#...............#......#...#..
#..#...#.#........#.#.#...#..#....#.#.####
#..#...#..........##.#.....##........#.#..
........#....#..###..##....#.#.......##..#
.................##............#.......#..`;
*/

input =
`#...#
.#.#.
..#..
.#.#.
#...#`;


input = input.split('\n');

var asteroids = {};
var i = 0;
input.forEach((row, y) => {
  row.split('').forEach((cell, x) => {
    if (cell === '#') {
      asteroids[i] = [x, y, {}, 0];
      i++;
    }
  });
});

function getAsteroidAtCoords(x, y) {
  for (var i = 0; i < Object.keys(asteroids).length; i++) {
    if (x === asteroids[i][0] && y === asteroids[i][1])
      return [i, asteroids[i]];
  }
}

function getAsteroidAtKey(key) {
  return [key, asteroids[key]];
}

function reduce(yChange, xChange, log = false) {
  var yPos = yChange < 0 ? -1 : 1;
  var xPos = xChange < 0 ? -1 : 1;

  if (log) {
    console.log([yChange, xChange], [yPos, xPos]);
  }

  if (yChange === 0) {
    return [0, xPos === 1 ? '0' : '-0'];
  }
  if (xChange === 0) {
    return [yPos === 1 ? 'Infinity' : '-Infinity', 0];
  }

  var gcd = function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  };
  gcd = gcd(yChange, xChange);
  var newY = yChange / gcd;
  var newX = xChange / gcd;
  if (yPos === -1 && xPos === -1) {
    //this needed because we don't want to factor out common negatives
    newY *= -1;
    newX *= -1;
  }
  if (log) console.log([newY, newX]);
  return [newY, newX];
}

var highestMatches = [0, -1];
Object.keys(asteroids).forEach(key => {
  var asteroid = asteroids[key];
  var xOffset = asteroid[0];
  var yOffset = asteroid[1];
  var x1 = 0;
  var y1 = 0;
  var slopes = asteroid[2];

  var uniqueSlopes = [];
  Object.keys(asteroids).forEach(anotherKey => {
    var anotherAsteroid = asteroids[anotherKey];
    var x2 = anotherAsteroid[0];
    var y2 = anotherAsteroid[1];

    if (key !== anotherKey) {
      //var distance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));

      //var log = (key == 4);
      var log = false;

      var slopeX = (x2 - xOffset) - x1;
      var slopeY = (y2 - yOffset) - y1;
      var [slopeYReduced, slopeXReduced] = reduce(slopeY, slopeX, log);
      if (log) {
        console.log(key, [x1, y1], [xOffset, yOffset])
        console.log(anotherKey, [x2, y2])
        console.log('expected:', [slopeX, slopeY]);
        console.log('reduced:', [slopeXReduced, slopeYReduced])
      }
      slope = `${slopeXReduced},${slopeYReduced}`;
      //slope = `${slopeX},${slopeY}`;
      slopes[anotherKey] = slope;

      if (uniqueSlopes.indexOf(slope) === -1) {
        uniqueSlopes.push(slope);
      }
    }
  });

  /* slopes calculated by offset to get proper pos/neg at each point
  1..
  ...
  ..2

  from 1:
    1: 0,0
    2: 2,2

  from 2:
    1: -2,-2
    2: 0,0
  */

  asteroid[3] = uniqueSlopes.length + 1; // +1 includes myself
  //asteroid[4] = uniqueSlopes.slice();
  //asteroid[4].sort();
  if (asteroid[3] > highestMatches[0]) {
    highestMatches = [asteroid[3], key];
  }
});

//console.log(asteroids);
//console.log(getAsteroidAtKey(4))
//console.log(getAsteroidAtCoords(5,8))
console.log(highestMatches[1], asteroids[highestMatches[1]]);
//var highest = asteroids[highestMatches[1]];
//console.log(highestMatches[1], highest[3]);




/*
  I give up on this one. My thought process is that each asteroid is
  (0,0) and every other asteriod is x,y in relation. That means if (0,0)
  was the center and I had 4 asteriods at (-1,-1), (1,1), (-1,1), (1,-1),
  I'd have an X with the center asteroid having 4 lines of sight touching.
  Each coordinate provides a vector where each point is a unique direction.
  Thus, if I had (-2,-2), (2,2), (-2,2), (2,-2) in addition to the original
  4, I would only have 4 touching lines of site again.

  This is the logic I have, yet the answers and results from the problem
  appear to be wrong. Some examples are correct, but others are not.

  Okay, well apparently I'm just off in each quadrant somehow, given this
  described example. I'm done anyway...
*/