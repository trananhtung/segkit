import {
  SegmentTree,
  RangeSumTree,
  RangeMinTree,
  RangeMaxTree,
  RangeGcdTree,
  FenwickTree,
  FenwickTree2D,
} from "../src/index.js";

// ────────────────────────────────────────────────────────────────
// SegmentTree generic
// ────────────────────────────────────────────────────────────────
describe("SegmentTree (generic)", () => {
  test("range sum", () => {
    const t = new SegmentTree([1, 2, 3, 4, 5], (a, b) => a + b, 0);
    expect(t.query(0, 4)).toBe(15);
    expect(t.query(1, 3)).toBe(9);
    expect(t.query(2, 2)).toBe(3);
  });

  test("point update", () => {
    const t = new SegmentTree([1, 2, 3, 4, 5], (a, b) => a + b, 0);
    t.update(2, 10);
    expect(t.query(0, 4)).toBe(22);
    expect(t.query(1, 3)).toBe(16);
  });

  test("get(i) returns single element", () => {
    const t = new SegmentTree([10, 20, 30], (a, b) => a + b, 0);
    expect(t.get(0)).toBe(10);
    expect(t.get(2)).toBe(30);
  });

  test("range concat (string monoid)", () => {
    const t = new SegmentTree(["a", "b", "c", "d"], (a, b) => a + b, "");
    expect(t.query(1, 3)).toBe("bcd");
    t.update(1, "X");
    expect(t.query(0, 3)).toBe("aXcd");
  });

  test("empty range returns identity", () => {
    const t = new SegmentTree([1, 2, 3], (a, b) => a + b, 0);
    expect(t.query(2, 1)).toBe(0); // l > r
  });

  test("out-of-bounds query throws", () => {
    const t = new SegmentTree([1, 2, 3], (a, b) => a + b, 0);
    expect(() => t.query(-1, 2)).toThrow(RangeError);
    expect(() => t.query(0, 3)).toThrow(RangeError);
  });

  test("out-of-bounds update throws", () => {
    const t = new SegmentTree([1, 2], (a, b) => a + b, 0);
    expect(() => t.update(-1, 5)).toThrow(RangeError);
    expect(() => t.update(2, 5)).toThrow(RangeError);
  });

  test("single element", () => {
    const t = new SegmentTree([42], (a, b) => a + b, 0);
    expect(t.query(0, 0)).toBe(42);
    t.update(0, 7);
    expect(t.query(0, 0)).toBe(7);
  });

  test("length", () => {
    expect(new SegmentTree([1, 2, 3], (a, b) => a + b, 0).length).toBe(3);
  });
});

// ────────────────────────────────────────────────────────────────
// RangeSumTree
// ────────────────────────────────────────────────────────────────
describe("RangeSumTree", () => {
  test("basic range sum", () => {
    const t = new RangeSumTree([1, 3, 5, 7, 9, 11]);
    expect(t.query(0, 5)).toBe(36);
    expect(t.query(2, 4)).toBe(21);
  });

  test("update and requery", () => {
    const t = new RangeSumTree([1, 2, 3, 4, 5]);
    t.update(2, 10); // was 3, now 10
    expect(t.query(0, 4)).toBe(22);
    expect(t.query(2, 4)).toBe(19);
  });

  test("prefix sum", () => {
    const t = new RangeSumTree([1, 2, 3, 4, 5]);
    expect(t.query(0, 0)).toBe(1);
    expect(t.query(0, 1)).toBe(3);
    expect(t.query(0, 2)).toBe(6);
    expect(t.query(0, 3)).toBe(10);
  });
});

// ────────────────────────────────────────────────────────────────
// RangeMinTree
// ────────────────────────────────────────────────────────────────
describe("RangeMinTree", () => {
  test("range minimum", () => {
    const t = new RangeMinTree([3, 1, 4, 1, 5, 9, 2, 6]);
    expect(t.query(0, 7)).toBe(1);
    expect(t.query(4, 7)).toBe(2);
    expect(t.query(2, 5)).toBe(1);
  });

  test("update changes minimum", () => {
    const t = new RangeMinTree([5, 3, 8, 1, 7]);
    expect(t.query(0, 4)).toBe(1);
    t.update(3, 10); // was 1, now 10
    expect(t.query(0, 4)).toBe(3);
  });

  test("single element range", () => {
    const t = new RangeMinTree([5, 3, 8]);
    expect(t.query(1, 1)).toBe(3);
  });
});

// ────────────────────────────────────────────────────────────────
// RangeMaxTree
// ────────────────────────────────────────────────────────────────
describe("RangeMaxTree", () => {
  test("range maximum", () => {
    const t = new RangeMaxTree([3, 1, 4, 1, 5, 9, 2, 6]);
    expect(t.query(0, 7)).toBe(9);
    expect(t.query(0, 4)).toBe(5);
    expect(t.query(6, 7)).toBe(6);
  });

  test("update changes maximum", () => {
    const t = new RangeMaxTree([1, 3, 2, 5, 4]);
    t.update(2, 10);
    expect(t.query(0, 4)).toBe(10);
    expect(t.query(0, 1)).toBe(3);
  });
});

// ────────────────────────────────────────────────────────────────
// RangeGcdTree
// ────────────────────────────────────────────────────────────────
describe("RangeGcdTree", () => {
  test("gcd(12, 8, 6) = 2", () => {
    const t = new RangeGcdTree([12, 8, 6]);
    expect(t.query(0, 2)).toBe(2);
  });

  test("update changes gcd", () => {
    const t = new RangeGcdTree([6, 10, 15]);
    expect(t.query(0, 2)).toBe(1);
    t.update(1, 9);
    expect(t.query(0, 1)).toBe(3);
  });
});

// ────────────────────────────────────────────────────────────────
// FenwickTree
// ────────────────────────────────────────────────────────────────
describe("FenwickTree", () => {
  test("prefix sum from array", () => {
    const bit = new FenwickTree([1, 2, 3, 4, 5]);
    expect(bit.prefixSum(0)).toBe(1);
    expect(bit.prefixSum(2)).toBe(6);
    expect(bit.prefixSum(4)).toBe(15);
  });

  test("rangeSum", () => {
    const bit = new FenwickTree([1, 2, 3, 4, 5]);
    expect(bit.rangeSum(1, 3)).toBe(9);
    expect(bit.rangeSum(0, 4)).toBe(15);
  });

  test("add (point update)", () => {
    const bit = new FenwickTree([1, 2, 3, 4, 5]);
    bit.add(2, 10); // arr[2] += 10
    expect(bit.rangeSum(0, 4)).toBe(25);
    expect(bit.rangeSum(1, 3)).toBe(19);
  });

  test("set", () => {
    const bit = new FenwickTree([1, 2, 3, 4, 5]);
    bit.set(2, 10); // arr[2] = 10
    expect(bit.get(2)).toBe(10);
    expect(bit.rangeSum(0, 4)).toBe(22);
  });

  test("get single value", () => {
    const bit = new FenwickTree([10, 20, 30]);
    expect(bit.get(0)).toBe(10);
    expect(bit.get(1)).toBe(20);
    expect(bit.get(2)).toBe(30);
  });

  test("total", () => {
    const bit = new FenwickTree([1, 2, 3, 4, 5]);
    expect(bit.total).toBe(15);
    bit.add(0, 5);
    expect(bit.total).toBe(20);
  });

  test("empty constructor with size", () => {
    const bit = new FenwickTree(5);
    expect(bit.total).toBe(0);
    bit.add(2, 7);
    expect(bit.get(2)).toBe(7);
  });

  test("add out-of-bounds throws", () => {
    const bit = new FenwickTree([1, 2, 3]);
    expect(() => bit.add(-1, 5)).toThrow(RangeError);
    expect(() => bit.add(3, 5)).toThrow(RangeError);
  });

  test("rangeSum out-of-bounds throws", () => {
    const bit = new FenwickTree([1, 2, 3]);
    expect(() => bit.rangeSum(-1, 2)).toThrow(RangeError);
    expect(() => bit.rangeSum(0, 3)).toThrow(RangeError);
  });

  test("prefixSum(-1) = 0", () => {
    const bit = new FenwickTree([1, 2, 3]);
    expect(bit.prefixSum(-1)).toBe(0);
  });

  test("lowerBound finds first index where prefixSum >= target", () => {
    const bit = new FenwickTree([1, 2, 3, 4, 5]);
    // prefix: [1,3,6,10,15]
    expect(bit.lowerBound(1)).toBe(0); // prefixSum(0)=1 >=1
    expect(bit.lowerBound(3)).toBe(1); // prefixSum(1)=3 >=3
    expect(bit.lowerBound(4)).toBe(2); // prefixSum(2)=6 >=4
    expect(bit.lowerBound(15)).toBe(4);
    expect(bit.lowerBound(16)).toBe(-1); // exceeds total
  });

  test("length", () => {
    expect(new FenwickTree([1, 2, 3]).length).toBe(3);
    expect(new FenwickTree(5).length).toBe(5);
  });

  test("large array correctness", () => {
    const n = 1000;
    const data = Array.from({ length: n }, (_, i) => i + 1);
    const bit = new FenwickTree(data);
    // Sum of 1..1000 = 500500
    expect(bit.total).toBe(500500);
    // Sum of 1..100 = 5050
    expect(bit.prefixSum(99)).toBe(5050);
    bit.add(99, 1000); // arr[99] = 100 + 1000 = 1100
    expect(bit.total).toBe(501500);
  });
});

// ────────────────────────────────────────────────────────────────
// FenwickTree2D
// ────────────────────────────────────────────────────────────────
describe("FenwickTree2D", () => {
  test("single point add and query", () => {
    const tree = new FenwickTree2D(3, 3);
    tree.add(1, 1, 5);
    expect(tree.get(1, 1)).toBe(5);
    expect(tree.get(0, 0)).toBe(0);
  });

  test("prefix sum", () => {
    const tree = new FenwickTree2D(3, 3);
    tree.add(0, 0, 1);
    tree.add(1, 1, 2);
    tree.add(2, 2, 3);
    expect(tree.prefixSum(2, 2)).toBe(6);
    expect(tree.prefixSum(1, 1)).toBe(3); // (0,0)=1 + (1,1)=2
    expect(tree.prefixSum(0, 0)).toBe(1);
  });

  test("rangeSum rectangle", () => {
    const tree = new FenwickTree2D(4, 4);
    tree.add(1, 1, 10);
    tree.add(1, 2, 20);
    tree.add(2, 1, 30);
    tree.add(2, 2, 40);
    expect(tree.rangeSum(1, 1, 2, 2)).toBe(100);
    expect(tree.rangeSum(1, 1, 1, 2)).toBe(30);
  });

  test("set overwrites value", () => {
    const tree = new FenwickTree2D(3, 3);
    tree.add(1, 1, 5);
    tree.set(1, 1, 20);
    expect(tree.get(1, 1)).toBe(20);
  });

  test("dimensions", () => {
    const tree = new FenwickTree2D(4, 5);
    expect(tree.rows).toBe(4);
    expect(tree.cols).toBe(5);
  });
});
