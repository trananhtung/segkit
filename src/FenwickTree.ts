/**
 * Fenwick Tree (Binary Indexed Tree / BIT) — the most memory-efficient
 * data structure for prefix sum queries with point updates.
 *
 * All operations are O(log n) and the tree uses exactly n+1 numbers of storage.
 *
 * Use this when you only need prefix-sum queries; use SegmentTree for arbitrary
 * range queries with custom operations.
 *
 * @example
 * const bit = new FenwickTree([1, 2, 3, 4, 5]);
 * bit.prefixSum(3);   // 1+2+3+4 = 10 (0-indexed: indices 0..3)
 * bit.rangeSum(1, 3); // 2+3+4 = 9
 * bit.add(2, 10);     // arr[2] += 10 → [1, 2, 13, 4, 5]
 * bit.rangeSum(1, 3); // 2+13+4 = 19
 */
export class FenwickTree {
  private readonly _n: number;
  private readonly _tree: number[];

  constructor(data?: readonly number[] | number) {
    if (typeof data === "number") {
      // Construct empty tree of given size
      this._n = data;
      this._tree = new Array<number>(data + 1).fill(0);
    } else if (Array.isArray(data) || (data && Symbol.iterator in Object(data))) {
      const arr = [...(data as Iterable<number>)];
      this._n = arr.length;
      // O(n) build using the difference propagation trick
      this._tree = new Array<number>(arr.length + 1).fill(0);
      for (let i = 0; i < arr.length; i++) {
        const idx = i + 1;
        this._tree[idx] = (this._tree[idx] ?? 0) + (arr[i] ?? 0);
        const parent = idx + (idx & -idx);
        if (parent <= arr.length) {
          this._tree[parent] = (this._tree[parent] ?? 0) + (this._tree[idx] ?? 0);
        }
      }
    } else {
      this._n = 0;
      this._tree = [0];
    }
  }

  /**
   * Add `delta` to the element at index `i` (0-indexed). O(log n).
   * To set element i to a new value v, use `add(i, v - get(i))`.
   */
  add(i: number, delta: number): void {
    if (i < 0 || i >= this._n) throw new RangeError(`add: index ${i} out of bounds [0, ${this._n - 1}]`);
    for (let idx = i + 1; idx <= this._n; idx += idx & -idx) {
      this._tree[idx] = (this._tree[idx] ?? 0) + delta;
    }
  }

  /**
   * Set the value at index `i` to `value` (0-indexed). O(log n).
   */
  set(i: number, value: number): void {
    this.add(i, value - this.get(i));
  }

  /**
   * Return the prefix sum from index 0 to `i` inclusive (0-indexed). O(log n).
   */
  prefixSum(i: number): number {
    if (i < 0) return 0;
    if (i >= this._n) i = this._n - 1;
    let sum = 0;
    for (let idx = i + 1; idx > 0; idx -= idx & -idx) {
      sum += this._tree[idx] ?? 0;
    }
    return sum;
  }

  /**
   * Return the sum of elements from index `l` to `r` inclusive (0-indexed). O(log n).
   */
  rangeSum(l: number, r: number): number {
    if (l > r) return 0;
    if (l < 0 || r >= this._n) throw new RangeError(`rangeSum: [${l}, ${r}] out of bounds [0, ${this._n - 1}]`);
    return this.prefixSum(r) - this.prefixSum(l - 1);
  }

  /**
   * Return the value at index `i` (0-indexed). O(log n).
   */
  get(i: number): number {
    return this.rangeSum(i, i);
  }

  /**
   * Find the smallest index `i` such that prefixSum(i) >= target. O(log n).
   * Returns -1 if no such index exists (target > total sum).
   * Useful for weighted random sampling and order-statistics.
   */
  lowerBound(target: number): number {
    let idx = 0;
    let bitMask = 1 << Math.floor(Math.log2(this._n));
    while (bitMask > 0) {
      const next = idx + bitMask;
      if (next <= this._n && (this._tree[next] ?? 0) < target) {
        idx = next;
        target -= this._tree[next] ?? 0;
      }
      bitMask >>= 1;
    }
    return idx < this._n ? idx : -1;
  }

  /** Total sum of all elements. O(log n). */
  get total(): number { return this.prefixSum(this._n - 1); }

  /** Number of elements. */
  get length(): number { return this._n; }
}

/**
 * 2D Fenwick Tree for 2D prefix-sum queries and point updates.
 * Supports O(log m × log n) updates and queries.
 *
 * @example
 * const tree = new FenwickTree2D(3, 3);
 * tree.add(1, 1, 5);
 * tree.prefixSum(2, 2);  // sum of rectangle [0..2][0..2]
 */
export class FenwickTree2D {
  private readonly _rows: number;
  private readonly _cols: number;
  private readonly _tree: number[][];

  constructor(rows: number, cols: number) {
    this._rows = rows;
    this._cols = cols;
    this._tree = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));
  }

  /** Add `delta` to cell (r, c) (0-indexed). O(log m × log n). */
  add(r: number, c: number, delta: number): void {
    for (let i = r + 1; i <= this._rows; i += i & -i) {
      for (let j = c + 1; j <= this._cols; j += j & -j) {
        this._tree[i]![j] = (this._tree[i]![j] ?? 0) + delta;
      }
    }
  }

  /** Set cell (r, c) to `value`. O(log m × log n). */
  set(r: number, c: number, value: number): void {
    this.add(r, c, value - this.get(r, c));
  }

  /** Prefix sum of rectangle [0..r][0..c] (inclusive, 0-indexed). O(log m × log n). */
  prefixSum(r: number, c: number): number {
    if (r < 0 || c < 0) return 0;
    if (r >= this._rows) r = this._rows - 1;
    if (c >= this._cols) c = this._cols - 1;
    let sum = 0;
    for (let i = r + 1; i > 0; i -= i & -i) {
      for (let j = c + 1; j > 0; j -= j & -j) {
        sum += this._tree[i]![j] ?? 0;
      }
    }
    return sum;
  }

  /** Sum of rectangle [r1..r2][c1..c2] (inclusive, 0-indexed). O(log m × log n). */
  rangeSum(r1: number, c1: number, r2: number, c2: number): number {
    return (
      this.prefixSum(r2, c2) -
      this.prefixSum(r1 - 1, c2) -
      this.prefixSum(r2, c1 - 1) +
      this.prefixSum(r1 - 1, c1 - 1)
    );
  }

  /** Value at cell (r, c). O(log m × log n). */
  get(r: number, c: number): number { return this.rangeSum(r, c, r, c); }

  get rows(): number { return this._rows; }
  get cols(): number { return this._cols; }
}
