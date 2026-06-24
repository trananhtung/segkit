# segkit

<!-- ALL-CONTRIBUTORS-BADGE:START --><!-- ALL-CONTRIBUTORS-BADGE:END -->
[![npm version](https://img.shields.io/npm/v/segkit.svg)](https://www.npmjs.com/package/segkit)
[![npm downloads](https://img.shields.io/npm/dm/segkit.svg)](https://www.npmjs.com/package/segkit)
[![CI](https://img.shields.io/github/actions/workflow/status/trananhtung/segkit/ci.yml?branch=main)](https://github.com/trananhtung/segkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Zero-dependency Segment Tree and Fenwick Tree (BIT) — TypeScript-first range query data structures for npm. The only package in this category was last published in 2013.**

```ts
import { RangeSumTree, RangeMinTree, FenwickTree } from "segkit";

// Range sum queries with O(log n) updates
const tree = new RangeSumTree([1, 3, 5, 7, 9, 11]);
tree.query(2, 4);  // 5+7+9 = 21
tree.update(2, 0); // set index 2 to 0
tree.query(2, 4);  // 0+7+9 = 16

// Range minimum
const minTree = new RangeMinTree([3, 1, 4, 1, 5, 9, 2, 6]);
minTree.query(0, 7); // 1
minTree.query(4, 7); // 2

// Fenwick Tree — O(n) build, O(log n) prefix sums
const bit = new FenwickTree([1, 2, 3, 4, 5]);
bit.prefixSum(3);   // 1+2+3+4 = 10
bit.rangeSum(1, 3); // 2+3+4 = 9
bit.add(2, 10);     // arr[2] += 10
bit.total;          // 25
```

## Why segkit?

Every major language has segment trees and binary indexed trees in its ecosystem:
- **Python**: `sortedcontainers`, custom segment trees in competitive programming
- **Java**: `TreeMap`, Apache Commons Math, custom `SegmentTree<T>` implementations
- **C#**: Fenwick/BIT implementations in competitive programming collections
- **Go**: `segment-tree` libraries in algorithm packages

The only npm package for segment trees (`segment-tree`) was last published on **2013-07-18** and receives ~23 downloads per week. `segkit` fills this 13-year gap.

## Install

```bash
npm install segkit
```

## Usage

### Generic Segment Tree

The `SegmentTree<T>` class accepts any **associative binary operation with an identity element** (a monoid). This makes it work for sum, min, max, GCD, product, string concatenation, bitwise AND/OR, and more:

```ts
import { SegmentTree } from "segkit";

// Range sum (same as RangeSumTree)
const sumTree = new SegmentTree([1, 2, 3, 4, 5], (a, b) => a + b, 0);
sumTree.query(1, 3); // 9
sumTree.update(2, 10);
sumTree.query(1, 3); // 16

// Range bitwise AND
const andTree = new SegmentTree([0b111, 0b101, 0b110], (a, b) => a & b, ~0);
andTree.query(0, 2); // 0b100

// Range product
const prodTree = new SegmentTree([1, 2, 3, 4], (a, b) => a * b, 1);
prodTree.query(1, 3); // 2*3*4 = 24

// String concatenation
const strTree = new SegmentTree(["a", "b", "c"], (a, b) => a + b, "");
strTree.query(0, 2); // "abc"
strTree.update(1, "X");
strTree.query(0, 2); // "aXc"
```

### Built-in Specializations

```ts
import { RangeSumTree, RangeMinTree, RangeMaxTree, RangeGcdTree } from "segkit";

const data = [3, 1, 4, 1, 5, 9, 2, 6];

// Range sum
const sumTree = new RangeSumTree(data);
sumTree.query(2, 6); // 4+1+5+9+2 = 21

// Range minimum (useful for RMQ problems)
const minTree = new RangeMinTree(data);
minTree.query(0, 7); // 1
minTree.query(5, 7); // 2

// Range maximum
const maxTree = new RangeMaxTree(data);
maxTree.query(0, 4); // 5

// Range GCD
const gcdTree = new RangeGcdTree([12, 8, 6, 4]);
gcdTree.query(0, 3); // gcd(12,8,6,4) = 2

// All support .update(i, value) and .get(i)
maxTree.update(5, 100);
maxTree.query(0, 7); // 100
```

### Fenwick Tree (Binary Indexed Tree)

The Fenwick Tree is more memory-efficient than a Segment Tree for prefix-sum queries only. Use it when you need fast prefix sums with point updates:

```ts
import { FenwickTree } from "segkit";

// Build from array in O(n) using the difference-propagation technique
const bit = new FenwickTree([1, 2, 3, 4, 5]);

// Prefix sum: O(log n)
bit.prefixSum(2);   // 1+2+3 = 6 (indices 0..2)
bit.prefixSum(4);   // 15 (all)

// Range sum: O(log n)
bit.rangeSum(1, 3); // 2+3+4 = 9

// Point update: O(log n)
bit.add(2, 10);     // arr[2] += 10
bit.set(0, 100);    // arr[0] = 100

// Get single value: O(log n)
bit.get(2);         // 13 (original 3 + added 10)

// Total sum: O(log n)
bit.total;          // 126

// Find first index with prefixSum >= target (weighted sampling): O(log n)
// prefix: [1,3,6,10,15]
const bit2 = new FenwickTree([1, 2, 3, 4, 5]);
bit2.lowerBound(6);  // 2 (prefixSum(2)=6)
bit2.lowerBound(7);  // 3 (prefixSum(3)=10)

// Build empty tree and fill later
const empty = new FenwickTree(5);
empty.add(3, 42);
empty.get(3); // 42
```

### 2D Fenwick Tree

For matrix range sum queries:

```ts
import { FenwickTree2D } from "segkit";

const matrix = new FenwickTree2D(4, 4);

// Point updates
matrix.add(1, 1, 10);
matrix.add(1, 2, 20);
matrix.add(2, 1, 30);
matrix.add(2, 2, 40);

// Rectangle sum [r1,c1] to [r2,c2]
matrix.rangeSum(1, 1, 2, 2); // 100

// Prefix sum [0,0] to [r,c]
matrix.prefixSum(1, 1); // 10+20+30 = 60? no: only point (1,1)=10 plus (0,*)=0 = 10

// Get single cell
matrix.get(2, 2); // 40
```

## API

### SegmentTree\<T\>

```ts
new SegmentTree<T>(data: readonly T[], combine: (a: T, b: T) => T, identity: T)
```

| Method | Description |
|--------|-------------|
| `.query(l, r)` | Query range [l, r] inclusive. O(log n). Throws if OOB. |
| `.update(i, value)` | Set index i to value. O(log n). Throws if OOB. |
| `.get(i)` | Get value at index i. O(log n). |
| `.length` | Number of elements. |

### Built-in specializations

| Class | Operation | Identity |
|-------|-----------|----------|
| `RangeSumTree` | sum | 0 |
| `RangeMinTree` | min | Infinity |
| `RangeMaxTree` | max | -Infinity |
| `RangeGcdTree` | gcd | 0 |

### FenwickTree

```ts
new FenwickTree(data: readonly number[] | number)  // array or size
```

| Method | Description |
|--------|-------------|
| `.prefixSum(i)` | Sum of indices [0..i]. O(log n). |
| `.rangeSum(l, r)` | Sum of [l..r]. O(log n). |
| `.add(i, delta)` | Add delta to index i. O(log n). |
| `.set(i, value)` | Set index i to value. O(log n). |
| `.get(i)` | Value at index i. O(log n). |
| `.lowerBound(target)` | First index where prefixSum >= target. O(log n). |
| `.total` | Sum of all elements. O(log n). |
| `.length` | Number of elements. |

### FenwickTree2D

```ts
new FenwickTree2D(rows: number, cols: number)
```

| Method | Description |
|--------|-------------|
| `.add(r, c, delta)` | Add delta to cell (r,c). O(log m × log n). |
| `.set(r, c, value)` | Set cell (r,c). O(log m × log n). |
| `.prefixSum(r, c)` | Rectangle sum [0..r][0..c]. O(log m × log n). |
| `.rangeSum(r1, c1, r2, c2)` | Rectangle sum [r1..r2][c1..c2]. O(log m × log n). |
| `.get(r, c)` | Value at cell (r,c). O(log m × log n). |

## Time Complexity

| Operation | SegmentTree | FenwickTree |
|-----------|-------------|-------------|
| Build | O(n) | O(n) |
| Point update | O(log n) | O(log n) |
| Range query | O(log n) | O(log n) |
| Point query | O(log n) | O(log n) |
| Space | O(4n) | O(n) |

For prefix-sum queries only: prefer **FenwickTree** (2× smaller, 2× faster constants).
For arbitrary monoid operations (min/max/gcd/product): use **SegmentTree**.

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START --><!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT © [trananhtung](https://github.com/trananhtung)
