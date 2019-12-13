var input = `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`;

input = `..............#.#...............#....#....
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

function getAsteroidAt(x,y) {
  for(var i=0; i< Object.keys(asteroids).length; i++) {
    if (x === asteroids[i][0] && y === asteroids[i][1])
      return [i, asteroids[i]];
  }
}

function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}

var highestMatches = [0, -1];
Object.keys(asteroids).forEach(key => {
  var asteroid = asteroids[key];
  var x1 = asteroid[0];
  var y1 = asteroid[1];
  var slopes = asteroid[2];

  var uniqueSlopes = [];
  Object.keys(asteroids).forEach(anotherKey => {
    var anotherAsteroid = asteroids[anotherKey];
    var x2 = anotherAsteroid[0];
    var y2 = anotherAsteroid[1];

    if (key !== anotherKey) {
      //var distance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
      //var slope = ((y2-y1) / (x2-x1)).toString();
      var slope = reduce(y2-y1, x2-x1);
      slope = `${slope[0]}/${slope[1]}`;
      slopes[anotherKey] = slope;

      if (uniqueSlopes.indexOf(slope) === -1) {
        uniqueSlopes.push(slope);
      }
    }
  });

  asteroid[3] = uniqueSlopes.length;
  asteroid[4] = uniqueSlopes.slice();
  asteroid[4].sort();
  if (asteroid[3] > highestMatches[0]) {
    highestMatches = [asteroid[3], key];
  }
});

//console.log(asteroids);
//console.log(getAsteroidAt(1,2))
console.log(highestMatches[1], asteroids[highestMatches[1]]);
//var highest = asteroids[highestMatches[1]];
//console.log(highestMatches[1], highest[3]);